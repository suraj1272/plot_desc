import app from './app.js';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { seedInitialPlotsIfEmpty } from './services/plotService.js';
import { createDefaultAdminIfEmpty } from './services/authService.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Initialize Database & Start Server
async function startServer() {
  try {
    console.log('Connecting to MongoDB database...');
    await connectDB();
    
    // Seed Admin & Plots on Startup
    console.log('Checking & seeding database collections...');
    await createDefaultAdminIfEmpty();
    const seedResult = await seedInitialPlotsIfEmpty();
    
    if (seedResult.seeded) {
      console.log(`Successfully seeded ${seedResult.count} plots into MongoDB!`);
    } else {
      console.log(`Database already populated (${seedResult.count || 0} plots found).`);
    }

    app.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(`🚀 Backend Express Server running on http://localhost:${PORT}`);
      console.log(`📡 API Endpoints available at http://localhost:${PORT}/api`);
      console.log(`=======================================================`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
