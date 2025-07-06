const express = require('express');
const router = express.Router();
const verifyUser = require('../middlewares/verifyUser');
const conceptController = require('../controllers/conceptController');

router.use(verifyUser);
router.get('/progress', conceptController.getConceptStats);

module.exports = router;
