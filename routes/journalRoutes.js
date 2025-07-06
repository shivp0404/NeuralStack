const express = require('express');
const router = express.Router();
const verifyUser = require('../middlewares/verifyUser');
const journalController = require('../controllers/journalController');

router.use(verifyUser);

router.post('/', journalController.addEntry);
router.get('/', journalController.getEntry); // ?date=2025-07-06
router.get('/all', journalController.getAllEntries);

module.exports = router;
