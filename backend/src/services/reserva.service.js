/* eslint-disable quotes */
/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
import Reserva from '../models/reserva.model.js'; 
import { handleError } from "../utils/errorHandler.js"; 


import UserModels from "../models/user.model.js";
const { Trabajador, Cliente, User } = UserModels;
import Horario from "../models/horario.model.js";
import Enlace from "../models/enlace.model.js"; 
import Servicio from "../models/servicio.model.js";


import  dotenv from "dotenv";   
import nodemailer from "nodemailer";    
import moment from "moment";    

dotenv.config(); // Cargar variables de entorno

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});


/*
Obtiene todas las reservas de la base de datos 
*/

async function getReservas() {
    try {
        const reservas = await Reserva.find()
            .populate('cliente')
            .populate('trabajador')
            .populate('servicio')
            .exec();
        if (!reservas) return [null, "No hay reservas"];

        return [reservas, null];
    } catch (error) {
        handleError(error, "reserva.service -> getReservas");
    }
}

/*
Obtiene todas las reservas de la base de datos por id del trabajador
*/

async function getReservasByTrabajador(id) {
    try {
      const reservas = await Reserva.find({ trabajador: id, estado: { $ne: 'Cancelada' } })
        .populate('cliente', 'nombre email')
        .populate('servicio', 'nombre')
        .exec();
          
      if (!reservas || reservas.length === 0) return [null, "No hay reservas"];
      console.log("reservas", reservas);
      return [reservas, null];
    } catch (error) {
      handleError(error, "reserva.service -> getReservasByTrabajador");
      return [null, "Error interno"];
    }
  }
  


/**
 * Crea una nueva reserva en la base de datos teniendo en cuenta las validaciones de: 
 *
 * 
 */

const diasSemana = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

function stringToDate(hora, fecha) {
    // hora viene en formato HH:MM
    // fecha viene en formato YYYY-MM-DD
    const [horaStr, minutoStr] = hora.split(':');
    // Interpreta [ year, month, day ] en lugar de [ day, month, year ]
    const [year, month, day] = fecha.split("-");
    // month - 1 porque los meses en JS van de 0 a 11
    return new Date(year, month - 1, day, horaStr, minutoStr);
  }
  // Función para convertir la fecha de formato YYYY-MM-DD a Date (sin hora)
  function stringToDateOnly(fecha) {
    const [year, month, day] = fecha.split("-");
    return new Date(year, month - 1, day);
  }

