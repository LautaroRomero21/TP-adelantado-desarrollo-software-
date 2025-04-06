const express = require('express');
const router = express.Router();
const notificacionController = require('../controllers/NotificacionController');

/**
 * @swagger
 * /notificaciones/no-leidas/{usuarioId}:
 *   get:
 *     summary: Obtener notificaciones no leídas
 *     description: Devuelve todas las notificaciones no leídas para un usuario.
 *     tags:
 *       - Notificaciones
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario para obtener sus notificaciones no leídas.
 *     responses:
 *       200:
 *         description: Lista de notificaciones no leídas.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notificacion'
 *       404:
 *         description: Usuario no encontrado.
 */
router.get('/no-leidas/:usuarioId', notificacionController.getNoLeidas);

/**
 * @swagger
 * /notificaciones/leidas/{usuarioId}:
 *   get:
 *     summary: Obtener notificaciones leídas
 *     description: Devuelve todas las notificaciones leídas para un usuario.
 *     tags:
 *       - Notificaciones
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario para obtener sus notificaciones leídas.
 *     responses:
 *       200:
 *         description: Lista de notificaciones leídas.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notificacion'
 *       404:
 *         description: Usuario no encontrado.
 */
router.get('/leidas/:usuarioId', notificacionController.getLeidas);

/**
 * @swagger
 * /notificaciones/{id}/marcar-como-leida:
 *   patch:
 *     summary: Marcar notificación como leída
 *     description: Cambia el estado de una notificación a leída.
 *     tags:
 *       - Notificaciones
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la notificación a marcar como leída.
 *     responses:
 *       200:
 *         description: Notificación marcada como leída exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notificacion'
 *       404:
 *         description: Notificación no encontrada.
 */
router.patch('/:id/marcar-como-leida', notificacionController.marcarComoLeida);

module.exports = router;
