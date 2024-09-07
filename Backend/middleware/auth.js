const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const jwt = require('jsonwebtoken');

router.post('/signup', authController.signup);
router.post('/login', authController.login);

module.exports = router;

module.exports = (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      throw 'Authorization header missing';
    }

    const token = req.headers.authorization.split(' ')[1];
    console.log('Token:', token);
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    console.log('Decoded Token:', decodedToken);

    const userId = decodedToken.userId;
    req.auth = { userId };

    console.log('User ID from token:', userId);

    if (req.body.userId && req.body.userId !== userId) {
      throw 'User ID non valable';
    } else {
      next();
    }

  } catch (error) {
    console.error('Authentication Error:', error);

    res.status(401).json({
      error: new Error('Requête non authentifiée !')
    });
  }
};
