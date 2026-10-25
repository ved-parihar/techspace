const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');

const defaultCategoryConfig = {
  'Food & Drinks': { icon: 'coffee', color: 'orange', limit: 800 },
  'Shopping': { icon: 'bag', color: 'purple', limit: 600 },
  'Housing': { icon: 'home', color: 'blue', limit: 1600 },
  'Transport': { icon: 'car', color: 'yellow', limit: 500 },
};

exports.getAll = async (req, res) => {
  try {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    let budgets = await Budget.find({
      user: req.user._id,
      month: currentMonth,
      year: currentYear,
    });

    // If user has no budgets for this month yet, seed default ones
    if (budgets.length === 0) {
      const defaults = Object.entries(defaultCategoryConfig).map(([cat, cfg]) => ({
        user: req.user._id,
        category: cat,
        limit: cfg.limit,
        month: currentMonth,
        year: currentYear,
        icon: cfg.icon,
        color: cfg.color,
      }));
      budgets = await Budget.insertMany(defaults);
    }

    // Enrich with dynamic spent calculation from transactions in this month
    const startOfMonth = new Date(currentYear, currentMonth - 1, 1);
    const endOfMonth = new Date(currentYear, currentMonth, 1);

    const enriched = await Promise.all(
      budgets.map(async (b) => {
        const agg = await Transaction.aggregate([
          {
            $match: {
              user: req.user._id,
              category: b.category,
              type: 'expense',
              createdAt: { $gte: startOfMonth, $lt: endOfMonth },
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: { $abs: '$amount' } },
            },
          },
        ]);

        const spent = agg.length > 0 ? agg[0].total : 0;
        return {
          ...b.toObject(),
          spent,
        };
      })
    );

    res.json({ success: true, count: enriched.length, data: enriched });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { category, limit, icon, color } = req.body;
    const now = new Date();
    const month = req.body.month || now.getMonth() + 1;
    const year = req.body.year || now.getFullYear();

    if (!category || !limit) {
      return res.status(400).json({ success: false, message: 'Category and limit are required' });
    }

    const budget = await Budget.findOneAndUpdate(
      { user: req.user._id, category, month, year },
      {
        user: req.user._id,
        category,
        limit: Number(limit),
        month,
        year,
        icon: icon || defaultCategoryConfig[category]?.icon || 'bolt',
        color: color || defaultCategoryConfig[category]?.color || 'blue',
      },
      { upsert: true, new: true, runValidators: true }
    );

    res.status(201).json({ success: true, data: budget });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!budget) {
      return res.status(404).json({ success: false, message: 'Budget not found' });
    }
    res.json({ success: true, data: budget });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!budget) {
      return res.status(404).json({ success: false, message: 'Budget not found' });
    }
    res.json({ success: true, message: 'Budget deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
