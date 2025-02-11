/* eslint-disable space-before-blocks */
/* eslint-disable require-jsdoc */
/* eslint-disable no-unused-vars */
"use strict";

import { respondSuccess, respondError } from "../utils/resHandler.js";
import MicroempresaService from "../services/microempresa.service.js";
import Microempresa from "../models/microempresa.model.js";
import { microempresaBodySchema, microempresaIdSchema } from "../schema/microempresa.schema.js";
import { handleError } from "../utils/errorHandler.js";

/**
 * Obtiene todas las microempresas de la base de datos
 */
async function getMicroempresas(req, res) {
  try {
    const [microempresas, errorMicroempresas] = await MicroempresaService.getMicroempresas();
    // populate para mostrar todos los datos de trabajadores
    if (errorMicroempresas) return respondError(req, res, 404, errorMicroempresas);

    microempresas.length === 0
      ? respondSuccess(req, res, 204)
      : respondSuccess(req, res, 200, microempresas);
  } catch (error) {
    handleError(error, "microempresa.controller -> getMicroempresas");
    respondError(req, res, 400, error.message);
  }
}

/**
 * Obtiene solo la URL de la foto de perfil de una microempresa
 */
async function getMicroempresaFotoPerfil(req, res) {
  try {
      const { id } = req.params;
      const [fotoPerfil, error] = await MicroempresaService.getMicroempresaFotoPerfil(id);
      if (error) {
          return res.status(404).json({ error });
      }
      return res.status(200).json({ fotoPerfil });
  } catch (error) {
      console.error("❌ Error en getMicroempresaFotoPerfil:", error);
      res.status(500).json({ error: "Error interno del servidor" });
  }
}

/**
 * Obtiene microempresas separas por paginas con limmite de microempresas por pagina
 */
async function getMicroempresasForPage(req, res) {
  try {
    // Extraer los parámetros `page` y `limit` de la URL
    const { page, limit } = req.params;

    // Convertir a números y validar
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    if (isNaN(pageNumber) || isNaN(limitNumber) || pageNumber <= 0 || limitNumber <= 0) {
      return respondError(req, res, 400, "Los parámetros de paginación deben ser números mayores a 0.");
    }

    // Calcular la cantidad de documentos a saltar
    const skip = (pageNumber - 1) * limitNumber;

    // Obtener las microempresas con paginación
    const microempresas = await Microempresa.find()
      .skip(skip)
      .limit(limitNumber)
      .exec();

    // Contar el total de microempresas para la paginación
    const total = await Microempresa.countDocuments();

    // Responder con las microempresas y datos adicionales de paginación
    respondSuccess(req, res, 200, {
      data: microempresas,
      total, // Total de microempresas
      currentPage: pageNumber, // Página actual
      totalPages: Math.ceil(total / limitNumber), // Total de páginas
    });
  } catch (error) {
    handleError(error, "microempresa.controller -> getMicroempresasForPage");
    respondError(req, res, 500, "Error al obtener las microempresas.");
  }
}

/**
 * Crea una nueva microempresa en la base de datos
 * @param {Object} req Objeto de solicitud
 * @param {Object} res Objeto de respuesta
 */
async function createMicroempresa(req, res) {
  try {
    // Validación de los datos del esquema
    const { error } = microempresaBodySchema.validate(req.body);
    if (error) return respondError(req, res, 400, error.message);

    // Llamada al servicio para crear la microempresa
    const [newMicroempresa, errorMicroempresa] = await MicroempresaService
    .createMicroempresa(req.body);

    // Manejar errores del servicio
    if (errorMicroempresa) {
      console.error("Error al crear la microempresa:", errorMicroempresa);
      return respondError(req, res, 400, "No se pudo crear la microempresa.");
    }

    // Responder con la nueva microempresa creada
    respondSuccess(req, res, 201, { _id: newMicroempresa._id, ...newMicroempresa.toObject() });
  } catch (error) {
    // Manejar errores generales
    handleError(error, "microempresa.controller -> createMicroempresa");
    return respondError(req, res, 500, "Error interno del servidor.");
  }
}

/**
 * Obtiene una microempresa por su id en la base de datos
 */
async function getMicroempresaById(req, res) {
  try {
    const { error } = microempresaIdSchema.validate(req.params);
    if (error) return respondError(req, res, 400, error.message);

    const [microempresa, errorMicroempresa] = await MicroempresaService
    .getMicroempresaById(req.params.id);
    if (errorMicroempresa) return respondError(req, res, 404, errorMicroempresa);

    respondSuccess(req, res, 200, microempresa);
  } catch (error) {
    handleError(error, "microempresa.controller -> getMicroempresaById");
    respondError(req, res, 400, error.message);
  }
}

/**
 * Actualiza una microempresa en la base de datos por su id
 */
