import mongoose from 'mongoose';

const AlertSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: {
    type: String,
    required: true,
    default: 'Overall', // 'Overall' or specific like 'Groceries'
  },
  thresholdAmount: {
    type: Number,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

AlertSchema.index({ user: 1, category: 1 }, { unique: true });

export default mongoose.model('Alert', AlertSchema);
