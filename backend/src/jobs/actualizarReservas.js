// Archivo: ./src/jobs/actualizarReservas.js
import cron from 'node-cron';
import Reserva from '../models/reserva.model.js';

// Exportación nombrada
export function startActualizarReservasJob() {
  cron.schedule('0 0 * * *', async () => {
    try {
      const hoy = new Date();
      const resultado = await Reserva.updateMany(
        {
          fecha: { $lt: hoy },
          estado: 'activo'
        },
        { $set: { estado: 'finalizado' } }
      );
      console.log(`Reservas actualizadas: ${resultado.modifiedCount}`);
    } catch (error) {
      console.error('Error al actualizar reservas:', error);
    }
  }, {
    scheduled: true,
    timezone: 'America/Santiago' 
  });
}
