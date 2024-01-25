import mongoose from "mongoose";
import config from "../config/factory.config.js";
import dotenv from "dotenv";

dotenv.config();
let Users;
let Carts;
let Products;

switch (config.persistence) {
  case "MONGO":
    console.log("Using MongoDB");
    mongoose.connect(process.env.MONGOURL)
      .then(() => {
        Users = require("./mongo/usersmongo.js");
        Carts = require("./mongo/cartsmongo.js");
        Products = require("./mongo/productsmongo.js");
        console.log("Connected to MongoDB");
      })
      .catch(error => {
        console.error("Error connecting to MongoDB:", error);
      });
    break;
  case "MEMORY":
    console.log("Using Memory");
    Users = require("../dao/memory/user.memory.js");
    Carts = require("../dao/memory/cart.memory.js");
    Products = require("../dao/memory/product.memory.js");
    break;
}

export { Users, Carts, Products };