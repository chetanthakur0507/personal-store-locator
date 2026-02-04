import mongoose, { Schema, model, models } from 'mongoose';

const ItemSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide item name'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please provide category'],
      trim: true,
    },
    floor: {
      type: String,
      required: [true, 'Please provide floor'],
      trim: true,
    },
    aisle: {
      type: String,
      required: [true, 'Please provide aisle'],
      trim: true,
    },
    rack: {
      type: String,
      required: [true, 'Please provide rack'],
      trim: true,
    },
    shelf: {
      type: String,
      required: [true, 'Please provide shelf'],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Please provide quantity'],
      min: 0,
    },
    minStockLevel: {
      type: Number,
      default: 0,
      min: 0,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    price: {
      type: Number,
      default: 0,
      min: 0,
    },
    image: {
      type: String,
      default: '',
      trim: true,
    },
    createdBy: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default models.Item || model('Item', ItemSchema);
