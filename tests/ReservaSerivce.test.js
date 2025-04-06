const reservaService = require('../services/ReservaService');
const Reserva = require('../models/Reserva');
const Alojamiento = require('../models/Alojamiento');

jest.mock('../models/Reserva');
jest.mock('../models/Alojamiento');
jest.mock('../models/CambioEstadoReserva');
jest.mock('../models/FactoryNotificacion', () => ({
    prototype: {
        crearNotificacionReservaConfirmada: jest.fn(() => ({ save: jest.fn() })),
        crearNotificacionReservaCancelada: jest.fn(() => ({ save: jest.fn() }))
    }
}));

describe('ReservaService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('crearReserva', () => {
        it('debería lanzar error si las fechas son inválidas', async () => {
            await expect(reservaService.crearReserva({
                alojamientoId: '123',
                huespedId: '456',
                fechaInicio: 'invalida',
                fechaFin: '2025-05-10'
            })).rejects.toEqual(expect.objectContaining({ message: 'Fechas inválidas' }));
        });

        it('debería lanzar error si el alojamiento no existe', async () => {
            Alojamiento.findById.mockResolvedValue(null);

            await expect(reservaService.crearReserva({
                alojamientoId: '123',
                huespedId: '456',
                fechaInicio: '2025-05-01',
                fechaFin: '2025-05-10'
            })).rejects.toEqual(expect.objectContaining({ message: 'Alojamiento no encontrado' }));
        });

        it('debería lanzar error si hay conflicto de fechas', async () => {
            Alojamiento.findById.mockResolvedValue({ reservas: [] });
            Reserva.find.mockResolvedValue([{}]);

            await expect(reservaService.crearReserva({
                alojamientoId: '123',
                huespedId: '456',
                fechaInicio: '2025-05-01',
                fechaFin: '2025-05-10'
            })).rejects.toEqual(expect.objectContaining({ message: 'El alojamiento no está disponible en esas fechas' }));
        });

        it('debería crear una reserva correctamente', async () => {
            const saveMock = jest.fn();
            const alojamientoMock = { reservas: [], save: jest.fn() };

            Alojamiento.findById.mockResolvedValue(alojamientoMock);
            Reserva.find.mockResolvedValue([]);
            Reserva.mockImplementation(() => ({ save: saveMock, _id: 'res123' }));

            const result = await reservaService.crearReserva({
                alojamientoId: '123',
                huespedId: '456',
                fechaInicio: '2025-05-01',
                fechaFin: '2025-05-10'
            });

            expect(saveMock).toHaveBeenCalled();
            expect(result).toHaveProperty('_id', 'res123');
        });
    });

    describe('aceptarReserva', () => {
        it('debería lanzar error si falta el ID', async () => {
            await expect(reservaService.aceptarReserva(null))
                .rejects.toEqual(expect.objectContaining({ message: 'Faltan datos obligatorios para aceptar la reserva' }));
        });

        it('debería lanzar error si la reserva no existe', async () => {
            Reserva.findById.mockReturnValue({
                populate: jest.fn().mockReturnValueOnce({
                    populate: jest.fn().mockResolvedValue(null)
                })
            });

            await expect(reservaService.aceptarReserva('res123'))
                .rejects.toEqual(expect.objectContaining({ message: 'Reserva no encontrada' }));
        });

        it('debería aceptar una reserva correctamente', async () => {
            const saveMock = jest.fn();
            const reservaMock = {
                huesped: { nombre: 'Juan' },
                alojamiento: { nombre: 'Casa Linda' },
                fechaInicio: new Date('2025-05-01'),
                fechaFin: new Date('2025-05-10'),
                cambiarEstado: jest.fn(),
                save: saveMock,
                _id: 'res123'
            };

            Reserva.findById.mockReturnValue({
                populate: jest.fn().mockReturnValueOnce({
                    populate: jest.fn().mockResolvedValue(reservaMock)
                })
            });

            const mensaje = await reservaService.aceptarReserva('res123');

            expect(reservaMock.cambiarEstado).toHaveBeenCalledWith('confirmada');
            expect(saveMock).toHaveBeenCalled();
            expect(mensaje).toBe('Reserva confirmada exitosamente');
        });
    });
});
