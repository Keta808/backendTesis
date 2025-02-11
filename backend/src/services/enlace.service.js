"use strict";
import mongoose from "mongoose";
// Importa el modelo de enlace
import Enlace from "../models/enlace.model.js";

// Importa el modelo de User
import UserModels from "../models/user.model.js";
const { Trabajador } = UserModels;
import Role from "../models/role.model.js";
import Microempresa from "../models/microempresa.model.js";
import { handleError } from "../utils/errorHandler.js";

/** */
async function getEnlaces() {
    try {
        const enlaces = await Enlace.find().exec();
        if (!enlaces) return [null, "No hay enlaces"];
    
        return [enlaces, null];
    } catch (error) {
        handleError(error, "enlace.service -> getEnlaces");
        return [null, error.message];
    }
}

/**
 * 
 * @param {*} enlace 
 * @returns 
 */
async function createEnlace(enlace) {
    const session = await mongoose.startSession();
    session.startTransaction(); // Inicia la transacción explícitamente
    try {
        const { id_trabajador, id_role, id_microempresa, fecha_inicio, estado } = enlace;
        
        // Restricciones Enlace:
        const enlaceTrabajador = await Trabajador.findById(id_trabajador).exec();
        if (!enlaceTrabajador) throw new Error("El trabajador no existe");

        const enlaceRole = await Role.findById(id_role).exec();
        if (!enlaceRole) throw new Error("El role no existe");

        const enlaceMicroempresa = await Microempresa.findById(id_microempresa).exec();
        if (!enlaceMicroempresa) throw new Error("La microempresa no existe");

        const enlaceFound = await Enlace.findOne({ id_role, id_trabajador, estado: true });
        if (enlaceFound) throw new Error("Ya existe un enlace activo para este trabajador y rol");

        const newEnlace = new Enlace({
            id_trabajador,
            id_role,
            id_microempresa,
            fecha_inicio,
            estado,
        });

        // Guardar el nuevo enlace y actualizar la microempresa en la misma transacción
        await newEnlace.save({ session });
        enlaceMicroempresa.trabajadores.addToSet(newEnlace._id);
        await enlaceMicroempresa.save({ session });

        // Confirmar la transacción
        await session.commitTransaction();
        
        return [newEnlace, null];
    } catch (error) {
        // Abortar la transacción en caso de error
        await session.abortTransaction();
        handleError(error, "enlace.service -> createEnlace");
        return [null, error.message];
    } finally {
        // Finalizar la sesión independientemente del resultado
        session.endSession();
    }
}


/** */
async function deleteEnlace(id) {
    try {
        const enlace = await Enlace.findByIdAndDelete(id).exec();
        if (!enlace) return [null, "El enlace no existe"];
    
        return [enlace, null];
    } catch (error) {
        handleError(error, "enlace.service -> deleteEnlace");
        return [null, error.message];
    }
}

/** servicio de updateEnlace */
async function updateEnlace(id, enlace) {
    try {
        const { id_trabajador, id_microempresa, estado } = enlace;
    
        const enlaceFound = await Enlace.findById(id);
        if (!enlaceFound) return [null, "El enlace no existe"];

        const estadoOriginal = enlaceFound.estado;
    
        enlaceFound.id_trabajador = id_trabajador;
        enlaceFound.id_microempresa = id_microempresa;
        enlaceFound.estado = estado;
    
        await enlaceFound.save();

         // Si el estado cambió a false, se elimina al trabajador del arreglo de la microempresa
         if (estadoOriginal !== false && estado === false) {
            await Microempresa.findByIdAndUpdate(id_microempresa, {
                $pull: { trabajadores: enlaceFound.id_trabajador },
            });
        }
    
        return [enlaceFound, null];
    } catch (error) {
        handleError(error, "enlace.service -> updateEnlace");
        return [null, error.message];
    }
}

/** Obtener todos los trabajadores que pertenecen a una microempresa */
async function getTrabajadoresPorMicroempresa(id_microempresa) {
    try {
        // Buscar todos los enlaces asociados a la microempresa
        const enlaces = await Enlace.find({ id_microempresa, estado: true }).populate("id_trabajador").exec();
        if (!enlaces || enlaces.length === 0) {
            return [null, "No se encontraron trabajadores para esta microempresa."];
        }   

        // Extraer y devolver solo la información de los trabajadores
        const trabajadores = enlaces.map(enlace => enlace.id_trabajador);

        return [trabajadores, null];
    } catch (error) {
        handleError(error, "enlace.service -> getTrabajadoresPorMicroempresa");
        return [null, "Error al obtener trabajadores"];
    }
}

/** servicio para actualizar parcialmente el enlace */
async function updateEnlaceParcial(id, fieldsToUpdate) {
    try {
        const enlaceFound = await Enlace.findById(id);
        if (!enlaceFound) return [null, "El enlace no existe"];

        const estadoOriginal = enlaceFound.estado;

        // Mostrar los valores para confirmar la entrada
        console.log("Estado original:", estadoOriginal);
        console.log("Estado en fieldsToUpdate:", fieldsToUpdate.estado);
        
        // Actualiza solo los campos proporcionados
        Object.keys(fieldsToUpdate).forEach((key) => {
            enlaceFound[key] = fieldsToUpdate[key];
        });

        await enlaceFound.save();

        // Si el estado cambió a false, eliminamos al trabajador del arreglo de la microempresa
        if (estadoOriginal !== false && fieldsToUpdate.estado === false) {
            console.log("El estado cambió a false. Eliminando trabajador de la microempresa...");
        
            // Intentar eliminar el trabajador directamente usando `$pull` y comprobar el resultado
            const trabajadorId = enlaceFound.id_trabajador.toString();
            const result = await Microempresa.findByIdAndUpdate(
                enlaceFound.id_microempresa,
                { $pull: { trabajadores: enlaceFound._id } },
                { new: true },
            );
        
            console.log("Resultado de la actualización de microempresa:", result);
        
            if (!result) {
                console.log("Error: No se pudo actualizar la microempresa o eliminar el trabajador.");
            } else {
                console.log("Trabajador eliminado correctamente del arreglo trabajadores.");
            }
        }
        
        // **Nuevo bloque**: Si el estado cambió a true, agregamos al trabajador al arreglo de la microempresa
        if (estadoOriginal !== true && fieldsToUpdate.estado === true) { 
            console.log("El estado cambió a true. Agregando trabajador a la microempresa...");
            
            const result = await Microempresa.findByIdAndUpdate( 
                enlaceFound.id_microempresa,
                { $addToSet: { trabajadores: enlaceFound._id } }, // Agregar sin duplicados
                { new: true }
            );

            console.log("Resultado de la actualización de microempresa:", result);
            
            if (!result) {
                console.log("Error: No se pudo actualizar la microempresa o agregar el trabajador.");
            } else {
                console.log("Trabajador agregado correctamente al arreglo trabajadores.");
            }
        } // <-- Línea agregada

        return [enlaceFound, null];
    } catch (error) {
        handleError(error, "enlace.service -> updateEnlaceParcial");
        return [null, error.message];
    }
}

export default {
    getEnlaces,
    createEnlace,
    deleteEnlace,
    updateEnlace,
    getTrabajadoresPorMicroempresa,
    updateEnlaceParcial,
};
