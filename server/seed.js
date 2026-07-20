import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Plot from './models/Plot.js';
import Admin from './models/Admin.js';
import { seedInitialPlotsIfEmpty } from './services/plotService.js';
import { createDefaultAdminIfEmpty } from './services/authService.js';

dotenv.config();

async function runSeed() {
  try {
    console.log('Connecting to MongoDB...');
    await connectDB();

    console.log('Ensuring default Admin user exists...');
    await createDefaultAdminIfEmpty();

    console.log('Ensuring 462 layout plots exist...');
    const result = await seedInitialPlotsIfEmpty();

    const plotCount = await Plot.countDocuments();
    const adminCount = await Admin.countDocuments();

    console.log('\n=======================================================');
    console.log(`✅ SEEDING COMPLETE!`);
    console.log(`📊 Total Plots in MongoDB: ${plotCount}`);
    console.log(`👤 Total Admin Accounts:   ${adminCount}`);
    console.log('=======================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

runSeed();
