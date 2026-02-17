import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Item from '@/lib/models/Item';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchQuery = request.nextUrl.searchParams.get('search') || '';
    const category = request.nextUrl.searchParams.get('category') || '';
    const trending = request.nextUrl.searchParams.get('trending') === 'true';
    const limitParam = request.nextUrl.searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam) : 10;

    const query: any = {};

    if (searchQuery) {
      query.$or = [
        { name: { $regex: searchQuery, $options: 'i' } },
        { category: { $regex: searchQuery, $options: 'i' } },
        { description: { $regex: searchQuery, $options: 'i' } },
      ];
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    let sortOrder: any = { createdAt: -1 };
    
    // If trending is requested, sort by totalSoldUnits and saleCount
    if (trending) {
      sortOrder = { totalSoldUnits: -1, saleCount: -1, createdAt: -1 };
    }

    const items = await Item.find(query).sort(sortOrder).limit(limit);

    return NextResponse.json(
      { success: true, data: items },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const item = await Item.create(body);

    return NextResponse.json(
      { success: true, data: item },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
