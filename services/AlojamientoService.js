const Alojamiento = require('../models/Alojamiento');
const Direccion = require('../models/Direccion'); // para población si es necesario

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

    // Precio
    if (minPrecio || maxPrecio) {
        filtro.precioPorNoche = {};
        if (minPrecio) filtro.precioPorNoche.$gte = Number(minPrecio);
        if (maxPrecio) filtro.precioPorNoche.$lte = Number(maxPrecio);
    }

    // Capacidad
    if (capacidad) {
        filtro.cantHuespedesMax = { $gte: Number(capacidad) };
    }

    // Características
    if (caracteristicas) {
        const arrayCaracteristicas = caracteristicas.split(',');
        filtro.caracteristicas = { $all: arrayCaracteristicas };
    }

    // Filtro por ubicación en Direccion
    if (ciudad || pais) {
        const direcciones = await Direccion.find({
            ...(ciudad && { ciudad }),
            ...(pais && { pais })
        }).select('_id');
        const idsDireccion = direcciones.map(dir => dir._id);
        filtro.direccion = { $in: idsDireccion };
    }

    const resultados = await Alojamiento.find(filtro)
        .populate('direccion') // opcional
        .populate('anfitrion', 'nombre apellido') // opcional
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
