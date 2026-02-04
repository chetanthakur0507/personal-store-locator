import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function GET() {
  try {
    await connectDB();
    const users = await User.find({}).sort({ createdAt: -1 }).lean();
    const data = users.map((u: any) => ({
      id: u._id.toString(),
      username: u.username,
      role: u.role,
      name: u.name,
      createdAt: u.createdAt,
    }));

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { username, password, name } = body || {};

    if (!username || !password || !name) {
      return NextResponse.json(
        { success: false, error: 'Username, password, and name are required' },
        { status: 400 }
      );
    }

    const exists = await User.findOne({ username });
    if (exists) {
      return NextResponse.json(
        { success: false, error: 'Username already exists' },
        { status: 409 }
      );
    }

    const created = await User.create({
      username,
      password,
      name,
      role: 'user',
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          id: created._id.toString(),
          username: created.username,
          role: created.role,
          name: created.name,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
