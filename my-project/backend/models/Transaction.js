const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    merchant: {
      type: String,
      required: [true, 'Please provide a merchant or source'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      default: 'Shopping',
    },
    amount: {
      type: Number,
      required: [true, 'Please provide an amount'],
    },
    type: {
      type: String,
      enum: ['income', 'expense'],
      required: true,
    },
    icon: {
      type: String,
      default: 'bolt',
    },
    color: {
      type: String,
      default: 'blue',
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Transaction', TransactionSchema);
