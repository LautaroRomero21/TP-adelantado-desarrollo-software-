class Pais {
    constructor({ nombre }) {
        if (!nombre || typeof nombre !== 'string') {
            throw new Error('El nombre es obligatorio y debe ser un string');
        }

        this.nombre = nombre.trim();
    }
}

module.exports = Pais;
