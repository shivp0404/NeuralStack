const express = require('express');
const router = express.Router();
const verifyUser = require('../middlewares/verifyUser')
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);
router.get('/me',verifyUser,authController.me)

module.exports = router;
