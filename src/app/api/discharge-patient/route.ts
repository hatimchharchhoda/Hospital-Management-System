import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import PendingPatientsModel from "@/models/PendingPatientsModel";
import PatientsRecordModel, { AdmissionSummary } from "@/models/PatientsRecordModel";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?._id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { patientId } = await req.json();
    const hospitalId = session.user._id;
    console.log(patientId); 
    const pendingPatient = await PendingPatientsModel.findOne({ _id:patientId, hospitalId });

    if (!pendingPatient) {
      return NextResponse.json({ success: false, message: "Pending patient not found." }, { status: 404 });
    }

    const patient = pendingPatient.patientId;

    if (pendingPatient.status === "discharged") {
      return NextResponse.json({ success: false, message: "Patient already discharged" }, { status: 400 });
    }

    const treatmentRecords = pendingPatient.treatmentRecords || [];
    if (treatmentRecords.length === 0) {
      return NextResponse.json({ success: false, message: "No treatment records available." }, { status: 400 });
    }

    // Calculate costs
    let doctorFees = 0, roomCost = 0, operationCost = 0, otherCharges = 0;
    let bottleCost = 0, injectionCost = 0, medicineCost = 0;

    for (const record of treatmentRecords) {
      doctorFees += record.doctorFees || 0;
      roomCost += record.room?.roomPrice || 0;
      operationCost += record.operationCost || 0;
      otherCharges += record.otherCost || 0;

      bottleCost += (record.bottles?.count || 0) * (record.bottles?.price || 0);
      injectionCost += (record.injections?.count || 0) * (record.injections?.price || 0);

      if (record.medicines?.length) {
        for (const med of record.medicines) {
          medicineCost += (med.quantity || 0) * (med.price || 0);
        }
      }
    }

    const totalBill = doctorFees + roomCost + operationCost + otherCharges + bottleCost + injectionCost + medicineCost;

    const dateOfAdmission = pendingPatient.dateOfAdmission;
    const dateOfDischarge = treatmentRecords[treatmentRecords.length - 1].date || new Date();

    const admissionSummary: AdmissionSummary = {
      dateOfAdmission,
      dateOfDischarge,
      assignedDoctorName: pendingPatient.assignedDoctorName || null,
      doctorFees,
      roomCost,
      operationCost,
      otherCharges,
      bottleCost,
      medicineCost: medicineCost,
      injectionCost: injectionCost, 
      totalBill,
    };

    // Check if old patient
    const existingPatient = await PatientsRecordModel.findOne({ patient, hospitalId });

    if (existingPatient) {
      existingPatient.admissions.push(admissionSummary);
      existingPatient.name = pendingPatient.name;
      existingPatient.mobile = pendingPatient.mobile;
      existingPatient.address = pendingPatient.address;
      await existingPatient.save();
    } else {
      // New patient
      await PatientsRecordModel.create({
        patientId:patient,
        hospitalId,
        name: pendingPatient.name,
        mobile: pendingPatient.mobile,
        address: pendingPatient.address,
        admissions: [admissionSummary],
      });
    }

    // Remove from pending patients
    await PendingPatientsModel.findByIdAndUpdate( pendingPatient._id, { status:"discharged" });
    await PendingPatientsModel.findByIdAndDelete(pendingPatient._id);

    return NextResponse.json(
      { success: true, message: "Patient discharged"},
      { status: 200 }
    );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Discharge error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}