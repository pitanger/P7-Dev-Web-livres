const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { upload, processImage } = require('../middleware/multer-config');
const booksCtrl = require('../controllers/book');

router.get('/', booksCtrl.getAllBooks);
router.get('/bestrating', booksCtrl.getBestRatedBooks);

router.get('/:id', booksCtrl.getOneBook);
router.post('/', auth, upload, processImage, booksCtrl.createBook);
router.put('/:id', auth, upload, processImage, booksCtrl.updateBook);
router.delete('/:id', auth, booksCtrl.deleteBook);

router.post('/:id/rating', auth, booksCtrl.rateBook);

module.exports = router;