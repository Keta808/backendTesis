/* eslint-disable require-jsdoc */
import Disponibilidad from "../models/disponibilidad.model.js";
import { handleError } from "../utils/errorHandler.js";

import UserModels from "../models/user.model.js";
const { Trabajador, Cliente, User } = UserModels;

import Reserva from "../models/reserva.model.js";

import Servicio from "../models/servicio.model.js";

import Enlace from "../models/enlace.model.js";



/**
 * Obtiene la disponibilidad de un trabajador por su id
 * 
 */

async function getDisponibilidadByTrabajador(id) {
    try {
        const disponibilidad = await Disponibilidad.find({ trabajador: id }).exec();
        if (!disponibilidad) return [null, "No hay disponibilidad"];

        return [disponibilidad, null];
    } catch (error) {
        handleError(error, "disponibilidad.service -> getDisponibilidadByTrabajador");
    }
}

/**
 * Crea una nueva disponibilidad en la base de datos teniendo en cuenta las validaciones de: 
 * 
 * 
 */

async function createDisponibilidad(disponibilidadData) {
    try {

        const { trabajador, dia, hora_inicio, hora_fin, excepciones } = disponibilidadData;
        

        //Valida si el trabajador existe
        const trabajadorFound = await Trabajador.findById(trabajador);
        if (!trabajadorFound) return [null, "El trabajador no existe"];

        //Valida si la disponibilidad en ese dia ya existe
        const disponibilidadFound = await Disponibilidad.findOne({ trabajador, dia });
        if (disponibilidadFound) return [null, "La disponibilidad ya existe"];

        const disponibilidad = new Disponibilidad({
            trabajador,
            dia,
            hora_inicio,
            hora_fin,
            excepciones
        });

        await disponibilidad.save();

        return [disponibilidad, null];
    }
    catch (error) {
        handleError(error, "disponibilidad.service -> createDisponibilidad");
    }
}

/**
 * Actualiza la disponibilidad de un trabajador
 * 
 */


async function updateDisponibilidad(id, disponibilidad) {
    try {

        const { dia, hora_inicio, hora_fin, excepciones } = disponibilidad;
       

        const disponibilidadFound = await Disponibilidad.findById(id);
        if (!disponibilidadFound) return [null, "La disponibilidad no existe"];

        disponibilidadFound.dia = dia;
        disponibilidadFound.hora_inicio = hora_inicio;
        disponibilidadFound.hora_fin = hora_fin;
        disponibilidadFound.excepciones = excepciones;

        await disponibilidadFound.save();
        console.log(disponibilidad)
        return [disponibilidadFound, null];
    } catch (error) {
        handleError(error, "disponibilidad.service -> updateDisponibilidad");
    }
}

/**
 * Elimina una disponibilidad de la base de datos por su id
 * 
 */

async function deleteDisponibilidad(id) {
    try {
      const deleted = await Disponibilidad.findByIdAndDelete(id);
      if (!deleted) {
        throw new Error("Disponibilidad no encontrada");
      }
      return [deleted, null];
    } catch (error) {
      handleError(error, "disponibilidad.service -> deleteDisponibilidad");
      return [null, error.message]; // Devuelve el error al controlador
    }
  }
  
// Función para convertir la fecha de formato DD-MM-YYYY a Date
function stringToDateOnly(fecha) {
    const [dia, mes, año] = fecha.split("-");
    return new Date(año, mes - 1, dia); // Retorna solo la fecha, sin la hora
}


// Función para convertir una hora en formato HH:MM a minutos
function timeToMinutes(time) {
    const [hours, minutes] = time.split(':').map(num => parseInt(num, 10));
    return hours * 60 + minutes;
}

// Función para calcular la hora de fin a partir de la hora de inicio y la duración
function calcularHoraFin(horaInicio, duracion) {
    const [hora, minuto] = horaInicio.split(':').map(num => parseInt(num, 10));
    const fechaInicio = new Date();
    fechaInicio.setHours(hora, minuto); // Establecemos la hora de inicio en un objeto Date temporal
    fechaInicio.setMinutes(fechaInicio.getMinutes() + duracion); // Sumamos la duración a la hora de inicio
    return formatTimeToString(fechaInicio);
}

// Función para formatear la hora a string "HH:MM"
function formatTimeToString(time) {
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}


