// Convierte una hora en formato "HH:mm" a minutos totales
export function timeToMinutes(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }
  
  // Convierte minutos totales a formato "HH:mm"
  export function minutesToTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }
  
  // Calcula la hora de finalización sumando una duración en minutos a una hora de inicio
  export function calcularHoraFin(startTime, duration) {
    const totalMinutes = timeToMinutes(startTime) + duration;
    return minutesToTime(totalMinutes);
  }
  