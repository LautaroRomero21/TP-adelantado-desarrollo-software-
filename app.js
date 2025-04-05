// app.js
const express = require('express');
const swaggerUi = require('swagger-ui-express'); // ← ¡IMPORTANTE!
const swaggerSpec = require('./docs/swaggerConfig'); // o el path donde tengas la config de Swagger

const app = express();

// Middlewares
app.use(express.json());

// Documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Endpoint de salud
app.get('/health', (req, res) => {
    res.status(200).json({ status: "OK", timestamp: new Date() });
});

// Rutas usables
const reservaRoutes = require('./routes/ReservaRoutes');
app.use('/reservas', reservaRoutes);

const notificacionRoutes = require('./routes/NotificacionRoutes');
app.use('/notificaciones', notificacionRoutes);

const usuarioRoutes = require('./routes/UsuarioRoutes');
app.use('/usuarios', usuarioRoutes);

const alojamientoRoutes = require('./routes/AlojamientoRoutes');
app.use('/alojamientos', alojamientoRoutes);

module.exports = app;
