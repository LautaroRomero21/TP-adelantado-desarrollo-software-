class Foto {
    constructor({ descripcion, path }) {
        if (!descripcion || typeof descripcion !== 'string') {
            throw new Error('La descripción es obligatoria y debe ser un string');
        }
        if (!path || typeof path !== 'string') {
            throw new Error('El path es obligatorio y debe ser un string');
        }

        this.descripcion = descripcion.trim();
        this.path = path;
    }
}

module.exports = Foto;
