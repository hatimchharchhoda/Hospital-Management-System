import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import PendingPatientsModel, { PatientType, TreatmentRecordType } from "@/models/PendingPatientsModel";
import PatientsRecordModel from "@/models/PatientsRecordModel";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?._id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    const body = await req.json();
    const {
      patientId: providedPatientId,
      assignedDoctorName,
      treatmentRecords,
      name,
      address,
      mobile,
    }: PatientType = body;

    // ✅ Basic validation
    if (!name || !mobile) {
      return NextResponse.json(
        { success: false, message: "Name and mobile number are required" },
        { status: 400 }
      );
    }

    if (!/^\d{10}$/.test(mobile)) {
      return NextResponse.json(
        { success: false, message: "Mobile number must be exactly 10 digits" },
        { status: 400 }
      );
    }

    if (!treatmentRecords || !Array.isArray(treatmentRecords) || treatmentRecords.length === 0) {
      return NextResponse.json(
        { success: false, message: "At least one treatment record is required" },
        { status: 400 }
      );
    }

    const {
      date,
      doctorFees,
      room,
      bottles,
      injections,
      medicines,
      operationCost,
      otherCost,
    }: TreatmentRecordType = treatmentRecords[0];
    if (!date) {
      return NextResponse.json(
        { success: false, message: "Treatment date is required in record" },
        { status: 400 }
      );
    }

    if (!doctorFees || isNaN(Number(doctorFees))) {
      return NextResponse.json(
        { success: false, message: "Doctor fees must be provided and valid in record" },
        { status: 400 }
      );
    }

    if (Number(doctorFees) < 0) {
      return NextResponse.json(
        { success: false, message: "Doctor fees cannot be negative in record" },
        { status: 400 }
      );
    }

    console.log(room?.bedNo);

    // 🔁 Room validation
    if (room && (room.roomNo || room.bedNo || room.roomCategory || room.roomPrice)) {
      if (!room.roomNo || !room.bedNo || !room.roomCategory || !room.roomPrice) {
        return NextResponse.json(
          { success: false, message: "All room fields must be filled if one is filled in record" },
          { status: 400 }
        );
      }
      if (Number(room.roomPrice) < 0) {
        return NextResponse.json(
          { success: false, message: "Room price cannot be negative in record" },
          { status: 400 }
        );
      }
    }

    // 🔁 Bottles validation
    if (bottles && (bottles.count || bottles.price)) {
      if (!bottles.count || !bottles.price) {
        return NextResponse.json(
          { success: false, message: "Both bottle count and price must be filled in record" },
          { status: 400 }
        );
      }
      if (Number(bottles.count) < 0 || Number(bottles.price) < 0) {
        return NextResponse.json(
          { success: false, message: "Bottle count and price cannot be negative in record" },
          { status: 400 }
        );
      }
    }

    // 🔁 Injections validation
    if (injections && (injections.count || injections.price)) {
      if (!injections.count || !injections.price) {
        return NextResponse.json(
          { success: false, message: "Both injection count and price must be filled in record" },
          { status: 400 }
        );
      }
      if (Number(injections.count) < 0 || Number(injections.price) < 0) {
        return NextResponse.json(
          { success: false, message: "Injection count and price cannot be negative in record" },
          { status: 400 }
        );
      }
    }

    // 🔁 Medicines validation
    if (medicines && medicines.length > 0) {
      for (const [medIndex, med] of medicines.entries()) {
        if (med && (med.name || med.price || med.quantity)) {
          if (!med.name || !med.quantity || !med.price) {
            return NextResponse.json(
              { success: false, message: `All medicine fields must be filled in record medicine ${medIndex + 1}` },
              { status: 400 }
            );
          }
          if (Number(med.quantity) < 0 || Number(med.price) < 0) {
            return NextResponse.json(
              { success: false, message: `Medicine quantity and price cannot be negative in record medicine ${medIndex + 1}` },
              { status: 400 }
            );
          }
        }
      }
    }

    // 🔁 Other Costs
    if ((operationCost && Number(operationCost) < 0) || (otherCost && Number(otherCost) < 0)) {
      return NextResponse.json(
        { success: false, message: "Operation/Other costs cannot be negative in record" },
        { status: 400 }
      );
    }

    if (providedPatientId) {
      // 1. Check if patient exists in the past records
      const existingInRecord = await PatientsRecordModel.findOne({ patientId: providedPatientId });

      if (!existingInRecord) {
        return NextResponse.json(
          { success: false, message: "Patient ID not found in records" },
          { status: 404 }
        );
      }

      // 2. Check if already in pending state
      const alreadyPending = await PendingPatientsModel.findOne({
        patientId: providedPatientId,
        hospitalId: session.user._id,
      });

      if (alreadyPending) {
        return NextResponse.json(
          { success: false, message: "Patient is already active in this hospital" },
          { status: 409 }
        );
      }
    }

    // ✅ Create new pending patient
    const newPatient = await PendingPatientsModel.create({
      ...(providedPatientId && { patientId: providedPatientId }),
      assignedDoctorName: assignedDoctorName ?? null,
      hospitalId: session.user._id,
      name,
      address: address ?? "",
      mobile,
      treatmentRecords: Array.isArray(treatmentRecords) ? treatmentRecords : [],
    });

    return NextResponse.json(
      {
        success: true,
        message: "Patient added successfully",
        patient: newPatient,
      },
      { status: 201 }
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error creating patient:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}