import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import GitHubStrategy from "passport-github2";
import local from "passport-local";
import userModel from "../dao/mongo/models/users.model.js";
import { PRIVATE_KEY, authToken } from "../utils.js";


const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["token"];
  }
  return token;
};

const localStrategy = local.Strategy

export function initializePassport() {    

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser(async (email, done) => {
    try {
      const user = await userModel.findOne({ email });
      done(null, user);
    } catch (error) {
      return done(error);
    }
  });

  passport.use("github", new GitHubStrategy({
    clientID: "Iv1.edfa107f63171b66",
    clientSecret: "af945ae270c6d9daf743d3ca20f5b39def9bf16a" ,
    callbackURL: "http://localhost:8080/api/sessions/githubcallback"
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      console.log(profile)
      let user = await userModel.findOne({ email: profile._json.email })
      if (!user) {
        let newUser = {
          nombre: profile._json.name, 
         
          email: profile._json.email,
          isGithubAuth: true
          
        }
        
       
        let result = await userModel.create(newUser)
        done(null, result)
          
      }
      else {
        done(null, user)
      }
    } catch (error) {
      return done(error)
    }
      
  }))
  
  passport.use("jwt", new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: PRIVATE_KEY, 
  }, (payload, done) => { 
    console.log('JWT Strategy - Payload:', payload);
    authToken(payload, (error, user) => {
      if (error) {
        return done(error, false);
      }
      if (user) {
        console.log('JWT Strategy - User:', user);
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  }));


  
  
  passport.use("current", new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
    secretOrKey: PRIVATE_KEY,
  }, async (payload, done) => {
    
    try {
      
      const user = await userModel.findOne({ email: payload.user.email});
      
      if (!user) {
        console.log("por aqui")
        return done(null, false);
      }
      
      const userDTO = {
        email: user.email, 
        nombre: user.nombre, 
        apellido: user.apellido,
        carrito: user.cartId,
        rol: user.rol,
      };
      
      return done(null, userDTO); 
    } catch (err) {
      return done(err, false);
    }
  }));

  

};


export function checkRole(rol) {
  return function(req, res, next) {
    const user = req.user; 
    if (user && user.rol === rol) {
      next();
    } else {
      res.status(403).json({ message: 'No tienes permisos para acceder a esta ruta.' });
    }
  }  
}


export default { initializePassport, checkRole };










