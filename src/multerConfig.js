import multer from 'multer';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Define la carpeta de destino
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Asigna un nombre único al archivo
  },
});

const upload = multer({ storage: storage });

export default upload;