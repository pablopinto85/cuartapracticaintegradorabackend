import { Router } from "express";
import passport from "passport";
import passportConfig from "../config/passport.config.js"
import cartsControllers from "../controllers/carts.controllers.js";
const { checkRole } = passportConfig;
const router = Router();  

router.get("/api/carts/:cid", cartsControllers.getCartById);
router.get("/api/carts", cartsControllers.getAllCarts);
router.post("/api/carts", cartsControllers.createCart);
router.post("/api/carts/:cid/products", passport.authenticate('current', { session: false }), checkRole('user'), cartsControllers.addProductsToCart);
router.put("/api/carts/:cid/products/:pid", cartsControllers.updateProductQuantity);
router.delete("/api/deletecarts/:id", cartsControllers.deleteCartById);
router.delete("/api/deleteproductcarts/:cid", cartsControllers.deleteAllProductsInCart);
router.delete("/api/carts/:cid/product/:pid", cartsControllers.deleteProductFromCart);
router.get("/api/carts/:cid/purchase", passport.authenticate('current', { session: false }), checkRole('user'), cartsControllers.purchaseProducts);
router.get("/api/carts/getusercart", cartsControllers.getUserCart);

export default router;
