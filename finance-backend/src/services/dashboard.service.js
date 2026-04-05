const FinancialRecord = require('../models/FinancialRecord');

/**
 * Single aggregation pipeline to compute all dashboard metrics efficiently.
 * Avoids N+1 queries by batching everything into one DB round-trip.
 */
const getDashboardSummary = async () => {
  const [summary, categoryTotals, monthlyTrends, recentTransactions] = await Promise.all([
    getIncomeExpenseSummary(),
    getCategoryWiseTotals(),
    getMonthlyTrends(),
    getRecentTransactions(),
  ]);

  const totalIncome = summary.find((s) => s._id === 'income')?.total || 0;
  const totalExpenses = summary.find((s) => s._id === 'expense')?.total || 0;
  const netBalance = totalIncome - totalExpenses;

  return {
    totalIncome,
    totalExpenses,
    netBalance,
    categoryTotals,
    recentTransactions,
    monthlyTrends,
  };
};

const getIncomeExpenseSummary = () =>
  FinancialRecord.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: '$type',
        total: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
  ]);

const getCategoryWiseTotals = () =>
  FinancialRecord.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: { category: '$category', type: '$type' },
        total: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: '$_id.category',
        breakdown: {
          $push: { type: '$_id.type', total: '$total', count: '$count' },
        },
        totalAmount: { $sum: '$total' },
      },
    },
    { $sort: { totalAmount: -1 } },
  ]);

const getMonthlyTrends = () =>
  FinancialRecord.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: {
          year: { $year: '$date' },
          month: { $month: '$date' },
          type: '$type',
        },
        total: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: { year: '$_id.year', month: '$_id.month' },
        data: { $push: { type: '$_id.type', total: '$total', count: '$count' } },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 12 }, // Last 12 months
    {
      $project: {
        _id: 0,
        year: '$_id.year',
        month: '$_id.month',
        data: 1,
      },
    },
  ]);

const getRecentTransactions = () =>
  FinancialRecord.find({ isDeleted: false })
    .sort({ date: -1 })
    .limit(5)
    .populate('createdBy', 'name email')
    .lean();

module.exports = { getDashboardSummary };
