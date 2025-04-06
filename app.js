const express = require('express');
const os = require('os');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swaggerConfig');
const app = express();

// Middlewares
app.use(express.json());

// Documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Endpoint de salud
app.get('/health', async (req, res) => {
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();
    const loadAverage = os.loadavg()[0];
    const mongoStatus = mongoose.connection.readyState; // 1 = conectado

    // Límites configurables
    const memoryLimitMB = 500;
    const loadLimit = os.cpus().length * 1.5;
    const uptimeLimit = 10;

    const checks = {
        memoryOK: memoryUsage.rss / 1024 / 1024 < memoryLimitMB,
        loadOK: loadAverage < loadLimit,
        uptimeOK: uptime > uptimeLimit,
        mongoOK: mongoStatus === 1
    };

    const isHealthy = Object.values(checks).every(Boolean);
    const statusCode = isHealthy ? 200 : 503;

    res.status(statusCode).json({
        status: isHealthy ? 'OK' : 'UNHEALTHY',
        timestamp: new Date(),
        uptime: `${uptime.toFixed(2)} segundos`,
        memoryUsage: {
            rss: `${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB`,
            heapUsed: `${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`,
            heapTotal: `${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`,
        },
        server: {
            hostname: os.hostname(),
            platform: os.platform(),
            arch: os.arch(),
            cpus: os.cpus().length,
            loadAverage: os.loadavg()
        },
        mongo: {
            status: mongoStatus === 1 ? 'Connected' : 'Disconnected',
            readyState: mongoStatus
        },
        version: '1.0.0',
        checks
    });
});

// Rutas
const reservaRoutes = require('./routes/ReservaRoutes');
app.use('/reservas', reservaRoutes);

const notificacionRoutes = require('./routes/NotificacionRoutes');
app.use('/notificaciones', notificacionRoutes);

const usuarioRoutes = require('./routes/UsuarioRoutes');
app.use('/usuarios', usuarioRoutes);

const alojamientoRoutes = require('./routes/AlojamientoRoutes');
app.use('/alojamientos', alojamientoRoutes);

module.exports = app;
