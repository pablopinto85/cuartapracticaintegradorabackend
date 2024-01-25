import mongoose from "mongoose";

const usersCollection = "users";


const userSchema = new mongoose.Schema({
    nombre: { type: String, max: 20, required: false },
    apellido: { type: String, max: 30, required: false },
    email: { type: String, max: 50, required: true },
    password: { type: String, max: 50, required: false }, 
    isGithubAuth: { type: Boolean, default: false, required: false },
    cartId: { type: mongoose.Schema.Types.ObjectId, ref: 'carts', required: true }, 
    rol: { type: String, enum: ["user", "admin", "premium"], default: "user" },
    documents:{name: String, reference: String},
    last_connection: {type: Date, default: null}
});



// Validación condicional para campos requeridos
userSchema.pre("save", function(next) {
    // Verificar si el usuario se autenticó con GitHub
    if (this.isGithubAuth) {
        // Si se autenticó con GitHub, invalidar los campos requeridos
        this.apellido = undefined;
        this.password = undefined;
    }
    next();
});

const userModel = mongoose.model(usersCollection, userSchema)

export default userModel