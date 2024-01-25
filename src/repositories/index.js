import { Contacts, Products, Carts, Users } from "../dao/factory.js";
import ContactRepository from "./contacts.repository.js";
import ProductRepository from "./products.repository.js";
import CartRepository from "./carts.repository.js"
import  UserRepository from "./users.repository.js";

const contactService = new ContactRepository(new Contacts());
const productService = new ProductRepository(new Products());
const cartService = new CartRepository(new Carts());
const userService = new UserRepository(new Users());

export default {
  contactService,
  productService,
  cartService,
  userService,}
