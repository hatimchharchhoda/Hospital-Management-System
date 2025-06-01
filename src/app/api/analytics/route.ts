// /app/api/analytics/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import PatientsRecordModel from "@/models/PatientsRecordModel";
import mongoose from "mongoose";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?._id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { year, month } = await req.json();
    if (!year) {
      return NextResponse.json({ success: false, message: "Year is required" }, { status: 400 });
    }

    await dbConnect();
    const hospitalId = new mongoose.Types.ObjectId(session.user._id);

    const start = new Date(year, month ? month - 1 : 0, 1);
    const end = new Date(year, month ? month : 12, 0, 23, 59, 59, 999);

    const records = await PatientsRecordModel.aggregate([
      { $match: { hospitalId } },
      { $unwind: "$admissions" },
      {
        $match: {
          "admissions.dateOfAdmission": { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: { $month: "$admissions.dateOfAdmission" },
          totalRevenue: { $sum: "$admissions.totalBill" },
          admissions: { $sum: 1 },
          doctorFees: { $sum: "$admissions.doctorFees" },
          operationCost: { $sum: "$admissions.operationCost" },
          bottleCost: { $sum: "$admissions.bottleCost" },
          injectionCost: { $sum: "$admissions.injectionCost" },
          medicineCost: { $sum: "$admissions.medicineCost" },
          roomCost: { $sum: "$admissions.roomCost" },
          otherCharges: { $sum: "$admissions.otherCharges" },
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const monthData = Array.from({ length: 12 }).map((_, i) => {
      const month = i + 1;
      const record = records.find((r) => r._id === month);
      return {
        month,
        revenue: record?.totalRevenue || 0,
        admissions: record?.admissions || 0,
        doctorFees: record?.doctorFees || 0,
        operationCost: record?.operationCost || 0,
        medicineCost: record?.medicineCost || 0,
        injectionCost: record?.injectionCost || 0,
        bottleCost: record?.bottleCost || 0,
        roomCost: record?.roomCost || 0,
        otherCharges: record?.otherCharges || 0,
      };
    });

    const totalRevenue = monthData.reduce((sum, m) => sum + m.revenue, 0);
    const totalAdmissions = monthData.reduce((sum, m) => sum + m.admissions, 0);

    return NextResponse.json({
      success: true,
      analytics: {
        totalRevenue,
        totalPatients: totalAdmissions,
        data: monthData
      }
    });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}