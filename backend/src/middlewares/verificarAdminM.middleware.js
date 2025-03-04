/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
import userModels from "../models/user.model.js"; 
import { respondError } from "../utils/resHandler.js";
import { handleError } from "../utils/errorHandler.js"; 

const { Trabajador } = userModels;

async function verificarAdminMicroempresa(req, res, next) {
    try {
        if (!req.user || !req.user.id) {
            return respondError(req, res, 401, "Usuario no autenticado.");
        }

        // Buscar el trabajador por su ID
        const trabajador = await Trabajador.findById(req.user.id);
        
        if (!trabajador) {
            return respondError(req, res, 403, "No tienes permisos para realizar esta acción.");
        }

        // Verificar si el trabajador es administrador de la microempresa
        if (!trabajador.isAdmin) {
            return respondError(req, res, 403, "Solo el administrador de la microempresa puede realizar esta acción.");
        }

        // Si el usuario es administrador, continuar con la solicitud
        next();
    } catch (error) {
        handleError(error, "middleware -> verificarAdminMicroempresa");
        return respondError(req, res, 500, "Error al verificar permisos de administrador.");
    }
}

export default verificarAdminMicroempresa; 
