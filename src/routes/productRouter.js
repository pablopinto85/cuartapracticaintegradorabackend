import express from "express";
import passport from "passport";
import ProductController from "../controllers/products.controller.js";
import passportConfig from "../config/passport.config.js";

const { checkRole } = passportConfig;

const router = express.Router(); // Create an instance of the Router object

router.get("/products", ProductController.getProducts);
router.get("/product/:pid", ProductController.getProductById);
router.post("/api/products", passport.authenticate('current', { session: false }), checkRole('admin'), ProductController.saveProduct);
router.put("/products/:id", passport.authenticate('current', { session: false }), checkRole('admin'), ProductController.updateProduct);
router.delete("/products/:id", passport.authenticate('current', { session: false }), checkRole('admin'), ProductController.deleteProduct);

export default router;
