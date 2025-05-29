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
    const { date } = await req.json();

    // If date not provided, use today's date
    const targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(0, 0, 0, 0);

    const nextDay = new Date(targetDate);
    nextDay.setDate(targetDate.getDate() + 1);

    const appointments = await AppointmentModel.find({
      hospitalId,
      appointmentDate: {
        $gte: targetDate,
        $lt: nextDay,
      },
    }).sort({ appointmentTime: 1 });

    return NextResponse.json({ success: true, appointments });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Get appointment error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}