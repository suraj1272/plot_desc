import express from 'express';
import { 
  getPlotsHandler, 
  getSinglePlotHandler, 
  updatePlotStatusHandler, 
  seedPlotsHandler 
} from '../controllers/plotController.js';
import { requireAdminAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getPlotsHandler);
router.get('/:surveyNo/:number', getSinglePlotHandler);

// Admin protected routes
router.put('/status', requireAdminAuth, updatePlotStatusHandler);
router.post('/seed', requireAdminAuth, seedPlotsHandler);

export default router;
