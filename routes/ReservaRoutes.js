const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/ReservaController');

/**
 * @swagger
 * tags:
 *   name: Reservas
 *   description: Operaciones relacionadas con reservas
 */

/**
 * @swagger
 * /reservas:
 *   post:
 *     summary: Crear una nueva reserva
 *     tags: [Reservas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - alojamiento
 *               - huesped
 *               - fechaInicio
 *               - fechaFin
 *             properties:
 *               alojamiento:
 *                 type: string
 *                 example: "66110fdc5f1a2c894ef404b3"
 *               huesped:
 *                 type: string
 *                 example: "661110e65f1a2c894ef404b4"
 *               fechaInicio:
 *                 type: string
 *                 format: date
 *                 example: "2025-05-01"
 *               fechaFin:
 *                 type: string
 *                 format: date
 *                 example: "2025-05-05"
 *     responses:
 *       201:
 *         description: Reserva creada exitosamente
 */
router.post('/crear', reservaController.crearReserva);

/**
 * @swagger
 * /reservas:
 *   delete:
 *     summary: Cancelar una reserva
 *     tags: [Reservas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reservaId
 *               - usuarioId
 *             properties:
 *               reservaId:
 *                 type: string
 *                 example: "661118795f1a2c894ef404b5"
 *               usuarioId:
 *                 type: string
 *                 example: "661110e65f1a2c894ef404b4"
 *               motivo:
 *                 type: string
 *                 example: "Cambio de planes"
 *     responses:
 *       200:
 *         description: Reserva cancelada exitosamente
 */
router.patch('/:id/cancelar', reservaController.cancelarReserva);

/**
 * @swagger
 * /reservas/usuario/{usuarioId}:
 *   get:
 *     summary: Obtener historial de reservas de un usuario
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Lista de reservas del usuario
 */
router.get('/usuario/:usuarioId', reservaController.historialReservas);

/**
 * @swagger
 * /reservas/{id}:
 *   put:
 *     summary: Modificar una reserva existente
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la reserva a modificar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fechaInicio:
 *                 type: string
 *                 format: date
 *                 example: "2025-06-01"
 *               fechaFin:
 *                 type: string
 *                 format: date
 *                 example: "2025-06-05"
 *     responses:
 *       200:
 *         description: Reserva modificada exitosamente
 */
router.put('/:id', reservaController.modificarReserva);

module.exports = router;
