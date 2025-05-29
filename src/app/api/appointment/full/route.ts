import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import dbConnect from '@/lib/dbConnect';
import AppointmentModel from '@/models/AppointmentModel';
import { addDays, format } from 'date-fns';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?._id) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const hospitalId = session.user._id;
    const today = new Date();
    const fullDates: string[] = [];

    for (let i = 0; i < 30; i++) {
      const date = addDays(today, i);
      // Create start and end of day
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const count = await AppointmentModel.countDocuments({
        hospitalId,
        appointmentDate: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      });

      if (count >= 15) {
        fullDates.push(format(date, 'yyyy-MM-dd'));
      }
    }
    console.log(fullDates);

    return NextResponse.json({ success: true, fullDates }, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Full appointment dates error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}