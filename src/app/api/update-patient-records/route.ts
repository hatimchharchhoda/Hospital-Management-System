import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import dbConnect from '@/lib/dbConnect';
import PendingPatientsModel, { TreatmentRecordType } from '@/models/PendingPatientsModel';

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

    const {
      doctorFees,
      room,
      bottles,
      injections,
      medicines,
      operationCost,
      otherCost,
    }: TreatmentRecordType = updatedTreatmentRecord;

    if (!doctorFees || isNaN(Number(doctorFees))) {
      return NextResponse.json(
        { success: false, message: "Doctor fees must be provided and valid in record" },
        { status: 202 }
      );
    }

    if (Number(doctorFees) < 0) {
      return NextResponse.json(
        { success: false, message: "Doctor fees cannot be negative in record" },
        { status: 202 }
      );
    }

    // 🔁 Room validation
    if (room && (room.roomNo || room.bedNo || room.roomPrice)) {
      if (!room.roomNo || !room.bedNo || !room.roomCategory || !room.roomPrice) {
        return NextResponse.json(
          { success: false, message: "All room fields must be filled if one is filled in record" },
          { status: 202 }
        );
      }
      if (Number(room.roomPrice) < 0) {
        return NextResponse.json(
          { success: false, message: "Room price cannot be negative in record" },
          { status: 202 }
        );
      }
    }

    // 🔁 Bottles validation
    if (bottles && (bottles.count || bottles.price)) {
      if (!bottles.count || !bottles.price) {
        return NextResponse.json(
          { success: false, message: "Both bottle count and price must be filled in record" },
          { status: 202 }
        );
      }
      if (Number(bottles.count) < 0 || Number(bottles.price) < 0) {
        return NextResponse.json(
          { success: false, message: "Bottle count and price cannot be negative in record" },
          { status: 202 }
        );
      }
    }

    // 🔁 Injections validation
    if (injections && (injections.count || injections.price)) {
      if (!injections.count || !injections.price) {
        return NextResponse.json(
          { success: false, message: "Both injection count and price must be filled in record" },
          { status: 202 }
        );
      }
      if (Number(injections.count) < 0 || Number(injections.price) < 0) {
        return NextResponse.json(
          { success: false, message: "Injection count and price cannot be negative in record" },
          { status: 202 }
        );
      }
    }

    // 🔁 Medicines validation
    if (medicines && medicines.length > 0) {
      for (const [medIndex, med] of medicines.entries()) {
        if (med && (med.name || med.price || med.quantity)) {
          if (!med.name || !med.quantity || !med.price) {
            return NextResponse.json(
              { success: false, message: `All medicine fields must be filled in record medicine ${medIndex + 1}` },
              { status: 202 }
            );
          }
          if (Number(med.quantity) < 0 || Number(med.price) < 0) {
            return NextResponse.json(
              { success: false, message: `Medicine quantity and price cannot be negative in record medicine ${medIndex + 1}` },
              { status: 202 }
            );
          }
        }
      }
    }

    // 🔁 Other Costs
    if ((operationCost && Number(operationCost) < 0) || (otherCost && Number(otherCost) < 0)) {
      return NextResponse.json(
        { success: false, message: "Operation/Other costs cannot be negative in record" },
        { status: 202 }
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
    console.error("Server error:", error); 
    return NextResponse.json(
      { success: false, message: 'Internal Server Error', error: error.message },
      { status: 500 }
    );
  }
}