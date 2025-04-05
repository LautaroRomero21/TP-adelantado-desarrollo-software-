const reservaService = require('../services/ReservaService');
const Reserva = require('../models/Reserva');
const Alojamiento = require('../models/Alojamiento');

jest.mock('../models/Reserva');
jest.mock('../models/Alojamiento');

describe('ReservaService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('crearReserva', () => {
        it('debería crear una reserva si hay disponibilidad', async () => {
            const reservaData = {
                alojamientoId: 'alojamiento123',
                huespedId: 'usuario123',
                fechaInicio: new Date('2025-06-10'),
                fechaFin: new Date('2025-06-15'),
            };

            const alojamientoMock = {
                _id: 'alojamiento123',
                reservas: [], // Sin reservas superpuestas
                save: jest.fn().mockResolvedValue(),
            };

            // Mock del findById().populate() que retorna el alojamiento con reservas
            Alojamiento.findById.mockReturnValue({
                populate: jest.fn().mockResolvedValue(alojamientoMock)
            });

            const saveMock = jest.fn().mockResolvedValue();
            const reservaCreada = {
                _id: 'reserva123',
                ...reservaData,
                save: saveMock,
            };

            Reserva.mockImplementation(() => reservaCreada);

            const result = await reservaService.crearReserva(reservaData);

            expect(result._id).toBe('reserva123');
            expect(Reserva).toHaveBeenCalledWith({
                alojamiento: 'alojamiento123',
                huesped: 'usuario123',
                fechaInicio: reservaData.fechaInicio,
                fechaFin: reservaData.fechaFin
            });
            expect(saveMock).toHaveBeenCalled();
            expect(alojamientoMock.save).toHaveBeenCalled();
        });

        it('debería lanzar un error si hay superposición de fechas', async () => {
            const reservaData = {
                alojamientoId: 'alojamiento123',
                huespedId: 'usuario123',
                fechaInicio: new Date('2025-06-10'),
                fechaFin: new Date('2025-06-15'),
            };

            const reservasExistentes = [
                {
                    fechaInicio: new Date('2025-06-12'),
                    fechaFin: new Date('2025-06-20'),
                }
            ];

            const alojamientoMock = {
                _id: 'alojamiento123',
                reservas: reservasExistentes,
            };

            Alojamiento.findById.mockReturnValue({
                populate: jest.fn().mockResolvedValue(alojamientoMock)
            });

            await expect(reservaService.crearReserva(reservaData))
                .rejects
                .toEqual({ status: 400, message: 'El alojamiento no está disponible en esas fechas' });
        });
    });

    describe('cancelarReserva', () => {
        it('debería cancelar una reserva si aún no comenzó', async () => {
            const saveMock = jest.fn().mockResolvedValue();
            const reservaMock = {
                _id: 'reserva123',
                fechaInicio: new Date(Date.now() + 1000000), // futura
                save: saveMock
            };
            Reserva.findById.mockResolvedValue(reservaMock);

            const result = await reservaService.cancelarReserva('reserva123');
            expect(result).toBe('Reserva cancelada exitosamente');
            expect(saveMock).toHaveBeenCalled();
        });

        it('debería lanzar error si la reserva ya empezó', async () => {
            const reservaMock = {
                _id: 'reserva123',
                fechaInicio: new Date(Date.now() - 1000000), // pasada
                save: jest.fn()
            };
            Reserva.findById.mockResolvedValue(reservaMock);

            await expect(reservaService.cancelarReserva('reserva123'))
                .rejects
                .toMatchObject({
                    status: 400,
                    message: 'No se puede cancelar una reserva ya iniciada o pasada'
                });
        });
    });

    describe('historialReservas', () => {
        it('debería devolver todas las reservas de un usuario', async () => {
            const reservasMock = [
                { _id: 'r1', huesped: 'usuario123' },
                { _id: 'r2', huesped: 'usuario123' },
            ];

            Reserva.find.mockReturnValue({
                populate: jest.fn().mockResolvedValue(reservasMock)
            });

            const result = await reservaService.historialReservas('usuario123');
            expect(Reserva.find).toHaveBeenCalledWith({ huesped: 'usuario123' });
            expect(result).toEqual(reservasMock);
        });
    });

});
