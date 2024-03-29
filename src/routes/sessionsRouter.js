import express from "express";
import passport from "passport";
import  generateToken  from "../utils.js";

const router = express.Router();

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }), async (req, res) => { });

router.get("/api/sessions/githubcallback", passport.authenticate("github", { failureRedirect: "/login" }), (req, res) => {
    if (req.isAuthenticated()) {
        const token = generateToken(req.user);
        console.log("Token generado:", token);
        req.session.user = req.user;
        req.session.nombreUsuario = req.user.nombre;
        req.session.email = req.user.email;
        res.redirect("/allproducts");
    } else {
        res.redirect("/login");
    }
});


export default router;

