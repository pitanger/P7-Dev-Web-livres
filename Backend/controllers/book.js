const Book = require('../models/book');
const fs = require('fs');
const path = require('path');


// POST /api/books - Créer un nouveau livre
exports.createBook = async (req, res) => {
    try {
      const bookObject = JSON.parse(req.body.book);
      const book = new Book({
        ...bookObject,
        imageUrl: `${req.protocol}://${req.get('host')}${req.file.path}`, // Utilise l'URL de l'image WebP traitée
        averageRating: 0,
      });
  
      await book.save();
      res.status(201).json({ message: 'Livre enregistré avec succès !' });
    } catch (error) {
      console.error('Erreur lors de la création du livre:', error);
      res.status(500).json({ error: 'Erreur lors de la création du livre' });
    }
  };
  

// GET /api/books - Récupérer tous les livres
exports.getAllBooks = (req, res, next) => {
    Book.find().then(books => {
        res.status(200).json(books);
    }).catch(error => {
        res.status(400).json({ error });
    });
};

// GET /api/books/:id - Récupérer un livre par son ID
exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id }).then(book => {
        res.status(200).json(book);
    }).catch(error => {
        res.status(404).json({ error });
    });
};

// GET /api/books/bestrating - Récupérer les livres avec les meilleures notes
exports.getBestRatedBooks = (req, res, next) => {
    Book.find().sort({ averageRating: -1 }).limit(10).then(books => {
        res.status(200).json(books);
    }).catch(error => {
        res.status(400).json({ error });
    });
};

// PUT /api/books/:id - Modifier un livre
exports.updateBook = async (req, res, next) => {
    try {
        // Récupérer le livre actuel à partir de la base de données
        const book = await Book.findOne({ _id: req.params.id });

        // Préparer l'objet de mise à jour
        let bookObject;
        if (req.file) {
            // Si un nouveau fichier image est fourni, il faut d'abord supprimer l'ancienne image
            const oldImagePath = book.imageUrl.split(`${req.get('host')}`)[1]; // Récupérer le chemin relatif de l'ancienne image
            const fullOldImagePath = path.join(__dirname, '..', oldImagePath);

            // Supprimer l'ancienne image du serveur
            fs.unlink(fullOldImagePath, (err) => {
                if (err) {
                    console.error('Erreur lors de la suppression de l\'ancienne image :', err);
                } else {
                    console.log('Ancienne image supprimée avec succès');
                }
            });

            // Mettre à jour l'URL de l'image avec la nouvelle image traitée
            bookObject = {
                ...JSON.parse(req.body.book),
                imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
            };
        } else {
            // Si pas de fichier, on garde les autres propriétés
            bookObject = { ...req.body };
        }

        // Mettre à jour le livre dans la base de données
        await Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id });

        res.status(200).json({ message: 'Livre modifié avec succès !' });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du livre :', error);
        res.status(400).json({ error });
    }
};

// DELETE /api/books/:id - Supprimer un livre
exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id }).then(book => {
        if (book.imageUrl) {
            const filename = book.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Book.deleteOne({ _id: req.params.id }).then(() => {
                    res.status(200).json({ message: 'Livre supprimé avec succès !' });
                }).catch(error => {
                    res.status(400).json({ error });
                });
            });
        } else {
            Book.deleteOne({ _id: req.params.id }).then(() => {
                res.status(200).json({ message: 'Livre supprimé avec succès !' });
            }).catch(error => {
                res.status(400).json({ error });
            });
        }
    }).catch(error => {
        res.status(500).json({ error });
    });
};

// POST /api/books/:id/rating - Ajouter une note à un livre
exports.rateBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id }).then(book => {
        const newRating = {
            userId: req.body.userId,
            grade: req.body.rating,
        };
        book.ratings.push(newRating);
        book.averageRating = book.ratings.reduce((acc, rating) => acc + rating.grade, 0) / book.ratings.length;

        book.save().then(() => {
            res.status(200).json(book);
        }).catch(error => {
            res.status(400).json({ error });
        });
    }).catch(error => {
        res.status(400).json({ error });
    });
};
