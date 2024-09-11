const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { upload, processImage } = require('../middleware/multer-config');
const booksCtrl = require('../controllers/book');

router.get('/', booksCtrl.getAllBooks);
router.get('/bestrating', booksCtrl.getBestRatedBooks);

router.get('/:id', booksCtrl.getOneBook);
router.post('/', upload, processImage, booksCtrl.createBook); // Utilise les middlewares pour uploader et traiter l'image
router.put('/:id', upload, processImage, booksCtrl.createBook);
router.delete('/:id', auth, booksCtrl.deleteBook);

router.post('/:id/rating', auth, booksCtrl.rateBook);

module.exports = router;