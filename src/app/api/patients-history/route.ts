import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import PatientsRecordModel, { PatientSummaryType } from "@/models/PatientsRecordModel";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?._id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    const records = await PatientsRecordModel.find({
      hospitalId: session.user._id,
    }).lean();

    const result: Record<
      string,
      {
        _id: string;
        name: string;
        mobile: string;
        address: string;
        admissions: PatientSummaryType["admissions"];
      }
    > = {};

    records.forEach((record) => {
      result[record.patientId] = {
        _id: record._id.toString(),
        name: record.name,
        mobile: record.mobile,
        address: record.address,
        admissions: record.admissions.sort((a, b) =>
          new Date(b.dateOfAdmission).getTime() - new Date(a.dateOfAdmission).getTime()
        ),
      };
    });

    return NextResponse.json({ success: true, data: result }, { status: 200 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error fetching patients:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}