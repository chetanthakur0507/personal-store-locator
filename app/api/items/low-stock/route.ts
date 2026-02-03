import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Item from '@/lib/models/Item';

export async function GET() {
  try {
    await connectDB();

    const lowStockItems = await Item.find({
      $expr: {
        $lte: ['$quantity', { $ifNull: ['$minStockLevel', 0] }],
      },
    });

    return NextResponse.json(
      { success: true, data: lowStockItems },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
