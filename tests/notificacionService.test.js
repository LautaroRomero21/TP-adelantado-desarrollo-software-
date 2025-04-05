const Notificacion = require('../models/Notificacion');
const notificacionService = require('../services/NotificacionService');

// Mock de Notificacion
jest.mock('../models/Notificacion');

describe('NotificacionService', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getNotificaciones', () => {
        it('debería devolver las notificaciones no leídas de un usuario', async () => {
            const usuarioId = 'usuario123';
            const mockData = [{ mensaje: 'Noti 1' }, { mensaje: 'Noti 2' }];
            Notificacion.find.mockResolvedValue(mockData);

            const result = await notificacionService.getNotificaciones(usuarioId, false);

            expect(Notificacion.find).toHaveBeenCalledWith({ usuario: usuarioId, leida: false });
            expect(result).toEqual(mockData);
        });
    });

    describe('marcarComoLeida', () => {
        it('debería marcar una notificación como leída si existe', async () => {
            const mockId = 'noti123';
            const mockNoti = { marcarComoLeida: jest.fn(), _id: mockId };
            Notificacion.findById.mockResolvedValue(mockNoti);

            const result = await notificacionService.marcarComoLeida(mockId);

            expect(Notificacion.findById).toHaveBeenCalledWith(mockId);
            expect(mockNoti.marcarComoLeida).toHaveBeenCalled();
            expect(result).toEqual(mockNoti);
        });

        it('debería lanzar error si la notificación no existe', async () => {
            Notificacion.findById.mockResolvedValue(null);

            await expect(notificacionService.marcarComoLeida('noexiste')).rejects.toEqual({
                status: 404,
                message: 'Notificación no encontrada'
            });
        });
    });
});
