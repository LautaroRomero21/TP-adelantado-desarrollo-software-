const mongoose = require('mongoose');

const reservaSchema = new mongoose.Schema({
    alojamiento: { type: mongoose.Schema.Types.ObjectId, ref: 'Alojamiento', required: true },
    huesped: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    fechaInicio: { type: Date, required: true },
    fechaFin: { type: Date, required: true },
    estado: { type: String, enum: ['pendiente', 'confirmada', 'cancelada'], default: 'pendiente' }
}, {
    timestamps: true
});

reservaSchema.methods.cambiarEstado = function (estado) {
    this.estado = estado;
    this.updatedAt = new Date();
};

module.exports = mongoose.model('Reserva', reservaSchema);
