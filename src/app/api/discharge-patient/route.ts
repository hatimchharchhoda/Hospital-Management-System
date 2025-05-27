import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import PendingPatientsModel from "@/models/PendingPatientsModel";
import PatientsRecordModel,{ AdmissionSummary } from "@/models/PatientsRecordModel";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?._id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const patientId = params.id;
    const hospitalId = session.user._id;
    const currentDate = new Date();

    const pendingPatient = await PendingPatientsModel.findOne({
      patientId,
      hospitalId,
    });

    // Prepare default admission summary values
   let admissionSummary: AdmissionSummary = {
      dateOfAdmission: currentDate,
      dateOfDischarge: currentDate,
      assignedDoctorName: null, // ✅ Now valid
      doctorFees: 0,
      bottleCost: 0,
      roomCost: 0,
      medicineCost: 0,
      operationCost: 0,
      otherCharges: 0,
      totalBill: 0,
   };
    if (pendingPatient) {
      if (pendingPatient.status === "discharged") {
        return NextResponse.json({ success: false, message: "Patient already discharged" }, { status: 400 });
      }

      // Extract and calculate costs from treatment records
      const treatmentRecords = pendingPatient.treatmentRecords;
      let bottleCost = 0, medicineCost = 0, operationCost = 0, doctorFees = 0, otherCharges = 0, roomCost = 0;

      for (const record of treatmentRecords) {
        bottleCost += record.bottles?.price || 0;
        operationCost += record.operationCost || 0;
        doctorFees += record.doctorFees || 0;
        otherCharges += record.otherCost || 0;

        medicineCost += record.medicines?.reduce((sum, med) => {
          const quantity = med.quantity || 0;
          const price = med.price || 0;
          return sum + quantity * price;
        }, 0) || 0;

        if (record.room?.roomPrice) {
          roomCost += record.room.roomPrice;
        }
      }

      const totalBill = doctorFees + bottleCost + roomCost + medicineCost + operationCost + otherCharges;

      // Fill summary
      admissionSummary = {
        dateOfAdmission: pendingPatient.dateOfAdmission,
        dateOfDischarge: currentDate,
        assignedDoctorName: pendingPatient.assignedDoctorName || null,
        doctorFees,
        bottleCost,
        roomCost,
        medicineCost,
        operationCost,
        otherCharges,
        totalBill,
      };
    }

    // Check if this patient already exists in PatientsRecordModel under the same hospital
    const existingRecord = await PatientsRecordModel.findOne({ patientId, hospitalId });

    if (existingRecord) {
      // Add new admission to existing patient record
      existingRecord.admissions.push(admissionSummary);
      await existingRecord.save();
    } else {
      // Create new patient record
      await PatientsRecordModel.create({
        patientId,
        name: pendingPatient?.name || "N/A",
        address: pendingPatient?.address || "N/A",
        mobile: pendingPatient?.mobile || "N/A",
        hospitalId,
        admissions: [admissionSummary],
      });
    }

    // Delete the pending patient after successful discharge
    if (pendingPatient) {
      await PendingPatientsModel.findByIdAndDelete(pendingPatient._id);
    }

    return NextResponse.json({
      success: true,
      message: "Patient discharged, record saved, and removed from pending list.",
    }, { status: 200 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Discharge error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}