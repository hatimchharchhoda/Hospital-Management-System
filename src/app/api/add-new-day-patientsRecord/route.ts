import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import dbConnect from '@/lib/dbConnect';
import PendingPatientsModel from '@/models/PendingPatientsModel';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?._id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const body = await req.json();
    const { patientId, treatmentRecord } = body;

    if (!patientId || !treatmentRecord) {
      return NextResponse.json(
        { success: false, message: 'Missing patientId or treatmentRecord' },
        { status: 400 }
      );
    }

    const patient = await PendingPatientsModel.findOne({
      _id: patientId,
      hospitalId: session.user._id,
    });

    if (!patient) {
      return NextResponse.json(
        { success: false, message: 'Patient not found' },
        { status: 404 }
      );
    }

    // Push new treatment record
    patient.treatmentRecords.push(treatmentRecord);
    await patient.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Treatment record added successfully',
        patient,
      },
      { status: 200 }
    );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error adding treatment record:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error', error: error.message },
      { status: 500 }
    );
  }
}