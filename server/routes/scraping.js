const express = require('express');
const router = express.Router();
const scrapingController = require('../controllers/scrapingController');
const auth = require('../middleware/auth');
const { validate, scrapingSchema } = require('../middleware/validation');

// Trigger n8n scraping (auth required + validation)
router.post('/trigger', auth, validate(scrapingSchema), scrapingController.triggerScraping);

// Receive data from n8n webhook (no auth - called by n8n)
router.post('/webhook', scrapingController.receiveScrapedData);

// Get all scraped data (public)
router.get('/', scrapingController.getScrapedData);

// Get my scraped data (auth required)
router.get('/my-data', auth, scrapingController.getMyScrapedData);

// Delete scraped data (auth required)
router.delete('/:id', auth, scrapingController.deleteScrapedData);

module.exports = router;
