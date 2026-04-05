const FinancialRecord = require('../models/FinancialRecord');
const AppError = require('../utils/AppError');

const buildRecordFilter = ({ startDate, endDate, category, type }) => {
  const filter = {};
  if (type) filter.type = type;
  if (category) filter.category = { $regex: category, $options: 'i' };
  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }
  return filter;
};

const createRecord = async (data, userId) => {
  const record = await FinancialRecord.create({ ...data, createdBy: userId });
  return record;
};

const getRecords = async ({ page = 1, limit = 10, search, ...filters }) => {
  const filter = buildRecordFilter(filters);
  if (search) {
    filter.$or = [
      { notes: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (page - 1) * limit;
  const [records, total] = await Promise.all([
    FinancialRecord.find(filter)
      .populate('createdBy', 'name email')
      .sort({ date: -1 })
      .skip(skip)
      .limit(Number(limit)),
    FinancialRecord.countDocuments(filter),
  ]);

  return {
    records,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
};

const updateRecord = async (recordId, updates) => {
  const record = await FinancialRecord.findByIdAndUpdate(recordId, updates, {
    new: true,
    runValidators: true,
  });
  if (!record) throw new AppError('Financial record not found.', 404);
  return record;
};

const deleteRecord = async (recordId) => {
  // Soft delete: mark as deleted rather than removing from DB
  const record = await FinancialRecord.findByIdAndUpdate(
    recordId,
    { isDeleted: true },
    { new: true }
  );
  if (!record) throw new AppError('Financial record not found.', 404);
  return record;
};

module.exports = { createRecord, getRecords, updateRecord, deleteRecord };
