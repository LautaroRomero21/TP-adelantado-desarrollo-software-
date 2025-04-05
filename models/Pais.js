const mongoose = require('mongoose');

const paisSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }
});

module.exports = mongoose.model('Pais', paisSchema);