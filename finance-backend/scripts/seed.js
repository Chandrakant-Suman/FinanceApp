require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../src/models/User');
const FinancialRecord = require('../src/models/FinancialRecord');

const SEED_USERS = [
  { name: 'Alice Admin', email: 'admin@finance.com', password: 'pswdadmin@123', role: 'admin' },
  { name: 'Ana Analyst', email: 'analyst@finance.com', password: 'pswdanalyst@123', role: 'analyst' },
  { name: 'Victor Viewer', email: 'viewer@finance.com', password: 'pswdviewer@123', role: 'viewer' },
];

const CATEGORIES = ['Salary', 'Rent', 'Groceries', 'Utilities', 'Marketing', 'Freelance', 'Travel', 'Healthcare'];

const randomDate = (monthsBack) => {
  const d = new Date();
  d.setMonth(d.getMonth() - Math.floor(Math.random() * monthsBack));
  d.setDate(Math.floor(Math.random() * 28) + 1);
  return d;
};

const generateRecords = (adminId) => {
  const records = [];
  for (let i = 0; i < 40; i++) {
    const type = Math.random() > 0.4 ? 'expense' : 'income';
    records.push({
      amount: parseFloat((Math.random() * 5000 + 100).toFixed(2)),
      type,
      category: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
      date: randomDate(6),
      notes: `Auto-generated ${type} record #${i + 1}`,
      createdBy: adminId,
    });
  }
  return records;
};

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([User.deleteMany(), FinancialRecord.deleteMany()]);
    console.log('Cleared existing data');

    // Create users (passwords are hashed via pre-save hook)
    const users = await User.create(SEED_USERS);
    console.log(`Created ${users.length} users`);

    const admin = users.find((u) => u.role === 'admin');
    const records = generateRecords(admin._id);
    await FinancialRecord.create(records);
    console.log(`Created ${records.length} financial records`);

    console.log('\n✅ Seed complete. Login credentials:');
    SEED_USERS.forEach((u) => console.log(`  ${u.role.padEnd(8)} → ${u.email} / ${u.password}`));
  } catch (err) {
    console.error('Seed failed:', err.message);
  } finally {
    await mongoose.disconnect();
  }
};

seed();
