class Usuario {
    constructor({ nombre, email, rol }) {
        if (!nombre) throw new Error('El nombre es obligatorio');
        if (!email) throw new Error('El email es obligatorio');

        const rolesValidos = ['anfitrion', 'huesped'];
        if (!rolesValidos.includes(rol)) {
            throw new Error(`Rol inválido: ${rol}`);
        }

        this.nombre = nombre;
        this.email = email;
        this.rol = rol;

        // timestamps
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}

module.exports = Usuario;
