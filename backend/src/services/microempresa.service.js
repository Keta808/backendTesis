/* eslint-disable require-jsdoc */
"use strict";

import Microempresa from "../models/microempresa.model.js";
import Enlace from "../models/enlace.model.js";
import { handleError } from "../utils/errorHandler.js";

/**
 * Obtiene todas las microempresas de la base de datos
 * @returns {Promise} Promesa con el objeto de las microempresas
 */
async function getMicroempresas() {
    try {
        const microempresas = await Microempresa.find().exec();
        if (!microempresas || microempresas.length === 0) return [null, "No hay microempresas"];
    
        const shuffledMicroempresas = microempresas.sort(() => Math.random() - 0.5);
        
        return [shuffledMicroempresas, null];
    } catch (error) {
        handleError(error, "microempresa.service -> getMicroempresas");
    }
}

/**
 * Obtiene solo la URL de la foto de perfil de una microempresa por su ID
 * @param {string} id - ID de la microempresa
 * @returns {Promise} Promesa con la URL de la foto de perfil
 */
async function getMicroempresaFotoPerfil(id) {
    try {
        const microempresa = await Microempresa.findById(id).exec();
        if (!microempresa || !microempresa.fotoPerfil) return [null, "No se encontró la foto de perfil"];

        return [microempresa.fotoPerfil.url, null];
    } catch (error) {
        handleError(error, "microempresa.service -> getMicroempresaFotoPerfil");
        return [null, "Error al obtener la foto de perfil"];
    }
}

async function getMicroempresasForPage(page = 1, limit = 10) {
    try {
        const skip = (page - 1) * limit; // Cálculo para saltar las microempresas anteriores
        const microempresas = await Microempresa.find()
            .skip(skip) // Saltar las anteriores
            .limit(limit) // Limitar la cantidad
            .exec();

        if (!microempresas || microempresas.length === 0) {
            return [null, "No hay microempresas"];
        }

        return [microempresas, null];
    } catch (error) {
        handleError(error, "microempresa.service -> getMicroempresas");
    }
}

/**
 * Crea una nueva microempresa en la base de datos
 * @param {Object} microempresa Objeto de microempresa
 * @returns {Promise} Promesa con el objeto de microempresa creado
 */
async function createMicroempresa(microempresa) {
    try {
        const {
            nombre,
            descripcion,
            telefono,
            direccion,
            email,
            categoria,
            idPlan,
            idTrabajador,
            imagenes,
        } = microempresa;

        // Verificar si la microempresa ya existe por email
        const microempresaFound = await Microempresa.findOne({ email: microempresa.email });
        if (microempresaFound) return [null, "La microempresa ya existe"];

        // URL de imagen de perfil predeterminada
        const defaultProfileImageUrl = "https://res.cloudinary.com/dzkna5hbk/image/upload/v1737576587/defaultProfile_ysxp6x.webp";

        // Crear la nueva microempresa con la imagen predeterminada si no se proporciona
        const newMicroempresa = new Microempresa({
            nombre,
            descripcion,
            telefono,
            direccion,
            email,
            categoria,
            idPlan,
            idTrabajador,
            imagenes,
            fotoPerfil: {
                url: defaultProfileImageUrl,
                public_id: null, // No hay un public_id para la imagen predeterminada
            },
        });

        // Guardar la microempresa en la base de datos
        await newMicroempresa.save();

        return [newMicroempresa, null];
    } catch (error) {
        handleError(error, "microempresa.service -> createMicroempresa");
        return [null, "Error interno al crear la microempresa"];
    }
}

/**
 * Obtiene una microempresa por su id de la base de datos
 */
async function getMicroempresaById(id) {
    try {
        // 1️⃣ Buscar la microempresa por ID
        const microempresa = await Microempresa.findById(id).exec();
        if (!microempresa) return [null, "La microempresa no existe"];

        // 2️⃣ Buscar los enlaces activos asociados a la microempresa
        const enlaces = await Enlace.find({ id_microempresa: id, estado: true })
            .populate("id_trabajador", "nombre apellido email telefono")
            .exec();

        // 3️⃣ Extraer los trabajadores desde los enlaces
        const trabajadores = enlaces.map((enlace) => enlace.id_trabajador);

        // 4️⃣ Añadir los trabajadores a la microempresa
        microempresa.trabajadores = trabajadores;

        return [microempresa, null];
    } catch (error) {
        handleError(error, "microempresa.service -> getMicroempresaById");
    }
}


