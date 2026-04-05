const {
  createRecord,
  getRecords,
  updateRecord,
  deleteRecord,
} = require('../services/record.service');
const { sendSuccess, sendPaginated } = require('../utils/apiResponse');
const catchAsync = require('../utils/catchAsync');

const create = catchAsync(async (req, res) => {
  const record = await createRecord(req.body, req.user._id);
  sendSuccess(res, 201, 'Financial record created.', { record });
});

const getAll = catchAsync(async (req, res) => {
  const { page, limit, startDate, endDate, category, type, search } = req.query;
  const result = await getRecords({ page, limit, startDate, endDate, category, type, search });
  sendPaginated(res, 'Records fetched successfully.', result.records, result.pagination);
});

const update = catchAsync(async (req, res) => {
  const record = await updateRecord(req.params.id, req.body);
  sendSuccess(res, 200, 'Record updated successfully.', { record });
});

const remove = catchAsync(async (req, res) => {
  await deleteRecord(req.params.id);
  sendSuccess(res, 200, 'Record deleted successfully.');
});

module.exports = { create, getAll, update, remove };
