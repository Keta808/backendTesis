import Valoracion from "../models/valoracion.model.js";
import { handleError } from "../utils/errorHandler.js";
import UserModels from "../models/user.model.js";
import Reserva from "../models/reserva.model.js";
import Enlace from "../models/enlace.model.js";
import Microempresa from "../models/microempresa.model.js";

const { Trabajador, Cliente } = UserModels;

/**
 * Obtiene todas las valoraciones de una microempresa.
 * @param {string} microempresaId - ID de la microempresa.
 * @returns {Promise<[Array|null, string|null]>} - Lista de valoraciones o un mensaje de error.
 */
async function getValoracionesPorMicroempresa(microempresaId) {
    try {
        console.log("microempresaId", microempresaId);  
        const valoraciones = await Valoracion.find({ microempresa: microempresaId })
            .populate('cliente', 'nombre email')
            .populate('trabajador', 'nombre')
            .populate('reserva', 'fecha hora_inicio servicio')
            .exec();

        if (!valoraciones.length) return [null, "No hay valoraciones para esta microempresa"];

        return [valoraciones, null];
    } catch (error) {
        handleError(error, "valoracion.service -> getValoracionesPorMicroempresa");
        return [null, "Error al obtener las valoraciones de la microempresa"];
    }
}

/**
 * Obtiene todas las valoraciones de un trabajador específico.
 * @param {string} trabajadorId - ID del trabajador.
 * @returns {Promise<[Array|null, string|null]>} - Lista de valoraciones o un mensaje de error.
 */
async function getValoracionesPorTrabajador(trabajadorId) {
    try {
        const valoraciones = await Valoracion.find({ trabajador: trabajadorId })
            .populate('cliente', 'nombre email')
            .populate('microempresa', 'nombre')
            .populate('reserva', 'fecha hora_inicio servicio')
            .exec();

        if (!valoraciones.length) return [null, "No hay valoraciones para este trabajador"];

        return [valoraciones, null];
    } catch (error) {
        handleError(error, "valoracion.service -> getValoracionesPorTrabajador");
        return [null, "Error al obtener las valoraciones del trabajador"];
    }
}

/**
 * Crea una nueva valoración.
 * @param {Object} valoracionData - Datos de la valoración.
 * @returns {Promise<[Object|null, string|null]>} - Valoración creada o un mensaje de error.
 */
async function crearValoracion(valoracionData) {
    try {
        const { microempresa, cliente, trabajador, reserva, puntuacion, comentario } = valoracionData;

        // Validaciones previas
        const clienteExiste = await Cliente.findById(cliente);
        if (!clienteExiste) return [null, "El cliente no existe"];

        const trabajadorExiste = await Trabajador.findById(trabajador);
        if (!trabajadorExiste) return [null, "El trabajador no existe"];

        const reservaExiste = await Reserva.findById(reserva);
        if (!reservaExiste) return [null, "La reserva no existe"];

        // No puede haber más de una valoración por reserva
        const valoracionExistente = await Valoracion.findOne({ reserva });
        if (valoracionExistente) return [null, "Ya existe una valoración para esta reserva"];
        
        if (puntuacion < 1 || puntuacion > 5) return [null, "La puntuación debe estar entre 1 y 5 estrellas"];

        const nuevaValoracion = new Valoracion({
            microempresa,
            cliente,
            trabajador,
            reserva,
            puntuacion,
            comentario
        });

        console.log("nuevaValoracion", nuevaValoracion);
        await nuevaValoracion.save();
        return [nuevaValoracion, null];
    } catch (error) {
        handleError(error, "valoracion.service -> crearValoracion");
        return [null, "Error al crear la valoración"];
    }
}

/**
 * Elimina una valoración por ID.
 * @param {string} valoracionId - ID de la valoración a eliminar.
 * @returns {Promise<[Object|null, string|null]>} - Valoración eliminada o un mensaje de error.
 */
async function eliminarValoracion(valoracionId) {
    try {
        const valoracionEliminada = await Valoracion.findByIdAndDelete(valoracionId);

        if (!valoracionEliminada) return [null, "Valoración no encontrada"];

        return [valoracionEliminada, null];
    } catch (error) {
        handleError(error, "valoracion.service -> eliminarValoracion");
        return [null, "Error al eliminar la valoración"];
    }
}

async function getValoracionPromedioPorMicroempresa(microempresaId) {
    try {
        const valoraciones = await Valoracion.find({ microempresa: microempresaId });

        if (!valoraciones.length) return [null, "No hay valoraciones para esta microempresa"];

        const totalPuntuaciones = valoraciones.reduce((sum, val) => sum + val.puntuacion, 0);
        const promedio = totalPuntuaciones / valoraciones.length;

        return [promedio.toFixed(2), null]; // Redondeado a 2 decimales
    } catch (error) {
        handleError(error, "valoracion.service -> getValoracionPromedioPorMicroempresa");
        return [null, "Error al obtener la valoración promedio de la microempresa"];
    }
}


// verificar si existe una valoracion para una reserva

async function existeValoracionPorReserva(reservaId) {
    try {
        const valoracion = await Valoracion.findOne({ reserva: reservaId });
        return valoracion ? true : false;
    } catch (error) {
        handleError(error, "valoracion.service -> existeValoracionPorReserva");
        return false;
    }
} 


export default {
    getValoracionPromedioPorMicroempresa,
    getValoracionesPorMicroempresa,
    getValoracionesPorTrabajador,
    crearValoracion,
    eliminarValoracion,
    existeValoracionPorReserva
};
