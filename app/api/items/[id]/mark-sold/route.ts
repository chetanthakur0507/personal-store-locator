import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Item from '@/lib/models/Item';
import Sale from '@/lib/models/Sale';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();

    const body = await request.json();
    const { quantity = 1 } = body; // quantity of items sold

    if (quantity < 1) {
      return NextResponse.json(
        { success: false, error: 'Quantity must be at least 1' },
        { status: 400 }
      );
    }

    const item = await Item.findById(id);

    if (!item) {
      return NextResponse.json(
        { success: false, error: 'Item not found' },
        { status: 404 }
      );
    }

    // Check if there's enough quantity
    if (item.quantity < quantity) {
      return NextResponse.json(
        { success: false, error: `Only ${item.quantity} units available` },
        { status: 400 }
      );
    }

    // Update item
    item.quantity -= quantity;
    item.totalSoldUnits += quantity;
    item.saleCount += 1;
    item.lastSoldAt = new Date();
    
    await item.save();

    const totalAmount = (item.price || 0) * quantity;
    await Sale.create({
      itemId: item._id,
      itemName: item.name,
      priceAtSale: item.price || 0,
      quantity,
      totalAmount,
      soldAt: new Date(),
    });

    return NextResponse.json(
      { 
        success: true, 
        data: item,
        message: `${quantity} unit(s) marked as sold. ${item.quantity} units remaining.`
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
