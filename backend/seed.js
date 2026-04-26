const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Company = require('./models/Company');
const Lead = require('./models/Lead');
const Task = require('./models/Task');

dotenv.config();

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to DB');

  // Clear existing
  await Promise.all([
    User.deleteMany(),
    Company.deleteMany(),
    Lead.deleteMany({ isDeleted: { $in: [true, false] } }),
    Task.deleteMany(),
  ]);

  // Create users
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@minicrm.com',
    password: 'admin123',
    role: 'admin',
  });

  const agent = await User.create({
    name: 'Agent One',
    email: 'agent@minicrm.com',
    password: 'agent123',
    role: 'agent',
  });

  // Create companies
  const company1 = await Company.create({
    name: 'ABC Corp',
    industry: 'IT',
    location: 'Chennai',
    website: 'https://abccorp.com',
    createdBy: admin._id,
  });

  const company2 = await Company.create({
    name: 'XYZ Solutions',
    industry: 'Finance',
    location: 'Mumbai',
    website: 'https://xyzsolutions.com',
    createdBy: admin._id,
  });

  // Create leads
  const lead1 = await Lead.create({
    name: 'Ravi Kumar',
    email: 'ravi@mail.com',
    phone: '9876543210',
    status: 'New',
    assignedTo: agent._id,
    company: company1._id,
    createdBy: admin._id,
  });

  const lead2 = await Lead.create({
    name: 'Priya Sharma',
    email: 'priya@mail.com',
    phone: '9876543211',
    status: 'Qualified',
    assignedTo: agent._id,
    company: company2._id,
    createdBy: admin._id,
  });

  const lead3 = await Lead.create({
    name: 'Anand Raj',
    email: 'anand@mail.com',
    phone: '9876543212',
    status: 'Won',
    assignedTo: admin._id,
    company: company1._id,
    createdBy: admin._id,
  });

  // Create tasks
  await Task.create({
    title: 'Call Ravi for demo',
    description: 'Schedule a product demo call',
    lead: lead1._id,
    assignedTo: agent._id,
    createdBy: admin._id,
    dueDate: new Date(),
    status: 'Pending',
  });

  await Task.create({
    title: 'Send proposal to Priya',
    description: 'Send the pricing proposal document',
    lead: lead2._id,
    assignedTo: agent._id,
    createdBy: admin._id,
    dueDate: new Date(Date.now() + 86400000),
    status: 'In Progress',
  });

  await Task.create({
    title: 'Onboard Anand',
    description: 'Complete onboarding process',
    lead: lead3._id,
    assignedTo: admin._id,
    createdBy: admin._id,
    dueDate: new Date(Date.now() - 86400000),
    status: 'Completed',
  });

  console.log('\n✅ Seed completed!');
  console.log('Admin  → admin@minicrm.com / admin123');
  console.log('Agent  → agent@minicrm.com / agent123');

  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
