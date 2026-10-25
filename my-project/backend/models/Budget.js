const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
    },
    limit: {
      type: Number,
      required: [true, 'Please provide a budget limit'],
    },
    month: {
      type: Number,
      required: true,
    },
    year: {
      type: Number,
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
  },
  { timestamps: true }
);

BudgetSchema.index({ user: 1, category: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Budget', BudgetSchema);
