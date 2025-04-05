const Foto = require('./Foto');

class Alojamiento {
    constructor({
        anfitrion,
        nombre,
        descripcion,
        precioPorNoche,
        moneda = 'USD',
        horarioCheckIn,
        horarioCheckOut,
        direccion,
        cantHuespedesMax,
        caracteristicas,
        reservas = [],
        fotos = [],
        createdAt = new Date(),
        updatedAt = new Date()
    }) {
        this.anfitrion = anfitrion;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precioPorNoche = precioPorNoche;
        this.moneda = moneda;
        this.horarioCheckIn = horarioCheckIn;
        this.horarioCheckOut = horarioCheckOut;
        this.direccion = direccion;
        this.cantHuespedesMax = cantHuespedesMax;
        this.caracteristicas = caracteristicas;
        this.reservas = reservas;
        this.fotos = fotos.map(f => new Foto(f));
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    estasDisponibleEn(rangoFechas) {
        // Verificar si el rango de fechas del alojamiento no se solapa con las reservas existentes
        for (const reserva of this.reservas) {
            // Comprobar si las fechas de la reserva se solapan con el rangoFechas
            if (
                (rangoFechas.fechaInicio < reserva.fechaFin && rangoFechas.fechaFin > reserva.fechaInicio)
            ) {
                return false; // Si las fechas se solapan, no está disponible
            }
        }
        return true; // Si no hay solapamientos, está disponible
    }


    tuPrecioEstaDentroDe(valorMinimo, valorMaximo) {
        return this.precioPorNoche >= valorMinimo && this.precioPorNoche <= valorMaximo;
    }

    tenesCaracteristica(caracteristica) {
        return this.caracteristicas.includes(caracteristica);
    }

    puedenAlojarse(cantHuespedes) {
        return cantHuespedes <= this.cantHuespedesMax;
    }
}

module.exports = Alojamiento;
