const mongoose = require('mongoose');

const notificacionSchema = new mongoose.Schema({
    mensaje: { type: String, required: true },
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    fechaAlta: { type: Date, default: Date.now },
    leida: { type: Boolean, default: false },
    fechaLeida: { type: Date, default: null }
}, {
    timestamps: false
});

/// ------------------------------
/// Métodos personalizados
/// ------------------------------
notificacionSchema.methods.marcarComoLeida = function () {
    this.leida = true;
    this.fechaLeida = new Date();
    return this.save(); // guarda el cambio en la DB
};

/// ------------------------------

module.exports = mongoose.model('Notificacion', notificacionSchema);
