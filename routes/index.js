const express = require('express');

const homeController = require('../controllers/home_controller');

const router = express.Router();

router.get('/', homeController.home);

router.post('/addtracker', homeController.addTracker);

router.get('/trackers', homeController.returnTrackers);

router.delete('/cleartrackers', homeController.clearTrackers);

router.delete('/clearqueue', homeController.clearQueue);


module.exports = router;