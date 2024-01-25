import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { utils } from "mocha";

export const PRIVATE_KEY = "coderJsonWebToken";

export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);

export const generateToken = (user) => {
  const token = jwt.sign({ user }, PRIVATE_KEY, { expiresIn: "24h" });
  return token;
};

export const authToken = (req, res, next) => {
  const autHeader = req.headers.authorization;
  const cookieToken = req.cookies.token;
  const token = autHeader ? autHeader.split(" ")[1] : cookieToken;

  if (!token) {
    return res.status(401).send({
      error: "No autenticado",
    });
  }

  jwt.verify(token, PRIVATE_KEY, (error, credential) => {
    if (error) {
      console.error('Error al verificar el token:', error);
      return res.status(403).send({ error: "No autorizado" });
    }
    req.user = credential.user;
    next();
  });
};

export default utils