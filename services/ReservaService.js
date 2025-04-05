const Reserva = require('../models/Reserva');
const Alojamiento = require('../models/Alojamiento');

const crearReserva = async ({ alojamientoId, huespedId, fechaInicio, fechaFin }) => {
    const alojamiento = await Alojamiento.findById(alojamientoId).populate('reservas');
    if (!alojamiento) throw { status: 404, message: 'Alojamiento no encontrado' };

    const haySuperposicion = alojamiento.reservas.some(reserva =>
        (fechaInicio < reserva.fechaFin && fechaFin > reserva.fechaInicio)
    );

    if (haySuperposicion) throw { status: 400, message: 'El alojamiento no está disponible en esas fechas' };

    const nuevaReserva = new Reserva({
        alojamiento: alojamientoId,
        huesped: huespedId,
        fechaInicio,
        fechaFin
    });

    await nuevaReserva.save();
    alojamiento.reservas.push(nuevaReserva._id);
    await alojamiento.save();

    return nuevaReserva;
};

const cancelarReserva = async (reservaId) => {
    const reserva = await Reserva.findById(reservaId);
    if (!reserva) throw { status: 404, message: 'Reserva no encontrada' };

    const ahora = new Date();
    if (reserva.fechaInicio <= ahora)
        throw { status: 400, message: 'No se puede cancelar una reserva ya iniciada o pasada' };

    reserva.estado = 'cancelada';
    await reserva.save();

    return 'Reserva cancelada exitosamente';
};

const historialReservas = async (usuarioId) => {
    return await Reserva.find({ huesped: usuarioId }).populate('alojamiento');
};

const modificarReserva = async (reservaId, { fechaInicio, fechaFin }) => {
    const reserva = await Reserva.findById(reservaId).populate('alojamiento');
    if (!reserva) throw { status: 404, message: 'Reserva no encontrada' };

    if (reserva.estado === 'cancelada')
        throw { status: 400, message: 'No se puede modificar una reserva cancelada' };

    const reservasAloj = await Reserva.find({
        alojamiento: reserva.alojamiento._id,
        _id: { $ne: reservaId },
        $or: [
            { fechaInicio: { $lt: fechaFin }, fechaFin: { $gt: fechaInicio } }
        ]
    });

    if (reservasAloj.length > 0)
        throw { status: 400, message: 'No hay disponibilidad para las nuevas fechas' };

    reserva.fechaInicio = fechaInicio;
    reserva.fechaFin = fechaFin;
    await reserva.save();

    return reserva;
};

module.exports = {
    crearReserva,
    cancelarReserva,
    historialReservas,
    modificarReserva
};
