/* eslint-disable no-console */
/* eslint-disable max-len */
/* eslint-disable require-jsdoc */

import Suscripcion from "../models/suscripcion.model.js"; 
import userModels from "../models/user.model.js"; 
const { User } = userModels;

import { respondError } from "../utils/resHandler.js";
import { handleError } from "../utils/errorHandler.js"; 
// Middleware para verificar si el usuario tiene una suscripción activa
async function verificarSuscripcion(req, res, next) {
  try {
      console.log("verificarSuscripcion, req.user: ", req.user);

      // Verifica que req.user existe y tiene email
      if (!req.user || !req.user.email) {
          return respondError(req, res, 401, "Usuario no autenticado.");
      }

      const userEmail = req.user.email; // Obtener el email del usuario desde req.user

      // Buscar al usuario en la base de datos por email
      const user = await User.findOne({ email: userEmail }).exec();

      if (!user || !["Trabajador", "Administrador"].includes(user.kind)) {
          return respondError(req, res, 403, "Acceso no autorizado para este tipo de usuario.");
      }

      // Buscar la suscripción activa del usuario por idUser
      const suscripcion = await Suscripcion.findOne({
          idUser: user._id, // Usamos el _id del usuario encontrado
          estado: { $in: ["authorized", "pending"] },
      }).populate("idPlan");

      if (!suscripcion || !suscripcion.idPlan) {
          return respondError(req, res, 400, "El usuario no tiene una suscripción activa.");
      }

      // Almacenar la suscripción y el usuario en req para su uso en otros middlewares
      req.suscripcion = suscripcion;
      req.user = user;

      next();
  } catch (error) {
      handleError(error, "authentication.middleware -> verificarSuscripcion");
      return respondError(req, res, 500, "Error al verificar la suscripción.");
  }
}

// Middleware para verificar si el usuario tiene un Plan Básico o Gratuito
async function isPlanBasico(req, res, next) {
  try {
      const { suscripcion } = req;

      if (!suscripcion || !suscripcion.idPlan) {
          return respondError(req, res, 400, "No se encontró información de la suscripción activa.");
      }

      const tiposBasico = ["Plan Basico", "Plan Gratuito"];

      if (!tiposBasico.includes(suscripcion.idPlan.tipo_plan)) {
          return respondError(
              req,
              res,
              403,
              "El plan del usuario no permite realizar esta acción. Solo disponible para Plan Básico o Gratuito.",
          );
      }

      next();
  } catch (error) {
      handleError(error, "authentication.middleware -> isPlanBasico");
      return respondError(req, res, 500, "Error al verificar el plan básico o gratuito.");
  }
}

// Middleware para verificar si el usuario tiene un Plan Premium
async function isPlanPremium(req, res, next) {
  try {
      const { suscripcion } = req;

      if (!suscripcion || !suscripcion.idPlan) {
          return respondError(req, res, 400, "No se encontró información de la suscripción activa.");
      }

      if (suscripcion.idPlan.tipo_plan !== "Plan Premium") {
          return respondError(
              req,
              res,
              403,
              "El plan del usuario no permite realizar esta acción. Solo disponible para Plan Premium.",
          );
      }

      next();
  } catch (error) {
      handleError(error, "authentication.middleware -> isPlanPremium");
      return respondError(req, res, 500, "Error al verificar el plan premium.");
  }
}

export default { verificarSuscripcion, isPlanBasico, isPlanPremium }; 