async function createReserva(reserva) {
    try {

        console.log("reserva service", reserva);
        const { hora_inicio, fecha, cliente, trabajador, servicio, estado } = reserva;
        console.log("hora_inicio", hora_inicio);
        console.log("fecha", fecha);
        console.log("cliente", cliente);
        console.log("trabajador", trabajador);
        console.log("servicio", servicio);
        console.log("estado", estado);

        // Validar formato de la hora de inicio
        const horaInicio = hora_inicio.split(':');
        if (horaInicio.length !== 2) return [null, "La hora de inicio no es válida"];

        // Validar existencia de trabajador y cliente
        const trabajadorFound = await Trabajador.findById(trabajador);
        if (!trabajadorFound) return [null, "El trabajador no existe"];
        const clienteFound = await Cliente.findById(cliente);
        if (!clienteFound) return [null, "El cliente no existe"];


        //Validar si no tiene mas de 2 reservas con la misma microempresa
        const reservasFound = await Reserva.find({ cliente: cliente, estado: 'Activa' });   
        if (reservasFound.length >= 2) return [null, "El cliente ya tiene 2 reservas activas"];

        // Convertir fecha y hora a objetos Date
        const fechaReserva = stringToDateOnly(fecha); // Convertir DD-MM-YYYY a Date
        const horaInicioDate = stringToDate(hora_inicio, fecha); // Convertir HH:MM con fecha a Date

        // Validar existencia del servicio y calcular duración
        const servicioFound = await Servicio.findById(servicio);
        if (!servicioFound) return [null, "El servicio no existe"];
        const duracion = servicioFound.duracion;
        const horaFin = new Date(horaInicioDate);
        horaFin.setMinutes(horaFin.getMinutes() + duracion);

        // Obtener día de la semana
        const diaSemana = diasSemana[fechaReserva.getDay()];

        // Verificar disponibilidad del trabajador en el día
        const disponibilidad = await Disponibilidad.findOne({ trabajador: trabajador, dia: diaSemana });
        if (!disponibilidad) return [null, "El trabajador no está disponible en este día"];

        console.log("disponibilidad en servicio xd", disponibilidad);
        // Rango de disponibilidad
        const [inicioDisponible, finDisponible] = [
            new Date(`${fechaReserva.toDateString()} ${disponibilidad.hora_inicio}`),
            new Date(`${fechaReserva.toDateString()} ${disponibilidad.hora_fin}`)
        ];

        // Validar que la hora de inicio esté dentro del rango disponible
        if (horaInicioDate < inicioDisponible || horaInicioDate >= finDisponible) {
            return [null, "La hora ingresada está fuera del rango de disponibilidad del trabajador"];
        }
        //console.log("validacion que la hora de inicio este dentro del rango disponibble", (horaInicioDate < inicioDisponible || horaInicioDate >= finDisponible));

        // Validar contra excepciones
        const excepciones = disponibilidad.excepciones;      
        if (excepciones && excepciones.length > 0) {
            for (let excepcion of excepciones) {
                const excepcionInicio = new Date(`${fechaReserva.toDateString()} ${excepcion.inicio_no_disponible}`);
                const excepcionFin = new Date(`${fechaReserva.toDateString()} ${excepcion.fin_no_disponible}`);

                if (
                    (horaInicioDate >= excepcionInicio && horaInicioDate < excepcionFin) ||
                    (horaFin > excepcionInicio && horaFin <= excepcionFin) ||
                    (horaInicioDate <= excepcionInicio && horaFin >= excepcionFin)
                ) {
                   
                    return [null, "La hora ingresada choca con las excepciones del trabajador"];
                } 

            }
        }

        // Validar que no exista una reserva que choque en horario
        const reservas = await Reserva.find({ trabajador, fecha: fechaReserva, estado:'Activa'});
        console.log("reservas ENCONTRADAS PARA QUE?", reservas);

        for (let reservaExistente of reservas) {
            const horaInicioReserva = new Date(reservaExistente.hora_inicio);
            const horaFinReserva = new Date(horaInicioReserva);
            horaFinReserva.setMinutes(horaFinReserva.getMinutes() + reservaExistente.duracion);
            console.log(" 1 -",(horaInicioDate >= horaInicioReserva && horaInicioDate < horaFinReserva));
            console.log(" 2 -",(horaFin > horaInicioReserva && horaFin <= horaFinReserva));
            console.log(" 3 -",(horaInicioDate <= horaInicioReserva && horaFin >= horaFinReserva));
            if (
                (horaInicioDate >= horaInicioReserva && horaInicioDate < horaFinReserva) ||
                (horaFin > horaInicioReserva && horaFin <= horaFinReserva) ||
                (horaInicioDate <= horaInicioReserva && horaFin >= horaFinReserva)
            ) {
                return [null, "Ya existe una reserva que choca con este horario"];
            }
        }

        // Crear la nueva reserva
        const newReserva = new Reserva({
            hora_inicio: horaInicioDate,
            fecha: fechaReserva,
            cliente,
            trabajador,
            servicio,
            duracion,
            estado
        });

        await newReserva.save();
        return [newReserva, null];
    } catch (error) {
        handleError(error, "reserva.service -> createReserva");
        return [null, "Ocurrió un error al crear la reserva"];
    }
}


/**
 * Elimina una reserva de la base de datos por su id
 * 
 */

async function deleteReserva(id) {
    try {
        
        const reserva = await Reserva.findByIdAndDelete(id);
        return [reserva, null];
    } catch (error) {
        handleError(error, "reserva.service -> deleteReserva");
        return [null, error.message];
    }
}


/**
 * Cambia el estado de la reserva
 * 
 */

async function updateReserva(id, estado) {
    try {
        return await Reserva.findByIdAndUpdate(id
            , { estado }
            , { new: true });
    }
    catch (error) {
        handleError(error, "reserva.service -> updateReserva");
    }

}

async function cancelReservaCliente(id) {   
    try {
        // Actualiza la reserva y cambia su estado a "Cancelada"
        const reserva = await Reserva.findByIdAndUpdate(
            id,
            { estado: 'Cancelada' },
            { new: true, runValidators: true }
        ).populate('cliente').populate('trabajador');

        // Si no se encuentra la reserva, devuelve un error
        if (!reserva) {
            return [null, 'Reserva no encontrada'];
        }   
        const nombreTrabajador = reserva.trabajador.nombre;
        // Se crea explícitamente un objeto Date para asegurar un parseo correcto
        const horaInicio = moment(new Date(reserva.hora_inicio)).format('HH:mm');
        const fechaFormateada = moment(new Date(reserva.fecha)).format('DD/MM/YYYY');

    
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: reserva.trabajador.email,
            subject: "Reserva cancelada",   
            text: `Estimado/a ${nombreTrabajador},

Le informamos que la reserva programada con el cliente ${reserva.cliente.nombre} para el día ${fechaFormateada} a las ${horaInicio} horas ha sido cancelada.
Si desea modificar su horario, realice los cambios necesarios en la pestaña Horario de la App.

Atentamente,
El equipo de Reserbio`,
        });
        // Devuelve la reserva actualizada y un error nulo
        return [reserva, null];
            } catch (error) {
                console.error('Error en cancelReserva:', error.message || error);
                return [null, error.message];
            }
        }


