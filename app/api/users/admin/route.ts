import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { username, password, name, currentPassword } = body || {};

    if (!username || !password || !name) {
      return NextResponse.json(
        { success: false, error: 'Username, password, and name are required' },
        { status: 400 }
      );
    }

    const existingAdmin = await User.findOne({ role: 'admin' });

    if (existingAdmin) {
      if (!currentPassword || existingAdmin.password !== currentPassword) {
        return NextResponse.json(
          { success: false, error: 'Invalid admin password' },
          { status: 401 }
        );
      }

      existingAdmin.username = username;
      existingAdmin.password = password;
      existingAdmin.name = name;
      await existingAdmin.save();

      return NextResponse.json(
        {
          success: true,
          data: {
            id: existingAdmin._id.toString(),
            username: existingAdmin.username,
            role: existingAdmin.role,
            name: existingAdmin.name,
          },
        },
        { status: 200 }
      );
    }

    const created = await User.create({
      username,
      password,
      name,
      role: 'admin',
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
