const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_').replace(/\.[^/.]+$/, "");
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  },
});

const { buffer, originalname } = req.file;
const timestamp = new Date().toISOString();
const ref = `${timestamp}-${originalname}.webp`;
await sharp(buffer)
  .webp({ quality: 20 })
  .toFile("./uploads/" + ref);
const link = `http://localhost:3000/${ref}`;
return res.json({ link });


module.exports = multer({ storage: storage }).single('image');
