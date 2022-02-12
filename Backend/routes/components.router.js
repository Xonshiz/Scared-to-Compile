var express = require('express');
var router = express.Router();
var componentController = require('../controllers/components.controller');

router.post('/components', componentController.AddComponents);

router.get('/components', componentController.GetComponents);

module.exports = router;