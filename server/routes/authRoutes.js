import express from 'express';
import { loginHandler, getMeHandler } from '../controllers/authController.js';
import { requireAdminAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', loginHandler);
router.get('/me', requireAdminAuth, getMeHandler);

export default router;
