const mongoose = require('mongoose');

const ciudadSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    pais: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pais',
        required: true
    }
});

module.exports = mongoose.model('Ciudad', ciudadSchema);
