const mongoose = require('mongoose');

const fotoSchema = new mongoose.Schema({
    descripcion: {
        type: String,
        required: true,
        trim: true
    },
    path: {
        type: String,
        required: true
    }
}, { _id: false });

module.exports = fotoSchema;
