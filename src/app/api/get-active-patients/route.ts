import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import PendingPatientsModel from "@/models/PendingPatientsModel";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?._id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const hospitalId = session.user._id;

    const activePatients = await PendingPatientsModel.find({
      hospitalId,
      status: "pending",
    })
      .sort({ dateOfAdmission: -1 })
      .lean();

    return NextResponse.json({ success: true, patients: activePatients, message: "Patients fetched successfully" }, { status: 200 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error fetching active patients:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}