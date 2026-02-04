import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { username, password } = body || {};

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ username }).lean();

    if (!existingUser) {
      // If no admin exists, allow first login to create admin
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount === 0) {
        const created = await User.create({
          username,
          password,
          role: 'admin',
          name: 'Store Owner',
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
            message: 'Admin account created',
          },
          { status: 201 }
        );
      }

      return NextResponse.json(
        { success: false, error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    if (existingUser.password !== password) {
      return NextResponse.json(
        { success: false, error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          id: existingUser._id.toString(),
          username: existingUser.username,
          role: existingUser.role,
          name: existingUser.name,
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
