const mongoose = require('mongoose');
const Reserva = require('../models/Reserva');
const Alojamiento = require('../models/Alojamiento');
const CambioEstadoReserva = require('../models/CambioEstadoReserva');


const crearReserva = async ({ alojamientoId, huespedId, fechaInicio, fechaFin }) => {
    fechaInicio = new Date(fechaInicio);
    fechaFin = new Date(fechaFin);

    // Verificar que las fechas sean validas
    if (isNaN(fechaInicio) || isNaN(fechaFin)) {
        throw { status: 400, message: 'Fechas inválidas' };
    }

    // Verificar que la fecha de inicio no sea posterior a la de fin
    if (fechaInicio >= fechaFin) {
        throw { status: 400, message: 'La fecha de inicio debe ser anterior a la de fin' };
    }

    // Buscar el alojamiento
    const alojamiento = await Alojamiento.findById(alojamientoId);
    if (!alojamiento) {
        throw { status: 404, message: 'Alojamiento no encontrado' };
    }

    // Buscar reservas que se solapan con las fechas propuestas
    const reservasConflicto = await Reserva.find({
        alojamiento: alojamientoId,
        $or: [
            { fechaInicio: { $lt: fechaFin }, fechaFin: { $gt: fechaInicio } }
        ]
    });

    if (reservasConflicto.length > 0) {
        throw { status: 400, message: 'El alojamiento no está disponible en esas fechas' };
    }

    // Crear la nueva reserva
    const nuevaReserva = new Reserva({
        alojamiento: alojamientoId,
        huesped: huespedId,
        fechaInicio,
        fechaFin
    });

    // Guardar la nueva reserva
    await nuevaReserva.save();

    // Actualizar el array de reservas en el alojamiento
    alojamiento.reservas.push(nuevaReserva._id);
    await alojamiento.save();

    return nuevaReserva;
};

const cancelarReserva = async (reservaId, usuarioId, motivo) => {
    const reserva = await Reserva.findById(reservaId);
    if (!reserva) throw { status: 404, message: 'Reserva no encontrada' };

    if (!usuarioId || !reservaId) {
        throw { status: 400, message: 'Faltan datos obligatorios para cancelar la reserva' };
    }

    const ahora = new Date();
    if (reserva.fechaInicio <= ahora)
        throw { status: 400, message: 'No se puede cancelar una reserva ya iniciada o pasada' };

    // Cambiar el estado
    reserva.estado = 'cancelada';
    await reserva.save();

    // Registrar el cambio de estado con motivo personalizado
    await CambioEstadoReserva.create({
        reserva: reserva._id,
        estado: 'cancelada',
        motivo: motivo || 'Sin especificar',
        usuario: usuarioId
    });

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