async function updateMicroempresaById(req, res) {
    try {
      const { id } = req.params; // ID de la microempresa a actualizar
      const { userId, ...body } = req.body; // Extraer userId y demás datos
      const { error: idError } = microempresaIdSchema.validate({ id });
      if (idError) return respondError(req, res, 400, idError.message);

      // Validar que el userId esté presente
      if (!userId) {
        return respondError(req, res, 400, "El ID del usuario es obligatorio.");
      }

      const tienePermiso = await verificarPermisos(userId, id); // Implementa esta función
        if (!tienePermiso) {
            return respondError(req, res, 403, "No tienes permisos para actualizar esta microempresa.");
        }

        const [microempresa, errorMicroempresa] = await MicroempresaService
        .updateMicroempresaById(id, body);
        if (errorMicroempresa) return respondError(req, res, 404, errorMicroempresa);
        if (!microempresa) return respondError(req, res, 404, "La microempresa no existe");

        return respondSuccess(req, res, 200, microempresa);
    } catch (error) {
        handleError(error, "microempresa.controller -> updateMicroempresaById");
        return respondError(req, res, 400, error.message);
    }
}

async function verificarPermisos(userId, microempresaId) {
  const microempresa = await Microempresa.findById(microempresaId);

  if (!microempresa) {
      return false; // La microempresa no existe
  }

  // Validar si el usuario es dueño de la microempresa
  return microempresa.idTrabajador.toString() === userId;
}


/**
 * Elimina una microempresa en la base de datos por su id
 */
async function deleteMicroempresaById(req, res) {
    try {
        const { error } = microempresaIdSchema.validate(req.params);
        if (error) return respondError(req, res, 400, error.message);

        const [microempresa, errorMicroempresa] = await MicroempresaService
        .deleteMicroempresaById(req.params.id);
        if (errorMicroempresa) return respondError(req, res, 404, errorMicroempresa);

        respondSuccess(req, res, 200, microempresa);
    } catch (error) {
        handleError(error, "microempresa.controller -> deleteMicroempresaById");
        respondError(req, res, 400, error.message);
    }
}

// eslint-disable-next-line require-jsdoc, space-before-blocks
async function getMicroempresasPorCategoria(req, res) {
  try {
    const { categoria } = req.params;
    if (!categoria) {
      return res.status(400).json({ error: "La categoría es obligatoria" });
    }

    const [microempresas, error] = await MicroempresaService.getMicroempresasPorCategoria(categoria);

    if (error) {
      return res.status(404).json({ error });
    }

    return res.status(200).json({ data: microempresas });
  } catch (error) {
    console.error("❌ Error en getMicroempresasPorCategoria:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

async function getMicromempresaPorNombre(req, res){
    try {
        const { nombre } = req.params;
        // eslint-disable-next-line max-len
        const [microempresas, errorMicroempresas] = await MicroempresaService.getMicroempresasPorNombre(nombre);
        if (errorMicroempresas) return respondError(req, res, 404, errorMicroempresas);

        microempresas.length === 0
          ? respondSuccess(req, res, 204)
          : respondSuccess(req, res, 200, microempresas);
      } catch (error) {
        handleError(error, "microempresa.controller -> getMicroempresasPorNombre");
        respondError(req, res, 400, error.message);
      }
}

async function getMicroempresasByUser(req, res) {
  try {
    const { trabajadorId } = req.params;
    const microempresas = await MicroempresaService.getMicroempresasByUser(trabajadorId);

    if (!microempresas || microempresas.length === 0) {
      return res.status(404).json({ state: 'Error', message: 'No se encontraron microempresas para este trabajador' });
    }

    res.status(200).json({ state: "Success", data: microempresas });
  } catch (error) {
    res.status(500).json({ state: "Error", message: error.message });
  }
}

//
//controlador que retorna SOLO el id de la microempresa por el id de su trabajador

async function getMicroempresaIdByTrabajadorId(req, res) {
  try {
    const { trabajadorId } = req.params;
    const microempresa = await MicroempresaService.getMicroempresaIdByTrabajadorId(trabajadorId);

    if (!microempresa) {
      return res.status(404).json({ state: 'Error', message: 'No se encontró la microempresa' });
    }

    res.status(200).json({ state: "Success", data: microempresa });
  } catch (error) {
    res.status(500).json({ state: "Error", message: error.message });
  }
}


export default {
    getMicroempresas,
    getMicroempresaFotoPerfil,
    getMicroempresasForPage,
    createMicroempresa,
    getMicroempresaById,
    updateMicroempresaById,
    deleteMicroempresaById,
    getMicroempresasPorCategoria,
    getMicromempresaPorNombre,
    getMicroempresasByUser,
    getMicroempresaIdByTrabajadorId
};
