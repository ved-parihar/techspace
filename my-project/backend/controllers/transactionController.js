const Transaction = require('../models/Transaction');

exports.getAll = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: transactions.length, data: transactions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { merchant, category, amount, type, icon, color, date } = req.body;

    if (!merchant || amount === undefined || !type) {
      return res.status(400).json({ success: false, message: 'Merchant, amount, and type are required' });
    }

    const numAmount = Number(amount);
    const signedAmount = type === 'expense' ? -Math.abs(numAmount) : Math.abs(numAmount);

    const transaction = await Transaction.create({
      user: req.user._id,
      merchant,
      category: category || 'Shopping',
      amount: signedAmount,
      type,
      icon: icon || 'bolt',
      color: color || (type === 'income' ? 'green' : 'blue'),
      date: date ? new Date(date) : new Date(),
    });

    res.status(201).json({ success: true, data: transaction });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    let transaction = await Transaction.findOne({ _id: req.params.id, user: req.user._id });
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    if (req.body.amount !== undefined || req.body.type) {
      const type = req.body.type || transaction.type;
      const amount = req.body.amount !== undefined ? Number(req.body.amount) : Math.abs(transaction.amount);
      req.body.amount = type === 'expense' ? -Math.abs(amount) : Math.abs(amount);
    }

    transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, data: transaction });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }
    res.json({ success: true, message: 'Transaction deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
