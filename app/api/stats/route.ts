import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Item from '@/lib/models/Item';
import Sale from '@/lib/models/Sale';

const IST_OFFSET_MINUTES = 330;

function shiftToIst(date: Date) {
  return new Date(date.getTime() + IST_OFFSET_MINUTES * 60 * 1000);
}

function shiftFromIst(date: Date) {
  return new Date(date.getTime() - IST_OFFSET_MINUTES * 60 * 1000);
}

function getDateRange(range: string | null) {
  const now = new Date();
  const nowIst = shiftToIst(now);
  const startIst = new Date(nowIst);
  const endIst = new Date(nowIst);

  switch (range) {
    case 'yesterday': {
      startIst.setDate(startIst.getDate() - 1);
      startIst.setHours(0, 0, 0, 0);
      endIst.setDate(endIst.getDate() - 1);
      endIst.setHours(23, 59, 59, 999);
      return { start: shiftFromIst(startIst), end: shiftFromIst(endIst) };
    }
    case 'last7': {
      startIst.setDate(startIst.getDate() - 6);
      startIst.setHours(0, 0, 0, 0);
      endIst.setHours(23, 59, 59, 999);
      return { start: shiftFromIst(startIst), end: shiftFromIst(endIst) };
    }
    case 'today':
    default: {
      startIst.setHours(0, 0, 0, 0);
      endIst.setHours(23, 59, 59, 999);
      return { start: shiftFromIst(startIst), end: shiftFromIst(endIst) };
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const stats = await Item.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalQty: { $sum: '$quantity' },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const total = await Item.countDocuments();
    const totalStock = await Item.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$quantity' },
        },
      },
    ]);

    const range = request.nextUrl.searchParams.get('range');
    const { start, end } = getDateRange(range);

    const dailySales = await Sale.aggregate([
      {
        $match: {
          soldAt: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: null,
          totalUnits: { $sum: '$quantity' },
          totalRevenue: { $sum: '$totalAmount' },
        },
      },
    ]);

    return NextResponse.json(
      {
        success: true,
        data: {
          totalItems: total,
          totalStock: totalStock[0]?.total || 0,
          categories: stats,
          dailySoldUnits: dailySales[0]?.totalUnits || 0,
          dailyRevenue: dailySales[0]?.totalRevenue || 0,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
