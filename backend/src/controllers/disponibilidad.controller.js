"use strict";

import { respondSuccess, respondError } from "../utils/resHandler.js";
import DisponibilidadService from "../services/disponibilidad.service.js";
import { handleError } from "../utils/errorHandler.js";
import { disponibilidadBodySchema, disponibilidadIdSchema } from "../schema/disponibilidad.schema.js";

/**
 * 
 * Obtiene la disponibilidad de un trabajador por su id
 */

async function getDisponibilidadByTrabajador(req, res) {
  try {
    const { error } = disponibilidadIdSchema.validate(req.params);
    if (error) return respondError(req, res, 400, error.message);

    const [disponibilidad, errorDisponibilidad] = await DisponibilidadService.getDisponibilidadByTrabajador(
      req.params.id
    );
    if (errorDisponibilidad) return respondError(req, res, 404, errorDisponibilidad);

    respondSuccess(req, res, 200, disponibilidad);
  } catch (error) {
    handleError(error, "disponibilidad.controller -> getDisponibilidadByTrabajador");
    respondError(req, res, 400, error.message);
  }
}

/**
 * Crea una nueva disponibilidad en la base de datos
 * 
 * @param {Object} req Objeto de solicitud
 * @param {Object} res Objeto de respuesta
 */

async function createDisponibilidad(req, res) {
  try {

    const { error } = disponibilidadBodySchema.validate(req.body);
    if (error) return respondError(req, res, 400, error.message);

    const [newDisponibilidad, errorDisponibilidad] = await DisponibilidadService.createDisponibilidad(req.body);
    if (errorDisponibilidad) return respondError(req, res, 400, errorDisponibilidad);

    respondSuccess(req, res, 201, newDisponibilidad);
  } catch (error) {
    handleError(error, "disponibilidad.controller -> createDisponibilidad");
    respondError(req, res, 400, error.message);
  }

}


/**
 * Actualiza la disponibilidad de un trabajador
 */

async function updateDisponibilidad(req, res) {
  try {
    const { error } = disponibilidadIdSchema.validate(req.params);
    if (error) return respondError(req, res, 400, error.message);

    //const { error: errorBody } = disponibilidadBodySchema.validate(req.body);
    //if (errorBody) return respondError(req, res, 400, errorBody.message);

    const [updatedDisponibilidad, errorDisponibilidad] = await DisponibilidadService.updateDisponibilidad(
      req.params.id,
      req.body
    );
    if (errorDisponibilidad) return respondError(req, res, 404, errorDisponibilidad);

    respondSuccess(req, res, 200, updatedDisponibilidad);
  } catch (error) {
    handleError(error, "disponibilidad.controller -> updateDisponibilidad");
    respondError(req, res, 400, error.message);
  }
}

/**
 * Elimina la disponibilidad de un trabajador
 * 
 */

async function deleteDisponibilidad(req, res) {
  try {
    const { error } = disponibilidadIdSchema.validate(req.params);
    if (error) return respondError(req, res, 400, `Error de validación: ${error.message}`);

    const [disponibilidad, errorDisponibilidad] = await DisponibilidadService.deleteDisponibilidad(req.params.id);
    if (errorDisponibilidad) return respondError(req, res, 404, errorDisponibilidad);

    respondSuccess(req, res, 200, { message: "Disponibilidad eliminada correctamente", disponibilidad });
  } catch (error) {
    handleError(error, "disponibilidad.controller -> deleteDisponibilidad");
    respondError(req, res, 500, "Error interno del servidor");
  }
}


const getHorariosDisponibles = async (req, res) => {
  const { workerId, date } = req.body;
 
  try {
    const availableSlots = await DisponibilidadService.getAvailableSlots(workerId, date);
    console.log('availableSlots', availableSlots);
    res.status(200).json({ availableSlots });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los horarios disponibles', error });
  }
};


/**
 * Obtiene los horarios disponibles de una microempresa
 */

const getHorariosDisponiblesMicroEmpresa = async (req, res) => {
  console.log('req.body de horarios disponibles por microempresa', req.body);
  const { serviceId, date } = req.body;
  try {
    const availableSlots = await DisponibilidadService.getHorariosDisponiblesMicroEmpresa(serviceId, date);
    res.status(200).json({ availableSlots });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los horarios disponibles', error });
  }

  
}

const getTrabajadoresDisponiblesPorHora = async (req, res) => {
  console.log('req.body de trabajadores disponibles por hora', req.body);
  
  const { serviceId, date, hora } = req.body;

  try {
    // Validación inicial
    if (!serviceId || !date || !hora) {
      return res.status(400).json({ 
        message: "Todos los campos (serviceId, date, hora) son requeridos." 
      });
    }

    // Llamar al servicio para obtener los trabajadores disponibles
    const [trabajadoresDisponibles, error] = await DisponibilidadService.getTrabajadoresDisponiblesPorHora(serviceId, date, hora);

    if (error) {
      return res.status(404).json({ message: error });
    }

    res.status(200).json({ trabajadoresDisponibles });
  } catch (error) {
    console.error("Error en obtenerTrabajadoresDisponibles:", error);
    res.status(500).json({ message: "Error al obtener los trabajadores disponibles", error });
  }
};

// funcion para obtener los dias en los que no tiene horario un trabajador

const getDiasSinHorario = async (req, res) => {
  
  console.log('req.body', req.body);

  const { workerId } = req.body;
  console.log('workerId', workerId);

  try {
    const availableDays = await DisponibilidadService.getDiasSinHorario(workerId);
    res.status(200).json({ availableDays });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los dias disponibles', error });
  }
}

export default { 
    getDisponibilidadByTrabajador, 
    createDisponibilidad, 
    updateDisponibilidad, 
    deleteDisponibilidad,
    getHorariosDisponibles,
    getHorariosDisponiblesMicroEmpresa,
    getTrabajadoresDisponiblesPorHora,
    getDiasSinHorario



    
 };