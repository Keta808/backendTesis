/* eslint-disable no-console */
/* eslint-disable max-len */
/* eslint-disable require-jsdoc */

import Suscripcion from "../models/suscripcion.model.js"; 
import userModels from "../models/user.model.js"; // ✅ Correcto
const { User } = userModels;

import { respondError } from "../utils/resHandler.js";
import { handleError } from "../utils/errorHandler.js"; 
// Middleware para verificar si Tiene suscripcion 
async function verificarSuscripcion(req, res, next) {
    try {
        // Verifica que req.user existe y tiene el id
        if (!req.user || !req.user.id) {
          return respondError(req, res, 401, "Usuario no autenticado.");
      }
        const userId = req.user.id;
        // Validar que el usuario sea Trabajador o Administrador
        const user = await User.findById(userId).exec();
        if (!user || !["Trabajador", "Administrador"].includes(user.kind)) {
            return respondError(req, res, 403, "Acceso no autorizado para este tipo de usuario.");
        }

        const suscripcion = await Suscripcion.findOne({ 
            idUser: userId, 
            estado: { $in: ["authorized", "pending"] },
        }).populate("idPlan");
        if (!suscripcion) {
            return respondError(req, res, 400, "El usuario no tiene suscripción activa.");
        } 
        req.suscripcion = suscripcion;

        next();
    } catch (error) {
        handleError(error, "authentication.middleware -> verificarSuscripcion");
        return respondError(req, res, 500, "Error al verificar la suscripción.");
    }
} 
// Middleware para verificar Tipo de plan suscrito 
  
async function isPlanBasico(req, res, next) {
    try {
      const { suscripcion } = req;
  
      if (!suscripcion) {
        return respondError(req, res, 400, "No se encontró información de la suscripción activa.");
      }
  
      const tiposBasico = ["Plan Basico", "Plan Gratuito"];
  
      if (!tiposBasico.includes(suscripcion.idPlan.tipo_plan)) {
        return respondError(
          req,
          res,
          403,
          "El plan del usuario no permite realizar esta acción. Solo disponible para Plan Básico o Gratuito.");
      }
  
      next();
    } catch (error) {
      handleError(error, "authentication.middleware -> isPlanBasico");
      return respondError(req, res, 500, "Error al verificar el plan básico o gratuito.");
    }
  } 
async function isPlanPremium(req, res, next) {
    try {
      const { suscripcion } = req;
  
      if (!suscripcion) {
        return respondError(req, res, 400, "No se encontró información de la suscripción activa.");
      }
  
      if (suscripcion.idPlan.tipo_plan !== "Plan Premium") {
        return respondError(
          req,
          res,
          403,
          "El plan del usuario no permite realizar esta acción. Solo disponible para Plan Premium.");
      }
  
      next();
    } catch (error) {
      handleError(error, "authentication.middleware -> isPlanPremium");
      return respondError(req, res, 500, "Error al verificar el plan premium.");
    }
  }
export default { verificarSuscripcion, isPlanBasico, isPlanPremium }; 
