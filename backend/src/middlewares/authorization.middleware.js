"use strict";
// Autorizacion - Comprobar el rol del usuario
import UserModels from "../models/user.model.js"; // Importas el objeto por defecto

const { Trabajador, Cliente, Administrador } = UserModels; 

import { respondError } from "../utils/resHandler.js";
import { handleError } from "../utils/errorHandler.js";
/**
 * Comprueba si el usuario es administrador
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @param {Function} next - Función para continuar con la siguiente función
 */
async function isAdmin(req, res, next) {
  try {
    const user = await Administrador.findOne({ email: req.user.email });
    if(user){
      next();
      return;
    }
    respondError(req, res, 401, "No tienes permisos de administrador");
  }catch(error){
    handleError(error, "authorization.middleware -> isUser");
  }

}

async function isTrabajador(req, res, next) {
  try {
    const user = await Trabajador.findOne({ email: req.user.email });
    if(user){
      next();
      return;
    }
    respondError(req, res, 401, "No tienes permisos de trabajador");
  }catch(error){
    handleError(error, "authorization.middleware -> isUser");
  }

}

async function isCliente(req, res, next) {
  try {
    const user = await Cliente.findOne({ email: req.user.email });
    if(user){
      next();
      return;
    }
    respondError(req, res, 401, "No tienes permisos de cliente");
  }
  catch(error){
    handleError(error, "authorization.middleware -> isUser");
  }
}

export { isAdmin, isTrabajador, isCliente };

