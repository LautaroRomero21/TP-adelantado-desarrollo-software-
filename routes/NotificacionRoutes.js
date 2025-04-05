const express = require('express');
const router = express.Router();
const notificacionController = require('../controllers/NotificacionController');

/**
 * @swagger
 * tags:
 *   name: Notificaciones
 *   description: Gestión de notificaciones para los usuarios
 */

/**
 * @swagger
 * /notificaciones/no-leidas/{usuarioId}:
 *   get:
 *     summary: Obtener notificaciones no leídas de un usuario
 *     tags: [Notificaciones]
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Lista de notificaciones no leídas
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/no-leidas/:usuarioId', notificacionController.getNoLeidas);

/**
 * @swagger
 * /notificaciones/leidas/{usuarioId}:
 *   get:
 *     summary: Obtener notificaciones leídas de un usuario
 *     tags: [Notificaciones]
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Lista de notificaciones leídas
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/leidas/:usuarioId', notificacionController.getLeidas);

/**
 * @swagger
 * /notificaciones/{id}/marcar-como-leida:
 *   patch:
 *     summary: Marcar una notificación como leída
 *     tags: [Notificaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la notificación
 *     responses:
 *       200:
 *         description: Notificación marcada como leída
 *       404:
 *         description: Notificación no encontrada
 */
router.patch('/:id/marcar-como-leida', notificacionController.marcarComoLeida);

module.exports = router;