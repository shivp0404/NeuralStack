const express = require('express');
const router = express.Router();
const verifyUser = require('../middlewares/verifyUser');
const dashboardController = require('../controllers/dashboardController');

router.use(verifyUser);

router.get('/stats', dashboardController.getStats);
router.get('/heatmap', dashboardController.getHeatmapData);

module.exports = router;
