const notificacionService = require('../services/NotificacionService');

// Obtener notificaciones no leidas
exports.getNoLeidas = async (req, res) => {
    try {
        const notificaciones = await notificacionService.getNotificaciones(req.params.usuarioId, false);
        res.json(notificaciones);
    } catch (err) {
        res.status(err.status || 500).json({ error: err.message || 'Error al obtener notificaciones no leídas.' });
    }
};

// Obtener notificaciones leidas
exports.getLeidas = async (req, res) => {
    try {
        const notificaciones = await notificacionService.getNotificaciones(req.params.usuarioId, true);
        res.json(notificaciones);
    } catch (err) {
        res.status(err.status || 500).json({ error: err.message || 'Error al obtener notificaciones leídas.' });
    }
};

// Marcar una notificación como leida
exports.marcarComoLeida = async (req, res) => {
    try {
        const notificacion = await notificacionService.marcarComoLeida(req.params.id);
        res.json({ mensaje: 'Notificación marcada como leída', notificacion });
    } catch (err) {
        res.status(err.status || 500).json({ error: err.message || 'Error al marcar la notificación como leída.' });
    }
};
