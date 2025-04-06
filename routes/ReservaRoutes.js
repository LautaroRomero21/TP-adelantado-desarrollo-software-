const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/ReservaController');

/**
 * @swagger
 * /reservas/crear:
 *   post:
 *     summary: Crear una nueva reserva
 *     tags:
 *       - Reservas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - alojamientoId
 *               - huespedId
 *               - fechaInicio
 *               - fechaFin
 *             properties:
 *               alojamientoId:
 *                 type: string
 *               huespedId:
 *                 type: string
 *               fechaInicio:
 *                 type: string
 *                 format: date
 *               fechaFin:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Reserva creada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reserva'
 *       400:
 *         description: Datos inválidos.
 */
router.post('/crear', reservaController.crearReserva);

/**
 * @swagger
 * /reservas/{id}/aceptar:
 *   patch:
 *     summary: Aceptar una reserva
 *     tags:
 *       - Reservas
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la reserva a aceptar
 *     responses:
 *       200:
 *         description: Reserva aceptada exitosamente
 *       404:
 *         description: Reserva no encontrada
 */
router.patch('/:id/aceptar', reservaController.aceptarReserva);

/**
 * @swagger
 * /reservas/{id}/cancelar:
 *   patch:
 *     summary: Cancelar una reserva
 *     tags:
 *       - Reservas
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la reserva a cancelar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usuarioId
 *             properties:
 *               usuarioId:
 *                 type: string
 *               motivo:
 *                 type: string
 *                 description: Motivo de la cancelación (opcional)
 *     responses:
 *       200:
 *         description: Reserva cancelada exitosamente
 *       404:
 *         description: Reserva no encontrada
 */
router.patch('/:id/cancelar', reservaController.cancelarReserva);

/**
 * @swagger
 * /reservas/usuario/{usuarioId}:
 *   get:
 *     summary: Obtener historial de reservas de un usuario
 *     tags:
 *       - Reservas
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Lista de reservas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reserva'
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/usuario/:usuarioId', reservaController.historialReservas);

/**
 * @swagger
 * /reservas/{id}:
 *   put:
 *     summary: Modificar fechas de una reserva
 *     tags:
 *       - Reservas
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la reserva
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fechaInicio
 *               - fechaFin
 *             properties:
 *               fechaInicio:
 *                 type: string
 *                 format: date
 *               fechaFin:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Reserva modificada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reserva'
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Reserva no encontrada
 */
router.put('/:id', reservaController.modificarReserva);

module.exports = router;
