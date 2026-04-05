const mongoose = require('mongoose');
const { TRANSACTION_TYPES } = require('../config/constants');

const financialRecordSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be greater than 0'],
    },
    type: {
      type: String,
      enum: Object.values(TRANSACTION_TYPES),
      required: [true, 'Transaction type is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      maxlength: [50, 'Category cannot exceed 50 characters'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
    isDeleted: {
      // Soft delete flag
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// Index for common query patterns
financialRecordSchema.index({ type: 1, category: 1, date: -1 });
financialRecordSchema.index({ isDeleted: 1, date: -1 });

// Default filter: exclude soft-deleted records
financialRecordSchema.pre(/^find/, function (next) {
  if (this._conditions.isDeleted === undefined) {
    this.where({ isDeleted: false });
  }
  next();
});

module.exports = mongoose.model('FinancialRecord', financialRecordSchema);
