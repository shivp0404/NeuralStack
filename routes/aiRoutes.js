const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const verifyUser = require('../middlewares/verifyUser');

router.use(verifyUser);

router.post('/explain', aiController.explainCode);
router.post('/auto-tag', aiController.autoTag);

module.exports = router;
