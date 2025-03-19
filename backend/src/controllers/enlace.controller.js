"use strict";

import { respondSuccess, respondError } from "../utils/resHandler.js";
import EnlaceService from "../services/enlace.service.js";
import { enlaceBodySchema, enlaceIdSchema, enlacePartialUpdateSchema } from "../schema/enlace.schema.js";
import { handleError } from "../utils/errorHandler.js";

/**
 * 
 * Obtiene todos los enlaces de la base de datos
 */
async function getEnlaces(req, res) {
    try {
        const [enlaces, errorEnlaces] = await EnlaceService.getEnlaces();
        if (errorEnlaces) return respondError(req, res, 404, errorEnlaces);

        enlaces.length === 0
            ? respondSuccess(req, res, 204)
            : respondSuccess(req, res, 200, enlaces);
    } catch (error) {
        handleError(error, "enlace.controller -> getEnlaces");
        respondError(req, res, 400, error.message);
    }
}

/**
 * Crea un nuevo enlace en la base de datos
 * 
 * @param {Object} req Objeto de solicitud
 * @param {Object} res Objeto de respuesta
 */
async function createEnlace(req, res) {
    try {
        const { error } = enlaceBodySchema.validate(req.body);
        if (error) return respondError(req, res, 400, error.message);

        const [newEnlace, errorEnlace] = await EnlaceService.createEnlace(req.body);
        if (errorEnlace) return respondError(req, res, 400, errorEnlace);

        respondSuccess(req, res, 201, newEnlace);
    } catch (error) {
        handleError(error, "enlace.controller -> createEnlace");
        respondError(req, res, 400, error.message);
    }
}

/**
 * Elimina un enlace de la base de datos
 * 
 * @param {Object} req Objeto de solicitud
 * @param {Object} res Objeto de respuesta
 */
async function deleteEnlace(req, res) {
    try {
        const { error } = enlaceIdSchema.validate(req.params);
        if (error) return respondError(req, res, 400, error.message);

        const [enlace, errorEnlace] = await EnlaceService.deleteEnlace(req.params.id);
        if (errorEnlace) return respondError(req, res, 404, errorEnlace);

        respondSuccess(req, res, 200, enlace);
    } catch (error) {
        handleError(error, "enlace.controller -> deleteEnlace");
        respondError(req, res, 400, error.message);
    }
}

/**
 * Actualiza un enlace de la base de datos
 * 
 * @param {Object} req Objeto de solicitud
 * @param {Object} res Objeto de respuesta
 */
async function updateEnlace(req, res) {
    try {
        const { error } = enlaceIdSchema.validate(req.params);
        if (error) return respondError(req, res, 400, error.message);

        const { error: errorBody } = enlaceBodySchema.validate(req.body);
        if (errorBody) return respondError(req, res, 400, errorBody.message);

        if (req.body.estado === false) {
            const fechaActual = new Date();
            const fechaLocal = new Date(fechaActual.getTime() - fechaActual.getTimezoneOffset() * 60000);
            req.body.fecha_termino = fechaLocal;
        }
        
        const [enlace, errorEnlace] = await EnlaceService.updateEnlace(req.params.id, req.body);
        if (errorEnlace) return respondError(req, res, 404, errorEnlace);

        respondSuccess(req, res, 200, enlace);
    } catch (error) {
        handleError(error, "enlace.controller -> updateEnlace");
        respondError(req, res, 400, error.message);
    }
}

/** controlador para obtener trabajadores por microempresa */
async function getTrabajadoresPorMicroempresa(req, res) {
    try {
        const [trabajadores, errorTrabajadores] = await EnlaceService
        .getTrabajadoresPorMicroempresa(req.params.id);
        if (errorTrabajadores) return respondError(req, res, 404, errorTrabajadores);

        trabajadores.length === 0
            ? respondSuccess(req, res, 204)
            : respondSuccess(req, res, 200, trabajadores);
    } catch (error) {
        handleError(error, "enlace.controller -> getTrabajadoresPorMicroempresa");
        respondError(req, res, 400, error.message);
    }
}

/** controlador para Actualizar parcialmente el enlace */
async function updateEnlaceParcial(req, res) {
    try {
        const { error } = enlaceIdSchema.validate(req.params);
        if (error) return respondError(req, res, 400, error.message);

        const { error: errorBody } = enlacePartialUpdateSchema
        .validate(req.body, { allowUnknown: true, abortEarly: false });
        if (errorBody) return respondError(req, res, 400, errorBody.message);

        if (req.body.estado === false) {
            const fechaActual = new Date();
            const fechaLocal = new Date(fechaActual.getTime() - fechaActual.getTimezoneOffset() * 60000);
            req.body.fecha_termino = fechaLocal;
        }
        

        const [enlace, errorEnlace] = await EnlaceService
        .updateEnlaceParcial(req.params.id, req.body); // Aquí está el llamado correcto
        if (errorEnlace) return respondError(req, res, 404, errorEnlace);

        respondSuccess(req, res, 200, enlace);
    } catch (error) {
        handleError(error, "enlace.controller -> updatePartialEnlace");
        respondError(req, res, 400, error.message);
    }
}

/** Obtiene la micreoempresa a la que pertenece el trabajador */
export async function getMicroempresasByTrabajador(req, res) {
    try {
      const { userId } = req.params;
  
      if (!userId) {
        return res.status(400).json({ message: "ID de trabajador requerido", state: "Error" });
      }
  
      const microempresas = await EnlaceService.obtenerMicroempresasPorTrabajador(userId);
      
      if (!microempresas.length) {
        return res.status(404).json({ message: "No se encontraron microempresas para este trabajador", state: "Error" });
      }
  
      return res.status(200).json({ state: "Success", data: microempresas });
    } catch (error) {
      console.error("❌ Error al obtener microempresas:", error);
      return res.status(500).json({ message: error.message, state: "Error" });
    }
  }

  /**
 * Controlador para desvincular un trabajador de una microempresa
 * @param {Object} req - Request de Express
 * @param {Object} res - Response de Express
 */
export async function desvincularTrabajador(req, res) {
    try {
        const { idEnlace } = req.params; // 📌 Extraer ID del enlace desde la URL

        if (!idEnlace) {
            return res.status(400).json({ error: "El ID del enlace es requerido." });
        }

        const resultado = await EnlaceService.desvincularTrabajador(idEnlace);

        if (resultado.error) {
            return res.status(400).json({ error: resultado.error });
        }

        return res.status(200).json({ message: resultado.message });
    } catch (error) {
        console.error("❌ Error en desvincularTrabajador:", error.message);
        return res.status(500).json({ error: "Error interno del servidor." });
    }
}

/** Controlador para obtener el historial de microempresas de un usuario */
async function getHistorialMicroempresas(req, res) {
    try {
        const { idUsuario } = req.params;

        const [historial, error] = await EnlaceService.obtenerHistorialMicroempresas(idUsuario);
        if (error) return respondError(req, res, 404, error);

        return respondSuccess(req, res, 200, historial, "Historial de microempresas obtenido correctamente");
    } catch (error) {
        handleError(error, "enlace.controller -> getHistorialMicroempresas");
        return respondError(req, res, 500, "Error al obtener historial de microempresas");
    }
}

export default {
    getEnlaces,
    createEnlace,
    deleteEnlace,
    updateEnlace,
    getTrabajadoresPorMicroempresa,
    updateEnlaceParcial,
    getMicroempresasByTrabajador,
    desvincularTrabajador,
    getHistorialMicroempresas,
};
