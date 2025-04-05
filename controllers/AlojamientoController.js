const AlojamientoService = require('../services/AlojamientoService');

const buscarAlojamientos = async (req, res) => {
    try {
        const resultados = await AlojamientoService.buscarAlojamientos(req.query);
        res.json(resultados);
    } catch (error) {
        console.error("❌ Error en buscarAlojamientos:", error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    buscarAlojamientos
};
