"use strict"

import { respondSuccess, respondError } from "../utils/resHandler.js";  
import HorarioService from "../services/horario.service.js";
import { handleError } from "../utils/errorHandler.js";
import { horarioBodySchema, horarioIdSchema } from "../schema/horario.schema.js";

/**
 * Obtiene el o los horario de un tabajador por su id
 */


async function getHorariosByTrabajador(req, res) {
  try {
    const { error } = horarioIdSchema.validate({ id: req.params.trabajadorId });

    if (error) return respondError(req, res, 400, error.message);

    const [horarios, errorHorarios] = await HorarioService.getHorariosByTrabajadorId(req.params.trabajadorId);

    if (errorHorarios) return respondError(req, res, 404, errorHorarios);

    respondSuccess(req, res, 200, horarios);
  } catch (error) {
    handleError(error, "horario.controller -> getHorariosByTrabajador");
    respondError(req, res, 400, error.message);
  } 
}

/**
 * Crea un nuevo horario en la base de datos
 * 
 * @param {Object} req Objeto de solicitud
 * @param {Object} res Objeto de respuesta
 */


async function createHorario(req, res) {
  try {

    const { error } = horarioBodySchema.validate(req.body);
    if (error) return respondError(req, res, 400, error.message);

    const [newHorario, errorHorario] = await HorarioService.createHorario(req.body);
    if (errorHorario) return respondError(req, res, 400, errorHorario);

    respondSuccess(req, res, 201, newHorario);
  } catch (error) {
    handleError(error, "horario.controller -> createHorario");
    respondError(req, res, 400, error.message);
  }

}


/**
 * Actualiza un horario por su id
 */


async function updateHorarioById(req, res) {
  try {
    const { error } = horarioIdSchema.validate(req.params);
    if (error) return respondError(req, res, 400, error.message);

    const { error: errorBody } = horarioBodySchema.validate(req.body);
    if (errorBody) return respondError(req, res, 400, errorBody.message);

    const [updatedHorario, errorHorario] = await HorarioService.updateHorarioById(req.params.id, req.body);
    if (errorHorario) return respondError(req, res, 400, errorHorario);

    respondSuccess(req, res, 200, updatedHorario);
  } catch (error) {
    handleError(error, "horario.controller -> updateHorario");
    respondError(req, res, 400, error.message);
  } 
}

/**
 * Elimina un horario por su id
 */

async function deleteHorarioById(req, res) {
  try {
    console.log("deleteHorarioById");
    console.log(req.params);
    const horarioId = req.params.horarioId;
    if (!horarioId) return respondError(req, res, 400, "El ID del horario es requerido");
    const [deletedHorario, errorHorario] = await HorarioService.deleteHorarioById(horarioId);
    if (errorHorario) return respondError(req, res, 400, errorHorario);

    respondSuccess(req, res, 200, deletedHorario);
  } catch (error) {
    handleError(error, "horario.controller -> deleteHorario");
    respondError(req, res, 400, error.message);
  }
}


/**
 * Actualiza los bloques de un horario por día
 * 
 */

async function updateBloquesByDia(req, res) {
    try {
       
        const { trabajador, dia, bloques } = req.body;

        if (!trabajador || !dia || !bloques) {
            return res.status(400).json({
                message: "Los campos trabajador, día y bloques son obligatorios.",
            });
        }

        // Llamada al servicio
        const horarioActualizado = await HorarioService.updateBloquesByDia(trabajador, dia, bloques);

        res.status(200).json({
            message: "Bloques actualizados exitosamente.",
            horario: horarioActualizado,
        });
    } catch (error) {
        console.error("Error al actualizar bloques:", error);
        next(error); // Manejo de errores centralizado
    }
}


/**
 * Funcion para obtener los días de la semana en el cual el trabajador no tiene horarios
 * 
 */

async function getDiasSinHorario(req, res) {
    try {
      const { trabajadorId } = req.params;
  
      // Validación básica del ID
      if (!trabajadorId) return respondError(req, res, 400, "El ID del trabajador es requerido");
  
      // Llamada al servicio
      const [diasSinHorario, error] = await HorarioService.getDiasSinHorario(trabajadorId);
      if (error) return respondError(req, res, 404, error);
  
      respondSuccess(req, res, 200, diasSinHorario);
    } catch (error) {
      handleError(error, "horario.controller -> getDiasSinHorario");
      respondError(req, res, 400, error.message);
    }
  }


//FUNCION DE PRUEBA
  async function getHorasDisponibles(req, res) {
    try {
      console.log("getHorasDisponibles");
      
      const { trabajadorId } = req.params;
      const { fecha, duracion } = req.query;
  
      console.log("trabajadorId", trabajadorId);
      console.log("fecha", fecha);
      console.log("duracion", duracion);
      
      if (!fecha || !duracion) {
        return respondError(req, res, 400, "Fecha y duración son obligatorias");
      }
  
      const [slots, error] = await HorarioService.getHorasDisponibles(trabajadorId, fecha, parseInt(duracion));
      if (error) return respondError(req, res, 404, error);
  
      respondSuccess(req, res, 200, slots);
    } catch (error) {
      handleError(error, "horario.controller -> getHorasDisponibles");
      respondError(req, res, 400, error.message);
    }
  }
  
// FUNCION DE PRUEBA

async function getDisponibilidadMicroEmpresa(req, res) {
    try {

      console.log("getDisponibilidadMicroEmpresa");
      console.log(req.query);
      const { serviceId, date } = req.query;
  
      if (!serviceId || !date) {
        return respondError(req, res, 400, "Se requiere el serviceId y la fecha");
      }
  
      const [disponibilidad, errorDisponibilidad] = await HorarioService.getHorariosDisponiblesMicroEmpresa(serviceId, date);
  
      if (errorDisponibilidad) return respondError(req, res, 404, errorDisponibilidad);
  
      respondSuccess(req, res, 200, disponibilidad);
    } catch (error) {
      handleError(error, "horario.controller -> getDisponibilidadMicroEmpresa");
      respondError(req, res, 400, error.message);
    }
  }
  
  
// exporta todas las funciones

export default {
    getHorariosByTrabajador,
    createHorario,
    updateHorarioById,
    deleteHorarioById,
    updateBloquesByDia,
    getDiasSinHorario,
    getHorasDisponibles,
    getDisponibilidadMicroEmpresa

    };