/**
 * Cambia el estado de una reserva a Cancelado
 * 
 */
async function cancelReserva(id) {
    try {
        // Actualiza la reserva y cambia su estado a "Cancelada"
        const reserva = await Reserva.findByIdAndUpdate(
            id,
            { estado: 'Cancelada' },
            { new: true, runValidators: true }
        ).populate('cliente').populate('trabajador');

        // Si no se encuentra la reserva, devuelve un error
        if (!reserva) {
            return [null, 'Reserva no encontrada'];
        }

        const emailCliente = reserva.cliente.email;
        const nombreTrabajador = reserva.trabajador.nombre;
        // Se crea explícitamente un objeto Date para asegurar un parseo correcto
        const horaInicio = moment(new Date(reserva.hora_inicio)).format('HH:mm');
        const fechaFormateada = moment(new Date(reserva.fecha)).format('DD/MM/YYYY');

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: emailCliente,
            subject: "Reserva cancelada",
            text: `Estimado/a cliente,
Le informamos que su reserva programada con ${nombreTrabajador} para el día ${fechaFormateada} a las ${horaInicio} horas ha sido cancelada.          
            
Atentamente,
El equipo de Reserbio`,
        });


        // Devuelve la reserva actualizada y un error nulo
        return [reserva, null];
    } catch (error) {
        console.error('Error en cancelReserva:', error.message || error);
      return [null, error.message];
    }
}



//get reservas cliente

async function getReservasByCliente(id) {
    try {
        console.log("id en servicio", id);

        const ahora = new Date();

        // Buscar reservas activas del cliente para verificar cuáles deben finalizarse
        const reservasActivas = await Reserva.find({ cliente: id, estado: "Activa" });

        let reservasFinalizadas = [];
        for (let reserva of reservasActivas) {
            const horaInicio = new Date(reserva.hora_inicio);
            const horaFin = new Date(horaInicio.getTime() + reserva.duracion * 60000); // Sumar duración en minutos

            // Si la hora de finalización de la reserva ya pasó, actualizar estado
            if (horaFin < ahora) {
                await Reserva.findByIdAndUpdate(reserva._id, { estado: "Finalizada" });
                reserva.estado = "Finalizada"; // Actualizar en la respuesta también
                reservasFinalizadas.push(reserva._id);
            }
        }

        console.log(`Reservas finalizadas automáticamente: ${reservasFinalizadas.length}`);

        // Buscar y devolver todas las reservas actualizadas del cliente
        const reservas = await Reserva.find({ cliente: id })
            .select("hora_inicio fecha estado trabajador servicio duracion") // Solo los campos necesarios
            .populate({
                path: "trabajador",
                select: "nombre apellido",
            })
            .populate({
                path: "servicio",
                select: "nombre",
            })
            .exec();

        if (!reservas || reservas.length === 0) return [null, "No hay reservas"];

        return [reservas, null];
    } catch (error) {
        handleError(error, "reserva.service -> getReservasByCliente");
    }
}


// actualiza las reservas a finalizada
async function finalizarReserva(id) {
    try {
        // Actualiza la reserva y cambia su estado a "Finalizada"
        const reserva = await Reserva.findByIdAndUpdate
            (id,
                { estado: 'Finalizada' },
                { new: true, runValidators: true }
            );

        // Si no se encuentra la reserva, devuelve un error
        if (!reserva) {
            return [null, 'Reserva no encontrada'];
        }

        // Devuelve la reserva actualizada y un error nulo
        return [reserva, null];
    }
    catch (error) {
        console.error('Error en finalizarReserva:', error.message || error);
        return [null, error.message];
    }
}

