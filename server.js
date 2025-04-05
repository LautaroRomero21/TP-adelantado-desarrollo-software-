// server.js
require('dotenv').config(); // Cargar .env
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 3000;

// Conectar a la DB y arrancar el servidor
connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("❌ No se pudo iniciar el servidor por error en la DB:", err);
    });
