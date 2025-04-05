const mongoose = require('mongoose');
const uri = process.env.MONGODB_URI;

async function connectDB() {
    try {
        await mongoose.connect(uri);
        console.log("✅ Conectado a MongoDB correctamente con Mongoose");
    } catch (error) {
        console.error("❌ Error al conectar con MongoDB", error);
        throw error;
    }
}

module.exports = connectDB;
