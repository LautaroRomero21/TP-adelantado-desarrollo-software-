const Notificacion = require('./Notificacion');

class FactoryNotificacion {
    static crearSegunReserva(reserva) {
        const mensaje = `Reserva actualizada para ${reserva.alojamiento.nombre}`;
        return new Notificacion(mensaje, reserva.huespedReservador, new Date());
    }

    crearNotificacionReservaRealizada(reserva) {
        const { huespedReservador, rangoFechas, alojamiento } = reserva;
        const mensaje = `El usuario ${huespedReservador.nombre} ha realizado una reserva del ${rangoFechas.fechaInicio} al ${rangoFechas.fechaFin} para el alojamiento ${alojamiento.nombre}.`;

        return new Notificacion({
            mensaje,
            usuario: alojamiento.anfitrion,
            fechaAlta: new Date(),
            leida: false
        });
    }

    crearNotificacionReservaConfirmada(reserva) {
        const { huespedReservador, rangoFechas, alojamiento } = reserva;
        const mensaje = `Tu reserva del ${rangoFechas.fechaInicio} al ${rangoFechas.fechaFin} para el alojamiento ${alojamiento.nombre} ha sido confirmada por el anfitrión.`;

        return new Notificacion({
            mensaje,
            usuario: huespedReservador,
            fechaAlta: new Date(),
            leida: false
        });
    }

    crearNotificacionReservaCancelada(reserva, motivo) {
        const { huespedReservador, alojamiento } = reserva;
        const mensaje = `El usuario ${huespedReservador.nombre} ha cancelado su reserva para el alojamiento ${alojamiento.nombre}.${motivo ? " Motivo: " + motivo : ""}`;

        return new Notificacion({
            mensaje,
            usuario: alojamiento.anfitrion,
            fechaAlta: new Date(),
            leida: false
        });
    }

}




module.exports = FactoryNotificacion;