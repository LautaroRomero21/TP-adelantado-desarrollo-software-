class Reserva {
    constructor({ alojamiento, huesped, fechaInicio, fechaFin, estado = 'pendiente' }) {
        if (!alojamiento) throw new Error('El alojamiento es obligatorio');
        if (!huesped) throw new Error('El huésped es obligatorio');
        if (!fechaInicio || !fechaFin) throw new Error('Las fechas de inicio y fin son obligatorias');

        this.alojamiento = alojamiento;
        this.huesped = huesped;
        this.fechaInicio = new Date(fechaInicio);
        this.fechaFin = new Date(fechaFin);

        const estadosValidos = ['pendiente', 'confirmada', 'cancelada'];
        if (!estadosValidos.includes(estado)) {
            throw new Error(`Estado inválido: ${estado}`);
        }

        this.estado = estado;

        // timestamps
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}

module.exports = Reserva;
