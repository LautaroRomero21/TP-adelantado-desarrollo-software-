const usuarioService = require('../services/UsuarioService');

const crearUsuario = async (req, res) => {
    try {
        const nuevoUsuario = await usuarioService.crearUsuario(req.body);
        res.status(201).json(nuevoUsuario);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await usuarioService.obtenerUsuarios();
        res.json(usuarios);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const obtenerUsuarioPorId = async (req, res) => {
    try {
        const usuario = await usuarioService.obtenerUsuarioPorId(req.params.id);
        if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json(usuario);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const actualizarUsuario = async (req, res) => {
    try {
        const usuarioActualizado = await usuarioService.actualizarUsuario(req.params.id, req.body);
        if (!usuarioActualizado) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json(usuarioActualizado);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const eliminarUsuario = async (req, res) => {
    try {
        const usuarioEliminado = await usuarioService.eliminarUsuario(req.params.id);
        if (!usuarioEliminado) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json({ mensaje: 'Usuario eliminado correctamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    crearUsuario,
    obtenerUsuarios,
    obtenerUsuarioPorId,
    actualizarUsuario,
    eliminarUsuario
};
