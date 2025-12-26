const express = require('express');
const router = express.Router();
const favoritesController = require('../controllers/favoritesController');
const auth = require('../middleware/auth');

router.post('/:courseId', auth, favoritesController.addFavorite);
router.delete('/:courseId', auth, favoritesController.removeFavorite);
router.get('/my-favorites', auth, favoritesController.getMyFavorites);
router.get('/my-favorite-ids', auth, favoritesController.getMyFavoriteIds);

module.exports = router;
