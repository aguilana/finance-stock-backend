import express from 'express';
import * as userController from '../controllers/userController';
import { authenticate, checkUserAccess } from '../middleware/authMiddleware';
const router = express.Router();

router.get('/:id', authenticate, checkUserAccess, userController.getUser);

router.use('/', (req, res) => {
  res.status(404).json({
    title: 'user router',
    description: 'find out more',
    code: 200,
    data: null,
    status: 'success',
    timestamp: Date.now(),
    version: '1.0.0',
  });
});

export default router;
