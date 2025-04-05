class Direccion {
    constructor({ calle, altura, ciudad, lat = null, long = null }) {
        if (!calle) throw new Error('La calle es obligatoria');
        if (typeof altura !== 'number') throw new Error('La altura debe ser un número');
        if (!ciudad) throw new Error('La ciudad es obligatoria');

        this.calle = calle;
        this.altura = altura;
        this.ciudad = ciudad;
        this.lat = lat;
        this.long = long;
    }
}

module.exports = Direccion;
