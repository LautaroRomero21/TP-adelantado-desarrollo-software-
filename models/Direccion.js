const mongoose = require('mongoose');

const direccionSchema = new mongoose.Schema({
    calle: {
        type: String,
        required: true
    },
    altura: {
        type: Number,
        required: true
    },
    ciudad: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ciudad',
        required: true
    },
    lat: {
        type: Number,
        required: false
    },
    long: {
        type: Number,
        required: false
    }
});

module.exports = mongoose.model('Direccion', direccionSchema);
