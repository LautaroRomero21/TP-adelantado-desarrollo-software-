class Notificacion {
    constructor({ mensaje, usuario, fechaAlta = new Date(), leida = false, fechaLeida = null }) {
        if (!mensaje || typeof mensaje !== 'string') {
            throw new Error('El mensaje es obligatorio y debe ser un string');
        }
        if (!usuario) {
            throw new Error('El usuario es obligatorio');
        }

        this.mensaje = mensaje;
        this.usuario = usuario;
        this.fechaAlta = fechaAlta;
        this.leida = leida;
        this.fechaLeida = fechaLeida;
    }

    marcarComoLeida() {
        this.leida = true;
        this.fechaLeida = new Date();
        // En una clase sin base de datos, podrías devolver el objeto modificado
        return this;
    }
}

module.exports = Notificacion;
