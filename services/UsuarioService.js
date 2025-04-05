const Usuario = require('../models/Usuario');

const crearUsuario = async (datos) => {
    const usuario = new Usuario(datos);
    return await usuario.save();
};

const obtenerUsuarios = async () => {
    return await Usuario.find();
};

const obtenerUsuarioPorId = async (id) => {
    return await Usuario.findById(id);
};

const actualizarUsuario = async (id, nuevosDatos) => {
    return await Usuario.findByIdAndUpdate(id, nuevosDatos, { new: true });
};

const eliminarUsuario = async (id) => {
    return await Usuario.findByIdAndDelete(id);
};

module.exports = {
    crearUsuario,
    obtenerUsuarios,
    obtenerUsuarioPorId,
    actualizarUsuario,
    eliminarUsuario
};
