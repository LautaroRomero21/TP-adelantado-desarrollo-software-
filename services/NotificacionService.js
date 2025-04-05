const Notificacion = require('../models/Notificacion');

const getNotificaciones = async (usuarioId, leida) => {
    return await Notificacion.find({ usuario: usuarioId, leida });
};

const marcarComoLeida = async (notificacionId) => {
    const notificacion = await Notificacion.findById(notificacionId);
    if (!notificacion) throw { status: 404, message: 'Notificación no encontrada' };

    await notificacion.marcarComoLeida();
    return notificacion;
};

module.exports = {
    getNotificaciones,
    marcarComoLeida
};
