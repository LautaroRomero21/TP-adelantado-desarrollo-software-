// server.js
require('dotenv').config(); // Cargar variables de entorno
const app = require('./app');

const PORT = process.env.PORT || 3000;

// Arrancar el servidor sin conectar a la DB
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
