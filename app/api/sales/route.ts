import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
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
      return {
        start: shiftFromIst(startIst),
        end: shiftFromIst(endIst),
        startIst,
        endIst,
        label: 'Yesterday',
      };
    }
    case 'last7': {
      startIst.setDate(startIst.getDate() - 6);
      startIst.setHours(0, 0, 0, 0);
      endIst.setHours(23, 59, 59, 999);
      return {
        start: shiftFromIst(startIst),
        end: shiftFromIst(endIst),
        startIst,
        endIst,
        label: 'Last 7 Days',
      };
    }
    case 'today':
    default: {
      startIst.setHours(0, 0, 0, 0);
      endIst.setHours(23, 59, 59, 999);
      return {
        start: shiftFromIst(startIst),
        end: shiftFromIst(endIst),
        startIst,
        endIst,
        label: 'Today',
      };
    }
  }
}

const dayFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Kolkata',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

function buildDailySeries(startIst: Date, endIst: Date) {
  const days: string[] = [];
  const cursor = new Date(startIst);
  while (cursor <= endIst) {
    days.push(dayFormatter.format(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const range = request.nextUrl.searchParams.get('range');
    const { start, end, startIst, endIst, label } = getDateRange(range);

    const match = { soldAt: { $gte: start, $lte: end } };

    const summaryAgg = await Sale.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          totalUnits: { $sum: '$quantity' },
          totalRevenue: { $sum: '$totalAmount' },
          totalOrders: { $sum: 1 },
        },
      },
    ]);

    const itemsAgg = await Sale.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$itemName',
          totalUnits: { $sum: '$quantity' },
          totalRevenue: { $sum: '$totalAmount' },
        },
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 20 },
    ]);

    const dailyAgg = await Sale.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$soldAt',
              timezone: 'Asia/Kolkata',
            },
          },
          totalUnits: { $sum: '$quantity' },
          totalRevenue: { $sum: '$totalAmount' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const sales = await Sale.find(match)
      .sort({ soldAt: -1 })
      .limit(50)
      .select('itemName quantity priceAtSale totalAmount soldAt');

    const days = buildDailySeries(startIst, endIst);
    const dailyMap = new Map(
      dailyAgg.map((d) => [d._id, { totalUnits: d.totalUnits, totalRevenue: d.totalRevenue }])
    );

    const daily = days.map((date) => {
      const entry = dailyMap.get(date) || { totalUnits: 0, totalRevenue: 0 };
      return { date, ...entry };
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          range: range || 'today',
          label,
          start,
          end,
          summary: {
            totalUnits: summaryAgg[0]?.totalUnits || 0,
            totalRevenue: summaryAgg[0]?.totalRevenue || 0,
            totalOrders: summaryAgg[0]?.totalOrders || 0,
          },
          items: itemsAgg.map((item) => ({
            itemName: item._id,
            totalUnits: item.totalUnits,
            totalRevenue: item.totalRevenue,
          })),
          daily,
          sales: sales.map((sale) => ({
            id: sale._id,
            itemName: sale.itemName,
            quantity: sale.quantity,
            priceAtSale: sale.priceAtSale,
            totalAmount: sale.totalAmount,
            soldAt: sale.soldAt,
          })),
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
