const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

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

const processImage = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const name = req.file.originalname.split(' ').join('_').replace(/\.[^/.]+$/, "");  // Nettoyer le nom
  const filename = `${name}_${Date.now()}.webp`;
  
  const imagePath = path.join(__dirname, '../images', filename);

  try {
    await sharp(req.file.buffer)
      .resize(800)
      .toFormat('webp')
      .webp({ quality: 80 })
      .toFile(imagePath);

    req.file.filename = filename;
    req.file.path = `/images/${filename}`;

    next();
  } catch (error) {
    console.error('Erreur lors de la conversion de l\'image avec Sharp:', error);
    return res.status(500).json({ error: 'Erreur lors du traitement de l\'image.' });
  }
};

module.exports = { upload, processImage };