/**
 * Actualiza una microempresa por su id de la base de datos
 * @param {string} id Id de la microempresa
 * @param {Object} microempresa Objeto de microempresa
 */
async function updateMicroempresaById(id, microempresa) {
    try {
        const {
            nombre,
            descripcion,
            telefono,
            direccion,
            email,
            categoria,
            idPlan,
            idTrabajador,
            imagenes,
        } = microempresa;
        const microempresaFound = await Microempresa.findById(id).exec();
        if (!microempresaFound) {
            return [null, "La microempresa no existe"];
          }
          
        if (!microempresaFound) return [null, "La microempresa no existe"];

        if (nombre) microempresaFound.nombre = nombre;
        if (descripcion) microempresaFound.descripcion = descripcion;
        if (telefono) microempresaFound.telefono = telefono;
        if (direccion) microempresaFound.direccion = direccion;
        if (email) microempresaFound.email = email;
        if (categoria) microempresaFound.categoria = categoria;
        microempresaFound.idPlan = idPlan;
        if (idTrabajador) microempresaFound.idTrabajador = idTrabajador;
        microempresaFound.imagenes = imagenes;

        await microempresaFound.save();
        return [microempresaFound, null];
    } catch (error) {
        handleError(error, "microempresa.service -> updateMicroempresaById");
    }
}

/**
 * Elimina una microempresa por su id de la base de datos
 * @param {string} id Id de la microempresa
 * @returns {Promise} Promesa con el objeto de microempresa eliminado
 */
async function deleteMicroempresaById(id) {
    try {
        const deletedMicroempresa = await Microempresa.findByIdAndDelete(id);
        if (!deletedMicroempresa) return [null, "La microempresa no existe"];

        return [deletedMicroempresa, null];
    } catch (error) {
        handleError(error, "microempresa.service -> deleteMicroempresaById");
        return [null, "Error al eliminar la microempresa"];
    }
} 

// eslint-disable-next-line require-jsdoc
async function getMicroempresasPorCategoria(categoria) {
    try {
        if (!categoria) {
            return [null, "La categoría es invalida."];
        }
        // eslint-disable-next-line max-len
        const microempresas = await Microempresa.find({ categoria: new RegExp(`^${categoria}$`, "i") }).exec(); 
        if (microempresas.length === 0) {
            return [null, "No hay microempresas disponibles para esta categoría."];
        }

        if (!microempresas) return [null, "No hay microempresas de esta categoria"]; 
        const shuffledMicroempresa = microempresas.sort(() => Math.random() - 0.5);
    
        return [shuffledMicroempresa, null];
    } catch (error) {
        handleError(error, "microempresa.service -> getCategoria");
    }
} 

// getMicromempresaPorNombre  

async function getMicromempresaPorNombre(nombre) { 
    try {
        if (!nombre) {
            return [null, "El nombre es invalido."];
        }
        // eslint-disable-next-line max-len
        const microempresas = await Microempresa.find({ nombre: new RegExp(`^${nombre}$`, "i") }).exec(); 
        if (microempresas.length === 0) {
            return [null, "No hay microempresas disponibles para este nombre."];
        }

        if (!microempresas) return [null, "No hay microempresas de este nombre"]; 
        const shuffledMicroempresa = microempresas.sort(() => Math.random() - 0.5);
    
        return [shuffledMicroempresa, null];
    } catch (error) {
        handleError(error, "microempresa.service -> getNombre");
    }
}

// Servicio para obtener microempresas por trabajador
async function getMicroempresasByUser(trabajadorId) {
    try {
      const microempresas = await Microempresa.find({ idTrabajador: trabajadorId });
      return microempresas;
    } catch (error) {
      throw new Error("Error al obtener microempresas del trabajador");
    }
}

//servicio que retorna SOLO el id de la microempresa por el id de su trabajador

async function getMicroempresaIdByTrabajadorId(trabajadorId) {
    try {
        const microempresa = await Microempresa.findOne({ idTrabajador: trabajadorId });
        if (!microempresa) return [null, "No hay microempresas"];
        return [microempresa._id, null];
    } catch (error) {
        handleError(error, "microempresa.service -> getMicroempresaIdByTrabajadorId");
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
    getMicroempresaIdByTrabajadorId,

    
};