async function getAvailableSlots(workerId, date) {
    try {
        console.log("Fecha de consulta en getAvailableSlots:", date);
        console.log("ID del trabajador en getAvailableSlots:", workerId);
    

        const diasSemana = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
        // Convertir la fecha de consulta (ej.: "2025-02-09") a Date usando UTC
        const parts = date.split("-"); // Divide "YYYY-MM-DD"
        const fechaConsulta = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2])); 
        const diaSemana = diasSemana[fechaConsulta.getUTCDay()];

        console.log("Día de la semana:", diaSemana);
        // Obtener la disponibilidad del trabajador
        const disponibilidad = await Disponibilidad.findOne({ trabajador: workerId, dia: diaSemana });

        if (!disponibilidad) {
            return [null, "El trabajador no tiene disponibilidad en este día"];
        }

        const horaInicioDisponible = disponibilidad.hora_inicio;
        const horaFinDisponible = disponibilidad.hora_fin;

        // Obtener las reservas del trabajador en la fecha consultada
        const reservas = await Reserva.find({ trabajador: workerId, fecha: fechaConsulta, estado: 'Activa' })
            .sort({ "hora_inicio": 1 });

        let slotsDisponibles = [];
        let tiempoLibre = horaInicioDisponible;

        // Recorremos las reservas para calcular los intervalos libres
        for (let i = 0; i < reservas.length; i++) {
            const reserva = reservas[i];
            const horaInicioReserva = new Date(reserva.hora_inicio);
            const horaInicioStr = formatTimeToString(horaInicioReserva);

            // Obtener la duración del servicio asociado
            const duracionReserva = reserva.duracion;
            const horaFinReserva = calcularHoraFin(horaInicioStr, duracionReserva);

            // Verificamos si hay un intervalo libre antes de la reserva
            if (timeToMinutes(tiempoLibre) < timeToMinutes(horaInicioStr)) {
                slotsDisponibles.push({
                    inicio: tiempoLibre,
                    fin: horaInicioStr
                });
            }

            // El próximo intervalo libre será después de la última reserva
            tiempoLibre = horaFinReserva;
        }

        // Si hay tiempo libre después de la última reserva
        if (timeToMinutes(tiempoLibre) < timeToMinutes(horaFinDisponible)) {
            slotsDisponibles.push({
                inicio: tiempoLibre,
                fin: horaFinDisponible
            });
        }

        // Obtener excepciones para la fecha consultada
        const excepciones = disponibilidad.excepciones.map(excepcion => ({
            inicio_no_disponible: excepcion.inicio_no_disponible,
            fin_no_disponible: excepcion.fin_no_disponible
        }));

        console.log("Intervalos disponibles:", slotsDisponibles);
        console.log("Excepciones del día:", excepciones);

        // Retornar los intervalos disponibles junto con las excepciones
        return [{ availableSlots: slotsDisponibles, excepciones }, null];

    } catch (error) {
        console.error("Error al obtener los intervalos disponibles:", error);
        return [null, "Ocurrió un error al calcular los horarios disponibles"];
    }
}


function normalizeString(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}


async function getHorariosDisponiblesMicroEmpresa(serviceId, date) {
    try {
        const diasSemana = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

        // Convertir la fecha de consulta (ej.: "2025-02-09") a Date usando UTC
        const parts = date.split("-"); // Divide "YYYY-MM-DD"
        const fechaConsulta = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2])); 
        const diaSemana = diasSemana[fechaConsulta.getUTCDay()];

        // 1. Obtén el servicio y su duración
        const servicio = await Servicio.findById(serviceId);
        if (!servicio) {
            return [null, "El servicio no existe"];
        }
        const duracionServicio = servicio.duracion;

        // 2. Encuentra los trabajadores de la microempresa
        const trabajadores = await Enlace.find({ 
            id_microempresa: servicio.idMicroempresa, 
            estado: true
        }).populate('id_trabajador');

        if (!trabajadores.length) {
            return [null, "No hay trabajadores activos en esta microempresa"];
        }

        let disponibilidadGlobal = [];

        // 3. Itera sobre cada trabajador
        for (const enlace of trabajadores) {
            const trabajador = enlace.id_trabajador;

            // a) Obtén la disponibilidad del trabajador para el día (por ejemplo, "lunes", "martes", etc.)
            const disponibilidad = await Disponibilidad.findOne({
                trabajador: trabajador._id,
                dia: diaSemana
            });

            // Si no hay disponibilidad para ese día, continúa con el siguiente trabajador
            if (!disponibilidad) continue;

            const horaInicioDisponible = disponibilidad.hora_inicio;
            const horaFinDisponible = disponibilidad.hora_fin;

            // b) Obtén las reservas del trabajador para la fecha consultada
            const reservas = await Reserva.find({
                trabajador: trabajador._id,
                fecha: fechaConsulta,
                estado: 'Activa'
            }).sort({ hora_inicio: 1 });

            // c) Calcular los intervalos disponibles entre las reservas
            let slotsDisponibles = [];
            let tiempoLibre = horaInicioDisponible;

            for (let i = 0; i < reservas.length; i++) {
                const reserva = reservas[i];
                const horaInicioReserva = new Date(reserva.hora_inicio);
                const horaInicioStr = formatTimeToString(horaInicioReserva);
                const horaFinReserva = calcularHoraFin(horaInicioStr, reserva.duracion);

                // Verifica si existe un intervalo libre suficiente antes de la reserva actual
                if (timeToMinutes(horaInicioStr) - timeToMinutes(tiempoLibre) >= duracionServicio) {
                    slotsDisponibles.push({
                        inicio: tiempoLibre,
                        fin: horaInicioStr
                    });
                }

                // Actualiza el tiempo libre a partir del final de la reserva
                tiempoLibre = horaFinReserva;
            }

            // Verifica si hay un intervalo libre suficiente después de la última reserva
            if (timeToMinutes(horaFinDisponible) - timeToMinutes(tiempoLibre) >= duracionServicio) {
                slotsDisponibles.push({
                    inicio: tiempoLibre,
                    fin: horaFinDisponible
                });
            }

            // d) Agrega la disponibilidad del trabajador solo si tiene slots disponibles,
            // incluyendo sus excepciones (o un arreglo vacío en caso de no tener)
            if (slotsDisponibles.length > 0) {
                disponibilidadGlobal.push({
                    trabajador: {
                        id: trabajador._id,
                        nombre: `${trabajador.nombre} ${trabajador.apellido}`
                    },
                    slots: slotsDisponibles,
                    excepciones: disponibilidad.excepciones
                        ? disponibilidad.excepciones.map(excepcion => ({
                            inicio_no_disponible: excepcion.inicio_no_disponible,
                            fin_no_disponible: excepcion.fin_no_disponible
                        }))
                        : []
                });
            }
        }

        // 4. Verifica si se encontró disponibilidad en alguno de los trabajadores
        if (disponibilidadGlobal.length === 0) {
            return [null, "No hay disponibilidad para este servicio en la fecha seleccionada"];
        }
        return [disponibilidadGlobal, null];

    } catch (error) {
        console.error("Error al obtener los horarios disponibles:", error);
        return [null, "Ocurrió un error al calcular los horarios disponibles"];
    }
}


