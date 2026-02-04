import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = params;
    const body = await request.json();
    const { username, password, name } = body || {};

    if (!username || !name) {
      return NextResponse.json(
        { success: false, error: 'Username and name are required' },
        { status: 400 }
      );
    }

    const existing = await User.findOne({ username, _id: { $ne: id } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Username already exists' },
        { status: 409 }
      );
    }

    const update: any = { username, name };
    if (password) {
      update.password = password;
    }

    const updated = await User.findByIdAndUpdate(id, update, { new: true });

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          id: updated._id.toString(),
          username: updated.username,
          role: updated.role,
          name: updated.name,
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

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = params;

    const deleted = await User.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'User deleted' },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
