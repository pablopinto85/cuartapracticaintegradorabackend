import express from "express";
import usersControllers from "../controllers/users.controllers.js";
import  authToken  from "../utils.js";
import passport from "passport"
import multer from "multer";
//import upload from './multerConfig.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/documents' });

router.get('/',usersControllers.getAllUsers);

router.post('/upload', upload.single('archivo'), (req, res) => {
    const file = req.file;
    res.json({ message: 'Archivo subido con éxito', filename: file.filename });
  });

router.post('/:uid/documents', upload.array('documentos'), async (req, res) => {
    const userId = req.params.uid;
    const documents = req.files.map(file => ({
      name: file.originalname,
      reference: file.path
    }));
  
    try {
      // Actualizar el usuario con los documentos y actualizar su estado
      const user = await User.findByIdAndUpdate(
        userId,
        { $set: { documents, last_connection: new Date() } },
        { new: true }
      );
  
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error interno del servidor');
    }
  });
  
 
router.put('/premium/:uid', async (req, res) => {
    const userId = req.params.uid;
  
    try {
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
  
      // Verificar que se han cargado los documentos necesarios
      if (
        !user.documents.some(doc => doc.name === 'Identificación') ||
        !user.documents.some(doc => doc.name === 'Comprobante de domicilio') ||
        !user.documents.some(doc => doc.name === 'Comprobante de estado de cuenta')
      ) {
        return res.status(400).json({ error: 'Faltan documentos requeridos para ser premium' });
      }
  
      // Actualizar a premium
      
  
      res.json({ message: 'Usuario actualizado a premium' });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error interno del servidor');
    }
  });
  


router.put('/:uid',usersControllers.updateUser);
router.get("/users", usersControllers.getAllUsers);
router.get("/users/:uid", usersControllers.getUserById);
router.post("/api/users", usersControllers.createUser);
router.post("/register", usersControllers.registerUserAndMessage);
router.post("/login", usersControllers.loginUser);
router.get("/api/sessions/user", passport.authenticate("current", { session: false }), usersControllers.getUserInfo);
router.get("/logout", usersControllers.logoutUser);
router.put("/users/:uid", usersControllers.updateUser);
router.delete("/users/:uid", usersControllers.deleteUser);

export default router