// app.js
const express = require('express');
const os = require('os');
const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();
    const loadAverage = os.loadavg()[0]; // carga del ultimo minuto

    // Condiciones de alerta
    const memoryLimitMB = 500; // ajustable
    const loadLimit = os.cpus().length * 1.5; // por CPU
    const uptimeLimit = 10; // en segundos

    const isHealthy =
        memoryUsage.rss / 1024 / 1024 < memoryLimitMB &&
        loadAverage < loadLimit &&
        uptime > uptimeLimit;

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
        version: '1.0.0',
        checks: {
            memoryOK: memoryUsage.rss / 1024 / 1024 < memoryLimitMB,
            loadOK: loadAverage < loadLimit,
            uptimeOK: uptime > uptimeLimit
        }
    });
});

module.exports = app;
