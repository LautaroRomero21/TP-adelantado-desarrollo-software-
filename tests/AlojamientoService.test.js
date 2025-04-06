const AlojamientoService = require('../services/AlojamientoService');
const Alojamiento = require('../models/Alojamiento');
const Direccion = require('../models/Direccion');
const Ciudad = require('../models/Ciudad');
const Pais = require('../models/Pais');

// Limpia todos los mocks antes de cada test
jest.mock('../models/Alojamiento');
jest.mock('../models/Direccion');
jest.mock('../models/Ciudad');
jest.mock('../models/Pais');

describe('AlojamientoService.buscarAlojamientos', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('debería devolver alojamientos con filtro básico de precio y capacidad', async () => {
        Alojamiento.find.mockReturnValue({
            populate: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockResolvedValue([]),
        });
        Alojamiento.countDocuments.mockResolvedValue(0);

        const result = await AlojamientoService.buscarAlojamientos({
            minPrecio: 100,
            maxPrecio: 200,
            capacidad: 4
        });

        expect(result.total).toBe(0);
        expect(result.resultados).toEqual([]);
    });

    it('debería aplicar filtro por ciudad', async () => {
        const mockCiudad = { _id: 'ciudad123' };
        const mockDirecciones = [{ _id: 'dir1' }, { _id: 'dir2' }];

        // Mock de Ciudad.findOne().populate()
        Ciudad.findOne.mockReturnValue({
            populate: jest.fn().mockResolvedValue(mockCiudad)
        });

        // Mock de Direccion.find().select()
        Direccion.find.mockReturnValue({
            select: jest.fn().mockReturnValue(mockDirecciones)
        });

        // Mock de Alojamiento.find().populate().skip().limit()
        Alojamiento.find.mockReturnValue({
            populate: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockResolvedValue([]),
        });

        Alojamiento.countDocuments.mockResolvedValue(0);

        const result = await AlojamientoService.buscarAlojamientos({ ciudad: 'Buenos Aires' });

        expect(Ciudad.findOne).toHaveBeenCalledWith({ nombre: 'Buenos Aires' });
        expect(Direccion.find).toHaveBeenCalledWith({ ciudad: mockCiudad._id });
        expect(result.total).toBe(0);
        expect(result.resultados).toEqual([]);
    });


    it('debería lanzar error si no encuentra la ciudad', async () => {
        Ciudad.findOne.mockReturnValue({
            populate: jest.fn().mockResolvedValue(null)
        });

        await expect(
            AlojamientoService.buscarAlojamientos({ ciudad: 'Atlantis' })
        ).rejects.toThrow('Ciudad no encontrada');
    });

    it('debería lanzar error si no encuentra el país', async () => {
        Pais.findOne.mockResolvedValue(null);

        await expect(
            AlojamientoService.buscarAlojamientos({ pais: 'Narnia' })
        ).rejects.toThrow('País no encontrado');
    });
});
