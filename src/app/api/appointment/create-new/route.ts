import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import AppointmentModel from "@/models/AppointmentModel";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?._id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const hospitalId = session.user._id;
    const { patientName, address, mobile, appointmentDate, appointmentTime } = await req.json();

    const date = new Date(appointmentDate);
    date.setHours(0, 0, 0, 0);

    // Check for duplicate time on the same day
    const existingSameTime = await AppointmentModel.findOne({
      hospitalId,
      appointmentDate: date,
      appointmentTime,
    });

    if (existingSameTime) {
      return NextResponse.json({ success: false, message: "Time slot already booked." }, { status: 400 });
    }

    // Check if max 15 appointments exist for that day
    const countForDate = await AppointmentModel.countDocuments({
      hospitalId,
      appointmentDate: date,
    });

    if (countForDate >= 15) {
      return NextResponse.json({ success: false, message: "Max 15 appointments reached for the day." }, { status: 400 });
    }

    // Delete past appointments
    await AppointmentModel.deleteMany({
      hospitalId,
      appointmentDate: { $lt: new Date().setHours(0, 0, 0, 0) },
    });

    // Create new appointment
    await AppointmentModel.create({
      patientName,
      address,
      mobile,
      hospitalId,
      appointmentDate: date,
      appointmentTime,
    });

    return NextResponse.json({ success: true, message: "Appointment created." }, { status: 201 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Create appointment error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}