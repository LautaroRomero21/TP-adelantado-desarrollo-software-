const mongoose = require('mongoose');
const AlojamientoService = require('../services/AlojamientoService');

const Alojamiento = require('../models/Alojamiento');
const Direccion = require('../models/Direccion');
const Ciudad = require('../models/Ciudad');
const Pais = require('../models/Pais');
const Usuario = require('../models/Usuario'); // si lo necesitas para `anfitrion`

describe('AlojamientoService.buscarAlojamientos', () => {
    beforeAll(async () => {
        await mongoose.connect('mongodb+srv://laucha021:laucha021@birbnbgrupo3.qlh1fjw.mongodb.net/birbnb?retryWrites=true&w=majority&appName=BirbnbGrupo3');
    });

    afterEach(async () => {
        await Promise.all([
            Alojamiento.deleteMany(),
            Direccion.deleteMany(),
            Ciudad.deleteMany(),
            Pais.deleteMany(),
            Usuario.deleteMany()
        ]);
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('debería devolver alojamientos filtrados por ciudad y capacidad', async () => {
        // Crear datos base
        const pais = await Pais.create({ nombre: 'Argentina' });
        const ciudad = await Ciudad.create({ nombre: 'Buenos Aires', pais: pais._id });

        const direccion = await Direccion.create({
            calle: 'Calle Falsa',
            altura: 123,
            ciudad: ciudad._id
        });

        const anfitrion = await Usuario.create({
            nombre: 'Lucho',
            email: 'lucho@example.com',
            rol: 'anfitrion'
        });

        await Alojamiento.create({
            anfitrion: anfitrion._id,
            nombre: 'Depto en Bs As',
            descripcion: 'Cómodo y céntrico',
            precioPorNoche: 100,
            moneda: 'USD',
            direccion: direccion._id,
            cantHuespedesMax: 4,
            caracteristicas: 'WIFI',
            fotos: []
        });

        // Ejecutar búsqueda con filtros
        const resultado = await AlojamientoService.buscarAlojamientos({
            ciudad: ciudad._id.toString(),
            capacidad: 2,
            caracteristicas: 'WIFI',
            minPrecio: 50,
            maxPrecio: 150,
            page: 1,
            limit: 5
        });

        // Validaciones
        expect(resultado.total).toBe(1);
        expect(resultado.resultados.length).toBe(1);
        expect(resultado.resultados[0].nombre).toBe('Depto en Bs As');
        expect(resultado.resultados[0].caracteristicas).toBe('WIFI');
    });

    it('debería devolver 0 si ningún alojamiento cumple los filtros', async () => {
        const pais = await Pais.create({ nombre: 'Uruguay' });
        const ciudad = await Ciudad.create({ nombre: 'Montevideo', pais: pais._id });

        const direccion = await Direccion.create({
            calle: 'Otra calle',
            altura: 456,
            ciudad: ciudad._id
        });

        const anfitrion = await Usuario.create({
            nombre: 'Ana',
            email: 'ana@example.com',
            rol: 'anfitrion'
        });

        await Alojamiento.create({
            anfitrion: anfitrion._id,
            nombre: 'Depto en Montevideo',
            descripcion: 'Frente al mar',
            precioPorNoche: 300,
            moneda: 'USD',
            direccion: direccion._id,
            cantHuespedesMax: 2,
            caracteristicas: 'PISCINA',
            fotos: []
        });

        const resultado = await AlojamientoService.buscarAlojamientos({
            ciudad: ciudad._id.toString(),
            capacidad: 5, // no cumple con cantHuespedesMax
            caracteristicas: 'WIFI', // tampoco cumple
            minPrecio: 50,
            maxPrecio: 200
        });

        expect(resultado.total).toBe(0);
        expect(resultado.resultados.length).toBe(0);
    });
});
