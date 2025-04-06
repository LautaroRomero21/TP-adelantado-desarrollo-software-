const express = require('express');
const router = express.Router();
const AlojamientoController = require('../controllers/AlojamientoController');

/**
 * @swagger
 * /alojamientos:
 *   get:
 *     summary: Buscar alojamientos
 *     description: Busca alojamientos aplicando filtros por ciudad, país, precio, capacidad y características.
 *     tags:
 *       - Alojamientos
 *     parameters:
 *       - in: query
 *         name: ciudad
 *         schema:
 *           type: string
 *         description: Nombre de la ciudad donde buscar alojamientos.
 *       - in: query
 *         name: pais
 *         schema:
 *           type: string
 *         description: Nombre del país donde buscar alojamientos.
 *       - in: query
 *         name: minPrecio
 *         schema:
 *           type: number
 *         description: Precio mínimo por noche.
 *       - in: query
 *         name: maxPrecio
 *         schema:
 *           type: number
 *         description: Precio máximo por noche.
 *       - in: query
 *         name: capacidad
 *         schema:
 *           type: integer
 *         description: Capacidad mínima de huéspedes.
 *       - in: query
 *         name: caracteristicas
 *         schema:
 *           type: string
 *         description: "Características requeridas separadas por coma (por ejemplo: wifi,cocina)"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página para paginación.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Cantidad de resultados por página.
 *     responses:
 *       200:
 *         description: Lista de alojamientos filtrados.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 resultados:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Alojamiento'
 *       400:
 *         description: Parámetros inválidos o mal formateados.
 *       404:
 *         description: Ciudad o país no encontrados.
 */
router.get('/', AlojamientoController.buscarAlojamientos);

module.exports = router;
