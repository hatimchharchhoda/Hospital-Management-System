import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import dbConnect from '@/lib/dbConnect';
import PendingPatientsModel from '@/models/PendingPatientsModel';

export async function PUT(req: Request) {
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
    const { patientId, date, updatedTreatmentRecord } = body;
    
    if (!patientId || !date || !updatedTreatmentRecord) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }
    const _id = patientId;
    const patient = await PendingPatientsModel.findOne({
      _id,
      hospitalId: session.user._id,
    });
    
    if (!patient) {
      return NextResponse.json(
        { success: false, message: 'Patient not found' },
        { status: 404 }
      );
    }

    const index = patient.treatmentRecords.findIndex(
      (record) =>
        new Date(record.date).toISOString() === new Date(date).toISOString()
    );

    if (index === -1) {
      return NextResponse.json(
        { success: false, message: 'Treatment record not found' },
        { status: 404 }
      );
    }

    // Keep original date, replace everything else
    patient.treatmentRecords[index] = {
      ...updatedTreatmentRecord,
      date: patient.treatmentRecords[index].date,
    };

    await patient.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Treatment record updated successfully',
        patient,
      },
      { status: 200 }
    );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error updating treatment:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error', error: error.message },
      { status: 500 }
    );
  }
}