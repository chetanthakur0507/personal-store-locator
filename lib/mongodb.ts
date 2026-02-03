import mongoose from 'mongoose';

let cached = global.mongoose as any;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

function ensureDatabaseName(uri: string) {
  try {
    const url = new URL(uri);
    if (!url.pathname || url.pathname === '/') {
      url.pathname = '/smart-store';
    }
    return url.toString();
  } catch {
    return uri;
  }
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    const rawUri = process.env.MONGODB_URI;
    if (!rawUri) {
      throw new Error('MONGODB_URI is not set');
    }

    const uri = ensureDatabaseName(rawUri);

    cached.promise = mongoose
      .connect(uri, opts)
      .then((mongoose) => {
        return mongoose;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;

declare global {
  var mongoose: any;
}
