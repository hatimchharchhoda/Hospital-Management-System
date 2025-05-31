import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import AppointmentModel from "@/models/AppointmentModel";

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?._id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const hospitalId = session.user._id;
    const { appointmentId, newDate, newTime } = await req.json();

    const date = new Date(newDate);
    date.setHours(0, 0, 0, 0);

    if (!newDate) {
      return NextResponse.json({ success: false, message: "Date is required" }, { status: 400 });
    }

    if (!newTime) {
      return NextResponse.json({ success: false, message: "Time is required" }, { status: 400 });
    }

    // Check for duplicate time on the same day
    const existing = await AppointmentModel.findOne({
      _id: { $ne: appointmentId },
      hospitalId,
      appointmentDate: date,
      appointmentTime: newTime,
    });

    if (existing) {
      return NextResponse.json({ success: false, message: "Another appointment already exists at this time." }, { status: 400 });
    }

    // Check max 15 for the day
    const countForDate = await AppointmentModel.countDocuments({
      _id: { $ne: appointmentId },
      hospitalId,
      appointmentDate: date,
    });

    if (countForDate >= 15) {
      return NextResponse.json({ success: false, message: "Max appointments reached for that date." }, { status: 400 });
    }

    // Update appointment
    const updated = await AppointmentModel.findByIdAndUpdate(
      appointmentId,
      {
        appointmentDate: date,
        appointmentTime: newTime,
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ success: false, message: "Appointment not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Appointment updated.", data: updated });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Update appointment error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}