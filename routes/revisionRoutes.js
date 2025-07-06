const express = require('express');
const router = express.Router();
const revisionController = require('../controllers/revisionController');
const verifyUser = require('../middlewares/verifyUser');

router.use(verifyUser);

router.get('/queue', revisionController.getRevisionQueue);
router.post('/schedule', revisionController.scheduleRevision);
router.put('/mark-reviewed', revisionController.markReviewed);
router.put('/snooze/:id', revisionController.snoozeRevision);

module.exports = router;