async function getTrabajadoresDisponiblesPorHora(serviceId, date, hora) {
    try {
        // Usa la función para obtener los horarios disponibles
        console.log("Fecha de consulta en getTrabajadoresDisponiblesPorHora:", date);
        console.log("Hora de consulta en getTrabajadoresDisponiblesPorHora:", hora);
        console.log("ID del servicio en getTrabajadoresDisponiblesPorHora:", serviceId);
        
        const [availableSlots, error] = await getHorariosDisponiblesMicroEmpresa(serviceId, date);

        if (error) {
            return [null, error];
        }

        // Convierte la hora proporcionada a minutos
        const horaEnMinutos = timeToMinutes(hora);

        // Filtra los trabajadores disponibles en la hora específica
        const trabajadoresDisponibles = [];
        
        for (const grupo of availableSlots) {
           // for (const trabajador of grupo) {
                const trabajador = grupo;
                //console.log("Trabajador:", trabajador);
                
                const { slots, trabajador: datosTrabajador } = trabajador;
               // console.log("Trabajador:", datosTrabajador);
               // console.log("Slots:", slots);
                // Verifica si la hora cae dentro de algún intervalo
                const estaDisponible = slots.some(slot => {
                    const inicio = timeToMinutes(slot.inicio);
                    const fin = timeToMinutes(slot.fin);
                    return horaEnMinutos >= inicio && horaEnMinutos < fin; // Hora debe estar dentro del intervalo
                });

                // Si está disponible, agrega al trabajador a la lista
                if (estaDisponible) {
                    trabajadoresDisponibles.push({
                        id: datosTrabajador.id,
                        nombre: datosTrabajador.nombre
                    });
                }
            //}
        }

        return [trabajadoresDisponibles, null];

    } catch (error) {
        console.error("Error en getTrabajadoresDisponiblesPorHora:", error);
        return [null, "Ocurrió un error al procesar la disponibilidad de trabajadores."];
    }
}


// funcion para obtener los dias en los que no tiene horario un trabajador

async function getDiasSinHorario(trabajadorId) {
    try {
        const diasSemana = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
        const diasTrabajador = await Disponibilidad.find({ trabajador: trabajadorId }).select('dia').exec();
        const diasOcupados = diasTrabajador.map(dia => dia.dia);
        const diasLibres = diasSemana.filter(dia => !diasOcupados.includes(dia));
        return [diasLibres, null];
    } catch (error) {
        handleError(error, "disponibilidad.service -> getDiasSinHorario");
    }
}

export default { 
    getDisponibilidadByTrabajador, 
    createDisponibilidad, 
    updateDisponibilidad,
    deleteDisponibilidad,
    getAvailableSlots,
    getHorariosDisponiblesMicroEmpresa,
    getTrabajadoresDisponiblesPorHora,
    getDiasSinHorario,

};