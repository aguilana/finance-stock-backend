import express from 'express';
const userController = require('../controllers/userController');
const router = express.Router();

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/:userId', userController.getUser);

module.exports = router