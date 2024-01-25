import express from 'express';
import errorHandlerMiddleware  from './errorHandlerMiddleware.js';
import mockingModule from './mockingModule.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import cartRouter from './routes/cartRouter.js';
import productRouter from './routes/productRouter.js';
import vistaRouter from './routes/vistaRouter.js';
import userRouter from './routes/usersRouter.js';
import sessionRouter from './routes/sessionsRouter.js';
import isUtf8 from 'buffer';
import {Server}  from 'socket.io';
import http from 'http';
import handlebars from 'express-handlebars';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import connectMongo from 'connect-mongo';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';
import { initializePassport, checkRole } from "./config/passport.config.js";
import cookieParser from 'cookie-parser';
import { Users, Carts, Products } from '../src/dao/factory.js';
import logger from './config/logger.js';

dotenv.config();

initializePassport();
const app = express();
const server = http.createServer(app);
const io = new Server(server);
global.io = io;
const port = process.env.PORT || 8080;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


if (process.env.NODE_ENV === 'development') {

  console.log('Running in development mode');
}
if (process.env.NODE_ENV === 'production') {
  
  console.log('Running in production mode');
}

app.get('/mockingproducts', (req, res) => {
  const mockProducts = mockingModule.generateMockProducts();
  res.json(mockProducts);
});

app.get('/loggerTest', (req, res) => {
  logger.log('info', 'Este es un mensaje de nivel info');
  logger.log('warning', 'Este es un mensaje de nivel warning');
  logger.log('error', 'Este es un mensaje de nivel error');
  logger.log('debug', 'Este es un mensaje de nivel debug');

  res.status(200).send('Mensajes de prueba registrados');
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(errorHandlerMiddleware);


io.on('connection', (socket) => {
  console.log('Cliente conectado');
  socket.emit('conexion-establecida', 'Conexión exitosa con el servidor de Socket.IO');
  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

const swaggerOptions = {
  definition:{
      openapi:"3.0.1",
      info: {
          title:"Documentacion de API",
          description:"Desafio 10 backend"
  },
  },
  apis: ['src/docs/users.yaml','src/docs/products.yaml','src/docs/tickets.yaml','src/docs/carts.yaml'],
};
const specs = swaggerJsdoc(swaggerOptions);
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

app.use(session({
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true }, ttl: 3500
}),
    secret: "clavesecreta",
    resave: false,
    saveUninitialized: true
}));


app.use(passport.initialize());
app.use(passport.session());

app.use('/api/users', userRouter);
app.use("/api/sessions", sessionRouter);
app.use("/", cartRouter);
app.use("/", productRouter);
app.use("/", vistaRouter);

function checkRoleMiddleware(req, res, next) {
  const role = req.body.role;
  checkRole(role)(req, res, next);
}

server.listen(port, () => {
  console.log(`Servidor corriendo en el ${port}`);
});

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "public")));

