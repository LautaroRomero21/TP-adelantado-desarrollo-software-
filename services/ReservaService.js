const mongoose = require('mongoose');
const Reserva = require('../models/Reserva');
const Alojamiento = require('../models/Alojamiento');
const CambioEstadoReserva = require('../models/CambioEstadoReserva');
const FactoryNotificacion = require('../models/FactoryNotificacion');


const crearReserva = async ({ alojamientoId, huespedId, fechaInicio, fechaFin }) => {
    fechaInicio = new Date(fechaInicio);
    fechaFin = new Date(fechaFin);

    if (isNaN(fechaInicio) || isNaN(fechaFin)) {
        throw { status: 400, message: 'Fechas inválidas' };
    }
    if (fechaInicio >= fechaFin) {
        throw { status: 400, message: 'La fecha de inicio debe ser anterior a la de fin' };
    }
    const alojamiento = await Alojamiento.findById(alojamientoId);
    if (!alojamiento) {
        throw { status: 404, message: 'Alojamiento no encontrado' };
    }

    const reservasConflicto = await Reserva.find({
        alojamiento: alojamientoId,
        $or: [
            { fechaInicio: { $lt: fechaFin }, fechaFin: { $gt: fechaInicio } }
        ]
    });

    if (reservasConflicto.length > 0) {
        throw { status: 400, message: 'El alojamiento no está disponible en esas fechas' };
    }

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

const aceptarReserva = async (reservaId) => {
    if (!reservaId) {
        throw { status: 400, message: 'Faltan datos obligatorios para aceptar la reserva' };
    }

    const reserva = await Reserva.findById(reservaId)
        .populate('huesped')
        .populate('alojamiento');

    if (!reserva) throw { status: 404, message: 'Reserva no encontrada' };

    reserva.cambiarEstado('confirmada');

    const notificacion = FactoryNotificacion.prototype.crearNotificacionReservaConfirmada({
        huespedReservador: reserva.huesped,
        alojamiento: reserva.alojamiento,
        rangoFechas: {
            fechaInicio: reserva.fechaInicio.toLocaleDateString(),
            fechaFin: reserva.fechaFin.toLocaleDateString()
        }
    });
    await notificacion.save();

    await CambioEstadoReserva.create({
        reserva: reserva._id,
        estado: 'confirmada',
        motivo: 'Aceptada por anfitrión',
        usuario: reserva.huesped
    });

    await reserva.save();

    return 'Reserva confirmada exitosamente';
};

const cancelarReserva = async (reservaId, usuarioId, motivo) => {
    if (!reservaId || !usuarioId) {
        throw { status: 400, message: 'Faltan datos obligatorios para cancelar la reserva' };
    }

    const reserva = await Reserva.findById(reservaId)
        .populate('huesped')
        .populate('alojamiento');

    if (!reserva) throw { status: 404, message: 'Reserva no encontrada' };

    const ahora = new Date();
    if (reserva.fechaInicio <= ahora) {
        throw { status: 400, message: 'No se puede cancelar una reserva ya iniciada o pasada' };
    }

    reserva.cambiarEstado('cancelada');
    await reserva.save();

    await CambioEstadoReserva.create({
        reserva: reserva._id,
        estado: 'cancelada',
        motivo: motivo || 'Sin especificar',
        usuario: usuarioId
    });

    // Notificación al huesped
    const notificacion = FactoryNotificacion.prototype.crearNotificacionReservaCancelada({
        huespedReservador: reserva.huesped,
        alojamiento: reserva.alojamiento,
        rangoFechas: {
            fechaInicio: reserva.fechaInicio.toLocaleDateString(),
            fechaFin: reserva.fechaFin.toLocaleDateString()
        },
        motivo: motivo || 'Sin especificar'
    });
    await notificacion.save();

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
    aceptarReserva,
    cancelarReserva,
    historialReservas,
    modificarReserva
};
