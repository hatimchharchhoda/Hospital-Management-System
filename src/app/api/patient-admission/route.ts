import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import PendingPatientsModel from "@/models/PendingPatientsModel";
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
    } = body;

    // ✅ Basic validation
    if (!name || !mobile) {
      return NextResponse.json(
        { success: false, message: "Name and mobile number are required" },
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