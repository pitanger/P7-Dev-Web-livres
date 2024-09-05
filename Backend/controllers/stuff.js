const Book = require('../models/book');
const fs = require('fs');

// POST /api/books - Créer un nouveau livre
exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    const book = new Book({
        ...bookObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    });
    book.save().then(() => {
        res.status(201).json({ message: 'Livre enregistré avec succès !' });
    }).catch(error => {
        res.status(400).json({ error });
    });
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
exports.updateBook = (req, res, next) => {
    let bookObject;
    if (req.file) {
        bookObject = {
            ...JSON.parse(req.body.book),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        };
    } else {
        bookObject = { ...req.body };
    }

    Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id }).then(() => {
        res.status(200).json({ message: 'Livre modifié avec succès !' });
    }).catch(error => {
        res.status(400).json({ error });
    });
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
