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
}, { _id: false }); // _id: false si no querés un ObjectId por cada foto

module.exports = fotoSchema;
