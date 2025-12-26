const express = require('express');
const router = express.Router();
const purchasesController = require('../controllers/purchasesController');
const auth = require('../middleware/auth');

router.post('/:courseId', auth, purchasesController.purchaseCourse);
router.get('/my-purchases', auth, purchasesController.getMyPurchases);
router.get('/my-purchase-ids', auth, purchasesController.getMyPurchaseIds);
router.put('/:courseId/progress', auth, purchasesController.updateProgress);

module.exports = router;
