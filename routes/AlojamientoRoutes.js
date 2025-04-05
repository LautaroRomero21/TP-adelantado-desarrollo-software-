const express = require('express');
const router = express.Router();
const AlojamientoController = require('../controllers/AlojamientoController');

/**
 * @swagger
 * tags:
 *   name: Alojamientos
 *   description: Búsqueda y gestión de alojamientos
 */

/**
 * @swagger
 * /alojamientos:
 *   get:
 *     summary: Buscar alojamientos con filtros opcionales
 *     tags: [Alojamientos]
 *     parameters:
 *       - in: query
 *         name: ciudad
 *         schema:
 *           type: string
 *         description: ID de la ciudad
 *       - in: query
 *         name: pais
 *         schema:
 *           type: string
 *         description: ID del país
 *       - in: query
 *         name: capacidad
 *         schema:
 *           type: number
 *         description: Capacidad mínima del alojamiento
 *       - in: query
 *         name: minPrecio
 *         schema:
 *           type: number
 *         description: Precio mínimo por noche
 *       - in: query
 *         name: caracteristicas
 *         schema:
 *           type: string
 *         description: Características separadas por coma (ej. wifi,pileta)
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *           default: 1
 *         description: Número de página para paginación
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 10
 *         description: Cantidad de alojamientos por página
 *     responses:
 *       200:
 *         description: Lista de alojamientos filtrados
 *       500:
 *         description: Error interno del servidor
 */
router.get('/', AlojamientoController.buscarAlojamientos);

module.exports = router;