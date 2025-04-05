const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    rol: { type: String, enum: ['anfitrion', 'huesped'], required: true },
}, {
    timestamps: true
});

module.exports = mongoose.model('Usuario', usuarioSchema);
