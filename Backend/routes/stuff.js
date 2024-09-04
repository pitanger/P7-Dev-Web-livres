const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config'); // Middleware pour la gestion des fichiers
const booksCtrl = require('../controllers/stuff'); // Adaptez le chemin si nécessaire

router.get('/', booksCtrl.getAllBooks); // Récupérer tous les livres (pas d'authentification requise)
router.get('/bestrating', booksCtrl.getBestRatedBooks); // Récupérer les livres les mieux notés

router.get('/:id', booksCtrl.getOneBook); // Récupérer un livre par son ID
router.post('/', auth, multer, booksCtrl.createBook); // Créer un nouveau livre (authentification requise)
router.put('/:id', auth, multer, booksCtrl.updateBook); // Modifier un livre (authentification requise)
router.delete('/:id', auth, booksCtrl.deleteBook); // Supprimer un livre (authentification requise)

router.post('/:id/rating', auth, booksCtrl.rateBook); // Ajouter une note à un livre (authentification requise)

module.exports = router;