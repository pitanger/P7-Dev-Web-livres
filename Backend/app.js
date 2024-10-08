const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/book');
const path = require('path');


mongoose.connect('mongodb+srv://pitanger:Shadowmatt42@cluster0.a9wie.mongodb.net/',
  { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);


module.exports = app;
