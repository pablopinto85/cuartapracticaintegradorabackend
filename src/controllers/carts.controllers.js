import CartDao from "../dao/mongo/cartsmongo.js";
import mongoose from "mongoose"
import ticketModel from "../dao/mongo/models/tickets.model.js";
import { v4 as uuidv4 } from 'uuid';
import cookieParser from 'cookie-parser';
import {PRIVATE_KEY} from "../utils.js";
import userDao from "./users.controllers.js"
import jwt from "jsonwebtoken"


const cartDao = new CartDao();


async function getCartById(req, res) {
    try {
        const cartId = req.params.cid;
        console.log(cartId)
        const cart = await cartDao.getCartById(cartId);
        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }
        return res.render("cartDetail", { cart }); // renderizar la vista con los datos del carrito
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", error: "tenemos un error" });
    }
}




async function getUserCart(req, res) {
    console.log("working")
    try {
        console.log("funciona")
    
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Token de autorización no válido' });
        }

        const token = authHeader.split(' ')[1]; 

 
        const decodedToken = jwt.verify(token, PRIVATE_KEY); 

       
        const userEmail = decodedToken.email;
        console.log(userEmail);

       
        const user = await userDao.getUserByEmail(userEmail);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const cartId = user.carrito;
        console.log("Valor de user.carrito:", user.carrito);
        if (!mongoose.Types.ObjectId.isValid(cartId)) {
            return res.status(400).json({ message: 'ID de carrito no válido' });
        }

        
        const cart = await cartDao.getCartById(cartId);
        
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        return res.status(200).json({ cart });
    } catch (error) {
        console.error('Error al obtener el carrito del usuario:', error);
        return res.status(500).json({ message: 'Error al obtener el carrito del usuario.' });
    }
}




async function getAllCarts(req, res) {
        try {
        const carts = await cartDao.getAllCarts(); 
        if (!carts) {
            return res.status(404).json({ message: "No se encontraron carritos" });
        }
       
        return res.json(carts);
    } catch (error) {
       
        console.error(error);
        return res.status(500).json({ status: "error", error: "tenemos un 33-12" });
    }
}


async function createCart(req, res) {
    try {
        const newCart = req.body;
        const cart = await cartDao.createCart(newCart);
        if (!cart) {
            return res.status(500).json({ message: "Error al crear el carrito" });
        }
        return res.json({ message: "Carrito creado", cart });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", error: "tenemos un 33-12" });
    }
}

async function addProductsToCart(req, res) {
    try {
        const cartId = req.params.cid;
        const products = req.body; 
        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: "Formato de productos no válido" });
        }

        
        for (const product of products) {
            const { productId, quantity } = product;
            if (quantity < 1) {
                return res.status(400).json({ message: "La cantidad debe ser 1 o más" });
            }
        }

        const result = await cartDao.addProductsToCart(cartId, products);
        return res.json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", error: error.message });
    }
}


async function updateProductQuantity(req, res) {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const newQuantity = req.body.quantity;
        const result = await cartDao.updateProductQuantity(cartId, productId, newQuantity);
        return res.json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", error: "tenemos un 33-12" });
    }
}


async function deleteCartById(req, res) {
    try {
        const cartId = req.params.id;
        const result = await cartDao.deleteCartById(cartId);
        return res.json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Algo salió mal al eliminar el carrito" });
    }
}


async function deleteAllProductsInCart(req, res) {
    try {
        const cartId = req.params.cid;
        const result = await cartDao.deleteAllProductsInCart(cartId);
        return res.json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Algo salió mal al eliminar los productos del carrito" });
    }
}


async function deleteProductFromCart(req, res) {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const result = await cartDao.deleteProductFromCart(cartId, productId);
        return res.json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Algo salió mal al eliminar el producto del carrito" });
    }
}


function generateUniqueCode() {
    return uuidv4();
}


async function purchaseProducts(req, res) {
    const cartId = req.params.cid;
    const userEmail = req.user.email;

    try {
        
        const cartProducts = await cartDao.getCartProducts(cartId); 
        const stock = await cartDao.checkStock(cartProducts);

        if (stock && stock.success === false) {
            return res.status(400).json({ message: stock.message });
        }

        const total = calculateTotal(cartProducts);
        const currentDate = new Date();
        const ticketData = {
            code: generateUniqueCode(),
            purchaser: userEmail,
            amount: total,
            products: cartProducts, 
            purchase_datetime: currentDate, 
            
        };
        const createdTicket = await cartDao.createTicket(ticketData);

        if(createdTicket){
            await cartDao.deleteAllProductsInCart(cartId);
        }

        return res.status(200).json({ ticket: createdTicket });
    } catch (error) {
        console.error("Error al comprar productos del carrito:", error);
        return res.status(500).json({ message: 'Error al comprar productos del carrito.' });
    }
}

function calculateTotal(cartProducts) {
    let total = 0;
    for (const product of cartProducts) {
       total += product.price * product.quantity;
    }
    return total;
}

export default {
    getCartById,
    getAllCarts,
    createCart,
    addProductsToCart,
    updateProductQuantity,
    deleteCartById,
    deleteAllProductsInCart,
    deleteProductFromCart,
    purchaseProducts,
    getUserCart,
};