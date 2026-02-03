import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Item from '@/lib/models/Item';

export async function POST() {
  try {
    await connectDB();

    // Check if items already exist
    const existingItems = await Item.countDocuments();
    
    if (existingItems > 0) {
      return NextResponse.json(
        {
          success: true,
          message: `Database already initialized with ${existingItems} items`,
        },
        { status: 200 }
      );
    }

    // Sample data
    const sampleItems = [
      {
        name: 'Laptop',
        category: 'Electronics',
        floor: '1',
        aisle: 'A',
        rack: '1',
        shelf: '1',
        quantity: 15,
        minStockLevel: 5,
        description: 'Dell Laptop 15 inch',
        createdBy: 'admin',
      },
      {
        name: 'Mouse',
        category: 'Electronics',
        floor: '1',
        aisle: 'A',
        rack: '2',
        shelf: '1',
        quantity: 45,
        minStockLevel: 10,
        description: 'Wireless mouse',
        createdBy: 'admin',
      },
      {
        name: 'Keyboard',
        category: 'Electronics',
        floor: '1',
        aisle: 'A',
        rack: '2',
        shelf: '2',
        quantity: 30,
        minStockLevel: 8,
        description: 'Mechanical keyboard',
        createdBy: 'admin',
      },
      {
        name: 'Monitor',
        category: 'Electronics',
        floor: '1',
        aisle: 'B',
        rack: '1',
        shelf: '1',
        quantity: 8,
        minStockLevel: 3,
        description: '24 inch LED monitor',
        createdBy: 'admin',
      },
      {
        name: 'Desk Lamp',
        category: 'Furniture',
        floor: '2',
        aisle: 'C',
        rack: '1',
        shelf: '3',
        quantity: 2,
        minStockLevel: 5,
        description: 'LED desk lamp',
        createdBy: 'admin',
      },
      {
        name: 'Office Chair',
        category: 'Furniture',
        floor: '2',
        aisle: 'D',
        rack: '2',
        shelf: '1',
        quantity: 12,
        minStockLevel: 4,
        description: 'Ergonomic office chair',
        createdBy: 'admin',
      },
      {
        name: 'Filing Cabinet',
        category: 'Furniture',
        floor: '2',
        aisle: 'D',
        rack: '3',
        shelf: '2',
        quantity: 5,
        minStockLevel: 2,
        description: '4-drawer filing cabinet',
        createdBy: 'admin',
      },
      {
        name: 'USB Cable',
        category: 'Accessories',
        floor: '1',
        aisle: 'A',
        rack: '3',
        shelf: '1',
        quantity: 100,
        minStockLevel: 20,
        description: 'USB Type-C cable',
        createdBy: 'admin',
      },
      {
        name: 'Power Bank',
        category: 'Accessories',
        floor: '1',
        aisle: 'B',
        rack: '2',
        shelf: '1',
        quantity: 25,
        minStockLevel: 8,
        description: '20000 mAh power bank',
        createdBy: 'admin',
      },
      {
        name: 'Notebook',
        category: 'Stationery',
        floor: '3',
        aisle: 'E',
        rack: '1',
        shelf: '1',
        quantity: 200,
        minStockLevel: 50,
        description: 'A4 notebook 100 pages',
        createdBy: 'admin',
      },
    ];

    const result = await Item.insertMany(sampleItems);

    return NextResponse.json(
      {
        success: true,
        message: `Database initialized with ${result.length} sample items`,
        itemCount: result.length,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Initialization error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
