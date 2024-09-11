const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Configuration de Multer pour enregistrer l'image en mémoire temporairement (buffer)
const storage = multer.memoryStorage(); 

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, callback) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.mimetype)) {
      return callback(new Error('Seuls les formats JPG, JPEG et PNG sont acceptés.'));
    }
    callback(null, true);
  }
}).single('image');

// Middleware pour redimensionner, convertir en WebP et enregistrer l'image
const processImage = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const name = req.file.originalname.split(' ').join('_').replace(/\.[^/.]+$/, "");
  const filename = `${name}_${Date.now()}.webp`;
  
  const imagePath = path.join(__dirname, '../images', filename);

  try {
    // Redimensionner et convertir l'image en WebP avec Sharp
    await sharp(req.file.buffer)
      .resize(800) // Redimensionne à une largeur de 800px (modifiable selon tes besoins)
      .toFormat('webp')
      .webp({ quality: 80 }) // Ajuste la qualité de l'image compressée
      .toFile(imagePath); // Enregistre l'image dans le dossier "images"

    // Assigner le nom du fichier et son chemin dans la requête pour l'utilisation ultérieure
    req.file.filename = filename;
    req.file.path = `/images/${filename}`;

    next();
  } catch (error) {
    console.error('Erreur lors de la conversion de l\'image:', error);
    return res.status(500).json({ error: 'Erreur lors du traitement de l\'image.' });
  }
};

module.exports = { upload, processImage };
