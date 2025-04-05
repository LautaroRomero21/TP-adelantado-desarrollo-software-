const reservaService = require('../services/ReservaService');

// Crear nueva reserva
const crearReserva = async (req, res) => {
    try {
        const reserva = await reservaService.crearReserva(req.body);
        res.status(201).json(reserva);
    } catch (err) {
        res.status(err.status || 500).json({ error: err.message });
    }
};

// Cancelar una reserva
const cancelarReserva = async (req, res) => {
    try {
        const mensaje = await reservaService.cancelarReserva(req.params.id);
        res.json({ mensaje });
    } catch (err) {
        res.status(err.status || 500).json({ error: err.message });
    }
};

// Obtener historial de reservas de un usuario
const historialReservas = async (req, res) => {
    try {
        const reservas = await reservaService.historialReservas(req.params.usuarioId);
        res.json(reservas);
    } catch (err) {
        res.status(err.status || 500).json({ error: err.message });
    }
};

// Modificar una reserva (fechas)
const modificarReserva = async (req, res) => {
    try {
        const reserva = await reservaService.modificarReserva(req.params.id, req.body);
        res.json(reserva);
    } catch (err) {
        res.status(err.status || 500).json({ error: err.message });
    }
};

module.exports = {
    crearReserva,
    cancelarReserva,
    historialReservas,
    modificarReserva
};
