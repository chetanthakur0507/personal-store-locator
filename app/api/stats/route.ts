import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Item from '@/lib/models/Item';

export async function GET() {
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

    return NextResponse.json(
      {
        success: true,
        data: {
          totalItems: total,
          totalStock: totalStock[0]?.total || 0,
          categories: stats,
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
