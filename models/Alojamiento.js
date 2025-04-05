const mongoose = require('mongoose');
const fotoSchema = require('./Foto');

const alojamientoSchema = new mongoose.Schema({
    anfitrion: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    precioPorNoche: { type: Number, required: true },
    moneda: { type: String, default: 'USD' },
    horarioCheckIn: { type: String },
    horarioCheckOut: { type: String },
    direccion: { type: mongoose.Schema.Types.ObjectId, ref: 'Direccion', required: true },
    cantHuespedesMax: { type: Number, required: true },
    caracteristicas: { type: String, enum: ['WIFI', 'PISCINA', 'MASCOTAS_PERMITIDAS', 'ESTACIONAMIENTO'] },
    reservas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reserva' }],
    fotos: [fotoSchema]
}, {
    timestamps: true
});

/// ------------------------------
/// Métodos personalizados
/// ------------------------------
alojamientoSchema.methods.estasDisponibleEn = async function (rangoFechas) {
    const Reserva = mongoose.model('Reserva');

    // Obtener todas las reservas asociadas al alojamiento
    const reservas = await Reserva.find({
        _id: { $in: this.reservas },
        estado: { $in: ['pendiente', 'confirmada'] }
    });

    // Revisar si hay superposición entre alguna reserva y el rango dado
    for (const reserva of reservas) {
        const inicioExistente = new Date(reserva.fechaInicio);
        const finExistente = new Date(reserva.fechaFin);

        const inicioSolicitado = new Date(rangoFechas.fechaInicio);
        const finSolicitado = new Date(rangoFechas.fechaFin);

        const haySuperposicion = (
            inicioSolicitado <= finExistente &&
            finSolicitado >= inicioExistente
        );

        if (haySuperposicion) {
            return false; // No está disponible
        }
    }

    return true; // Está disponible
};

alojamientoSchema.methods.tuPrecioEstaDentroDe = function (valorMinimo, valorMaximo) {
    return this.precioPorNoche >= valorMinimo && this.precioPorNoche <= valorMaximo;
};

alojamientoSchema.methods.tenesCaracteristica = function (caracteristica) {
    return this.caracteristicas.includes(caracteristica);
};

alojamientoSchema.methods.puedenAlojarse = function (cantHuespedes) {
    return cantHuespedes <= this.cantHuespedesMax;
};

/// ------------------------------

module.exports = mongoose.model('Alojamiento', alojamientoSchema);
