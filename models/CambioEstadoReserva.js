const mongoose = require('mongoose');

const cambioEstadoReservaSchema = new mongoose.Schema({
    fecha: {
        type: Date,
        required: true,
        default: Date.now
    },
    estado: {
        type: String,
        required: true,
        enum: ['pendiente', 'aprobada', 'rechazada', 'cancelada'] // o los que tengas
    },
    reserva: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reserva',
        required: true
    },
    motivo: {
        type: String,
        default: null
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
});


module.exports = mongoose.model('CambioEstadoReserva', cambioEstadoReservaSchema);

