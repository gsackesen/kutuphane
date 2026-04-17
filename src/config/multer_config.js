const multer = require('multer');
const path = require('path');
const sanitize = require('sanitize-filename');

// Ortak dosya adı oluşturucu
const createFileName = (req, file) => {
  const safeMail = sanitize(req.user.mail); // özel karakterleri temizle
  const timestamp = Date.now(); // zaman damgası
  const ext = path.extname(file.originalname); // dosya uzantısı
  return `${safeMail}_${timestamp}${ext}`;
};

// Avatar storage
const myStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/avatars'));
  },
  filename: (req, file, cb) => {
    cb(null, createFileName(req, file));
  }
});

// Kapak storage
const coverStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/covers'));
  },
  filename: (req, file, cb) => {
    cb(null, createFileName(req, file));
  }
});

// Dosya filtreleme
const resimFileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error("Sadece JPEG ve PNG dosyaları yüklenebilir"), false);
  }
};

// Multer middleware
const upload = multer({ storage: myStorage, fileFilter: resimFileFilter });
const coverUpload = multer({ storage: coverStorage, fileFilter: resimFileFilter });

module.exports = { upload, coverUpload };
