import express from 'express';
import * as authController from '../controllers/authController';
import { authenticate, checkUserAccess } from '../middleware/authMiddleware';
const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/check', authController.checkAuthState);

export default router;
