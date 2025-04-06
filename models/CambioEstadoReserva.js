class CambioEstadoReserva {
    constructor({
        fecha = new Date(),
        estado,
        reserva,
        motivo = null,
        usuario
    }) {
        if (!estado) throw new Error('El estado es obligatorio');
        if (!reserva) throw new Error('La reserva es obligatoria');
        if (!usuario) throw new Error('El usuario es obligatorio');

        const estadosValidos = ['pendiente', 'confirmada', 'rechazada', 'cancelada'];
        if (!estadosValidos.includes(estado)) {
            throw new Error(`Estado inválido: ${estado}`);
        }

        this.fecha = fecha;
        this.estado = estado;
        this.reserva = reserva;
        this.motivo = motivo;
        this.usuario = usuario;
    }
}

module.exports = CambioEstadoReserva;
