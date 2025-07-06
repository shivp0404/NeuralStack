const express = require('express');
const router = express.Router();
const snippetController = require('../controllers/snippetController');
const verifyUser = require('../middlewares/verifyUser');

// Protect all routes
router.use(verifyUser);

router.get('/', snippetController.getSnippets);
router.get('/:id', snippetController.getSnippetById);
router.post('/', snippetController.createSnippet);
router.put('/:id', snippetController.updateSnippet);
router.delete('/:id', snippetController.deleteSnippet);

module.exports = router;
