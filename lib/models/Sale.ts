import mongoose, { Schema, model, models } from 'mongoose';

const SaleSchema = new Schema(
  {
    itemId: {
      type: Schema.Types.ObjectId,
      ref: 'Item',
      required: true,
    },
    itemName: {
      type: String,
      required: true,
      trim: true,
    },
    priceAtSale: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    soldAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default models.Sale || model('Sale', SaleSchema);