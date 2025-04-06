const Alojamiento = require('../models/Alojamiento');
const Direccion = require('../models/Direccion');
const Ciudad = require('../models/Ciudad');
const Pais = require('../models/Pais'); // Asegúrate de tener el modelo de Pais

const buscarAlojamientos = async (query) => {
    const {
        ciudad,
        pais,
        minPrecio,
        maxPrecio,
        capacidad,
        caracteristicas,
        page = 1,
        limit = 10
    } = query;

    const filtro = {};

    // Filtro de Precio
    if (minPrecio || maxPrecio) {
        filtro.precioPorNoche = {};
        if (minPrecio) filtro.precioPorNoche.$gte = Number(minPrecio);
        if (maxPrecio) filtro.precioPorNoche.$lte = Number(maxPrecio);
    }

    // Filtro de Capacidad
    if (capacidad) {
        filtro.cantHuespedesMax = { $gte: Number(capacidad) };
    }

    // Filtro de Características
    if (caracteristicas) {
        const arrayCaracteristicas = caracteristicas.split(',').map(caracteristica => caracteristica.trim());
        filtro.caracteristicas = { $all: arrayCaracteristicas };
    }

    // Filtro por Ubicación (Ciudad, País)
    if (ciudad || pais) {
        let ciudadId;

        // Si se pasa la ciudad, buscamos el ObjectId de la ciudad
        if (ciudad) {
            const ciudadEncontrada = await Ciudad.findOne({ nombre: ciudad }).populate('pais');
            if (ciudadEncontrada) {
                ciudadId = ciudadEncontrada._id;
            } else {
                throw new Error("Ciudad no encontrada");
            }
        }

        // Si se pasa el país, buscamos todas las ciudades del país
        if (pais) {
            const paisEncontrado = await Pais.findOne({ nombre: pais });
            if (!paisEncontrado) {
                throw new Error("País no encontrado");
            }

            // Si no se pasó la ciudad, buscamos todas las ciudades de ese país
            if (!ciudadId) {
                const ciudadesDelPais = await Ciudad.find({ pais: paisEncontrado._id }).select('_id');
                const idsCiudad = ciudadesDelPais.map(ciudad => ciudad._id);
                // Si se pasa solo el país, filtramos las direcciones asociadas a esas ciudades
                const direcciones = await Direccion.find({ ciudad: { $in: idsCiudad } }).select('_id');
                if (direcciones.length === 0) {
                    throw new Error("No se encontraron direcciones para el país especificado.");
                }
                const idsDireccion = direcciones.map(dir => dir._id);
                filtro.direccion = { $in: idsDireccion };
            }
        }

        // Si se pasó una ciudad, filtramos por las direcciones de esa ciudad
        if (ciudadId) {
            const direcciones = await Direccion.find({ ciudad: ciudadId }).select('_id');
            if (direcciones.length === 0) {
                throw new Error("No se encontraron direcciones para la ciudad.");
            }
            const idsDireccion = direcciones.map(dir => dir._id);
            filtro.direccion = { $in: idsDireccion };
        }
    }

    // Búsqueda de Alojamientos con los filtros aplicados
    const resultados = await Alojamiento.find(filtro)
        .populate('direccion') // opcional, para traer la información de la dirección
        .populate('anfitrion', 'nombre apellido') // opcional, para traer información del anfitrión
        .skip((page - 1) * limit)
        .limit(Number(limit));

    const total = await Alojamiento.countDocuments(filtro);

    return {
        total,
        page: Number(page),
        limit: Number(limit),
        resultados
    };
};

module.exports = {
    buscarAlojamientos
};
