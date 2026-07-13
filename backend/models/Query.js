import mongoose from 'mongoose';

const querySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    customerName: { type: String, required: true, trim: true },
    customerEmail: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['open', 'in-progress', 'resolved', 'closed'],
      default: 'open',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Query', querySchema);
