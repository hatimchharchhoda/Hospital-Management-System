import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import AppointmentModel from "@/models/AppointmentModel";

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?._id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const hospitalId = session.user._id;
    const { appointmentId } = await req.json();
    console.log(appointmentId);
    
    const deleted = await AppointmentModel.findOneAndDelete({
      _id: appointmentId,
      hospitalId,
    });

    if (!deleted) {
      return NextResponse.json({ success: false, message: "Appointment not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Appointment deleted." });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Delete appointment error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}