// Una función auxiliar para formatear la hora a "HH:mm"
function formatHora(date) {
    // Asegúrate de que 'date' es un objeto Date
    const horas = date.getHours().toString().padStart(2, '0');
    const minutos = date.getMinutes().toString().padStart(2, '0');
    return `${horas}:${minutos}`;
  }
  
  function formatFecha(date) {
    // Devuelve la fecha en formato "YYYY-MM-DD"
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  
/**
 * Obtiene las reservas activas para un trabajador en una fecha determinada.
 * @param {string} workerId - ID del trabajador.
 * @param {string} date - Fecha en formato "YYYY-MM-DD".
 * @returns {[Array, null] | [null, string]} Retorna un array de reservas o un mensaje de error.
 */
async function getReservasPorFechaTrabajador(workerId, date) {
    try {
      const fechaConsulta = stringToDateOnly(date); // Asegúrate de que esta función convierta "YYYY-MM-DD" a un Date correcto
      const reservas = await Reserva.find({
        trabajador: workerId,
        fecha: fechaConsulta,
        estado: 'Activa'
      }).sort({ hora_inicio: 1 });
  
      // Formatear cada reserva para que solo se envíen los datos necesarios
      const reservasFormateadas = reservas.map(reserva => ({
        _id: reserva._id,
        cliente: reserva.cliente,
        duracion: reserva.duracion,
        estado: reserva.estado,
        fecha: formatFecha(new Date(reserva.fecha)),
        hora_inicio: formatHora(new Date(reserva.hora_inicio)),
        servicio: reserva.servicio,
        trabajador: reserva.trabajador
      }));
  
      //console.log("reservas en servicio backend getReservasPorFechaTrabajador", reservasFormateadas);
      return { reservas: reservasFormateadas };
    } catch (error) {
      console.error("Error al obtener reservas para el trabajador:", error);
      return { error: "Ocurrió un error al obtener las reservas para el trabajador." };
    }
  }
/**
 * Obtiene las reservas activas para una microempresa (basado en el serviceId) en una fecha determinada.
 * Se asume que el serviceId permite obtener el servicio y, a partir de él, la microempresa.
 * @param {string} serviceId - ID del servicio.
 * @param {string} date - Fecha en formato "YYYY-MM-DD".
 * @returns {[Array, null] | [null, string]} Retorna un array de reservas o un mensaje de error.
 */
async function getReservasPorFechaMicroempresa(serviceId, date) {
    try {
      const fechaConsulta = stringToDateOnly(date);
      const servicio = await Servicio.findById(serviceId);
      if (!servicio) {
        return { error: "El servicio no existe" };
      }
      const trabajadores = await Enlace.find({
        id_microempresa: servicio.idMicroempresa,
        estado: true
      }).populate('id_trabajador');
  
      if (!trabajadores.length) {
        return { error: "No hay trabajadores activos en esta microempresa" };
      }
  
      const workerIds = trabajadores.map(enlace => enlace.id_trabajador._id);
      const reservas = await Reserva.find({
        trabajador: { $in: workerIds },
        fecha: fechaConsulta,
        estado: 'Activa'
      }).sort({ hora_inicio: 1 });
  
      const reservasFormateadas = reservas.map(reserva => ({
        _id: reserva._id,
        cliente: reserva.cliente,
        duracion: reserva.duracion,
        estado: reserva.estado,
        fecha: formatFecha(new Date(reserva.fecha)),
        hora_inicio: formatHora(new Date(reserva.hora_inicio)),
        servicio: reserva.servicio,
        trabajador: reserva.trabajador
      }));
      console.log("reservas en servicio backend getReservasPorFechaMicroempresa", reservasFormateadas);
  
      return { reservas: reservasFormateadas };
    } catch (error) {
      console.error("Error al obtener reservas para la microempresa:", error);
      return { error: "Ocurrió un error al obtener las reservas para la microempresa." };
    }
  }


  async function createReservaHorario(reserva) {
    try {
        console.log("reserva service", reserva);
        const { hora_inicio, fecha, cliente, trabajador, servicio, estado } = reserva;

        // Validar existencia de trabajador y cliente
        const trabajadorFound = await Trabajador.findById(trabajador);
        if (!trabajadorFound) return [null, "El trabajador no existe"];

        const clienteFound = await Cliente.findById(cliente);
        if (!clienteFound) return [null, "El cliente no existe"];

        // Validar existencia del servicio y obtener duración
        const servicioFound = await Servicio.findById(servicio);
        if (!servicioFound) return [null, "El servicio no existe"];
        const duracion = servicioFound.duracion;

        // VALIDACIÓN: contar solo reservas activas de este cliente para la microempresa correspondiente
        // Se asume que la función getActiveReservationCount ya está implementada en este módulo o importada
        const [activeCount, countError] = await getActiveReservationCount(
            cliente, 
            servicioFound.idMicroempresa.toString()
        );
        if (activeCount >= 1) {
            return [null, "El cliente ya tiene una reserva activa en esta microempresa"];
        }

        // Convertir fecha y hora a Date
        const fechaReserva = stringToDateOnly(fecha); // Convierte DD-MM-YYYY a Date
        const horaInicioDate = stringToDate(hora_inicio, fecha); // Convierte HH:MM con fecha a Date
        const horaFin = new Date(horaInicioDate);
        horaFin.setMinutes(horaFin.getMinutes() + duracion);

        // Verificar disponibilidad por bloques de horario
        const diaSemana = diasSemana[fechaReserva.getDay()]; // Ej.: 'miércoles'
        const horario = await Horario.findOne({ trabajador, dia: diaSemana });

        if (!horario || horario.bloques.length === 0) {
            return [null, "El trabajador no tiene bloques disponibles para este día"];
        }

        // Verificar si algún bloque cubre la duración del servicio
        let bloqueDisponible = horario.bloques.some(bloque => {
            const bloqueInicio = new Date(`${fechaReserva.toDateString()} ${bloque.hora_inicio}`);
            const bloqueFin = new Date(`${fechaReserva.toDateString()} ${bloque.hora_fin}`);
            return horaInicioDate >= bloqueInicio && horaFin <= bloqueFin;
        });

        if (!bloqueDisponible) {
            return [null, "No hay bloques disponibles que cubran la duración del servicio en el horario solicitado"];
        }

        // Validar que no haya otra reserva que se cruce con el horario
        const reservasExistentes = await Reserva.find({ trabajador, fecha: fechaReserva, estado: 'Activa' });

        for (let reservaExistente of reservasExistentes) {
            const inicioReservaExistente = new Date(reservaExistente.hora_inicio);
            const finReservaExistente = new Date(inicioReservaExistente);
            finReservaExistente.setMinutes(finReservaExistente.getMinutes() + reservaExistente.duracion);

            if (
                (horaInicioDate >= inicioReservaExistente && horaInicioDate < finReservaExistente) ||
                (horaFin > inicioReservaExistente && horaFin <= finReservaExistente) ||
                (horaInicioDate <= inicioReservaExistente && horaFin >= finReservaExistente)
            ) {
                return [null, "Ya existe una reserva que choca con este horario"];
            }
        }

        // Crear la reserva
        const newReserva = new Reserva({
            hora_inicio: horaInicioDate,
            fecha: fechaReserva,
            cliente,
            trabajador,
            servicio,
            duracion,
            estado
        });

        await newReserva.save();
        return [newReserva, null];
    } catch (error) {
        handleError(error, "reserva.service -> createReserva");
        return [null, "Ocurrió un error al crear la reserva"];
    }
}




async function getActiveReservationCount(clientId, microempresaId) {
    try {
      // Buscar reservas activas del cliente y popular el campo 'servicio'
      // pero solo con el campo 'idMicroempresa'
      const reservas = await Reserva.find({
        cliente: clientId,
        estado: 'Activa'
      }).populate({ path: 'servicio', select: 'idMicroempresa' });
  
      // Filtrar aquellas reservas cuyo servicio tenga el id de microempresa especificado
      const count = reservas.filter(reserva => {
        if (reserva.servicio && reserva.servicio.idMicroempresa) {
          return reserva.servicio.idMicroempresa.toString() === microempresaId;
        }
        return false;
      }).length;
  
      return [count, null];
    } catch (error) {
      handleError(error, "reserva.service -> getActiveReservationCountByClientAndMicroempresa");
      return [null, error.message];
    }
} 
async function getUrlPagoByReservaId(idReserva) {
    try {
        if (!idReserva) return [null, "Falta el ID de la reserva"];
        const reserva = await Reserva.findById(idReserva).populate('servicio'); 
        if (!reserva) return [null, "Reserva no encontrada"];
        if (!reserva.servicio ) return [null, "Servicio no encontrado"]; 
        return [reserva.servicio, null];
    } catch {
        handleError(error, "reserva.service -> getUrlPagoByReservaId");
        return [null, "Error al obtener la reserva"];
    }
}

// Exporta las funciones definidas
export default {
      getReservas,
      getReservasByTrabajador, 
      createReserva, 
      deleteReserva, 
      updateReserva, 
      cancelReserva, 
      cancelReservaCliente,
      getReservasByCliente, 
      finalizarReserva,
      getReservasPorFechaTrabajador,
      getReservasPorFechaMicroempresa,
      createReservaHorario,
      getActiveReservationCount, 
        getUrlPagoByReservaId,

    };
