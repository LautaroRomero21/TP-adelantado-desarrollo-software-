const notificacionService = require('../services/NotificacionService');
const Notificacion = require('../models/Notificacion');

jest.mock('../models/Notificacion');

describe('NotificacionService', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getNotificaciones', () => {
        it('debería obtener notificaciones no leídas de un usuario', async () => {
            const usuarioId = 'user123';
            const notificacionesMock = [{ mensaje: 'Hola', leida: false }];

            Notificacion.find.mockResolvedValue(notificacionesMock);

            const resultado = await notificacionService.getNotificaciones(usuarioId, false);

            expect(Notificacion.find).toHaveBeenCalledWith({ usuario: usuarioId, leida: false });
            expect(resultado).toEqual(notificacionesMock);
        });

        it('debería obtener notificaciones leídas de un usuario', async () => {
            const usuarioId = 'user123';
            const notificacionesMock = [{ mensaje: 'Adiós', leida: true }];

            Notificacion.find.mockResolvedValue(notificacionesMock);

            const resultado = await notificacionService.getNotificaciones(usuarioId, true);

            expect(Notificacion.find).toHaveBeenCalledWith({ usuario: usuarioId, leida: true });
            expect(resultado).toEqual(notificacionesMock);
        });
    });

    describe('marcarComoLeida', () => {
        it('debería marcar una notificación como leída', async () => {
            const notificacionId = 'notif123';
            const notificacionMock = {
                _id: notificacionId,
                mensaje: 'Nueva reserva',
                leida: false,
                marcarComoLeida: jest.fn().mockResolvedValue(true)
            };

            Notificacion.findById.mockResolvedValue(notificacionMock);

            const resultado = await notificacionService.marcarComoLeida(notificacionId);

            expect(Notificacion.findById).toHaveBeenCalledWith(notificacionId);
            expect(notificacionMock.marcarComoLeida).toHaveBeenCalled();
            expect(resultado).toEqual(notificacionMock);
        });

        it('debería lanzar error si la notificación no existe', async () => {
            Notificacion.findById.mockResolvedValue(null);

            await expect(notificacionService.marcarComoLeida('noexiste'))
                .rejects.toEqual({ status: 404, message: 'Notificación no encontrada' });
        });
    });

});
