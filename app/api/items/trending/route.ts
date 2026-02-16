import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Item from '@/lib/models/Item';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const limitParam = request.nextUrl.searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam) : 4;
    const days = 7; // Last 7 days

    // Calculate date 7 days ago
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - days);

    // Query items sold in last 7 days
    const items = await Item.find({
      lastSoldAt: { $gte: sevenDaysAgo },
      totalSoldUnits: { $gt: 0 }
    })
      .sort({ totalSoldUnits: -1, saleCount: -1, lastSoldAt: -1 })
      .limit(limit);

    return NextResponse.json(
      { 
        success: true, 
        data: items,
        period: 'This Week',
        daysBack: days 
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
