class Ciudad {
    constructor({ nombre, pais }) {
        if (!nombre) throw new Error('El nombre es obligatorio');
        if (!pais) throw new Error('El país es obligatorio');

        this.nombre = nombre;
        this.pais = pais;
    }
}

module.exports = Ciudad;
