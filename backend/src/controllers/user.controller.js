/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
"use strict";

import { respondSuccess, respondError } from "../utils/resHandler.js";
import UserService from "../services/user.service.js";
import { userBodySchema, userIdSchema, userTrabajadorSchema, userAdministradorSchema, userClienteSchema } from "../schema/user.schema.js";
import { handleError } from "../utils/errorHandler.js";


/**
 * Obtiene todos los usuarios de la base de datos
 * 
 * 
 */
async function getUsers(req, res) {
  try {
    const [usuarios, errorUsuarios] = await UserService.getUsers();
    if (errorUsuarios) return respondError(req, res, 404, errorUsuarios);

    usuarios.length === 0
      ? respondSuccess(req, res, 204)
      : respondSuccess(req, res, 200, usuarios);
  } catch (error) {
    handleError(error, "user.controller -> getUsers");
    respondError(req, res, 400, error.message);
  }
}

/**
 * Crea un nuevo usuario en la base de datos
 * 
 * @param {Object} req Objeto de solicitud
 * @param {Object} res Objeto de respuesta
 */
async function createUser(req, res) {
  try {
    const { error } = userBodySchema.validate(req.body);
    if (error) return respondError(req, res, 400, error.message);

    const [newUser, errorUser] = await UserService.createUser(req.body);
    if (errorUser) return respondError(req, res, 400, errorUser);

    respondSuccess(req, res, 201, newUser);
  } catch (error) {
    handleError(error, "user.controller -> createUser");
    respondError(req, res, 400, error.message);
  }
}

/**
 * Cambia la contraseña de un usuario
 * 
 * @param {Object} req Objeto de solicitud
 * @param {Object} res Objeto de respuesta
 */
async function changePassword(req, res) {
  try {
    const { error } = userIdSchema.validate(req.params);
    if (error) return respondError(req, res, 400, error.message);

    const { error: errorBody } = userBodySchema.validate(req.body);
    if (errorBody) return respondError(req, res, 400, errorBody.message);

    const [user, errorUser] = await UserService.changePassword(
      req.params.id,
      req.body.oldPassword,
      req.body.newPassword,
    );
    if (errorUser) return respondError(req, res, 404, errorUser);

    respondSuccess(req, res, 200, user);
  } catch (error) {
    handleError(error, "user.controller -> changePassword");
    respondError(req, res, 400, error.message);
  }
}

/**
 * Crea un nuevo trabajador en la base de datos
 * 
 * 
 */
async function createTrabajador(req, res) {
  try {
    const { error } = userTrabajadorSchema.validate(req.body);
    if (error) return respondError(req, res, 400, error.message);

    const [newTrabajador, errorTrabajador] = await UserService.createTrabajador(req.body);
    if (errorTrabajador) return respondError(req, res, 400, errorTrabajador);

    respondSuccess(req, res, 201, newTrabajador);
  } catch (error) {
    handleError(error, "user.controller -> createTrabajador");
    respondError(req, res, 400, error.message);
  }
}

async function getTrabajadorById(req, res) {
  try {
    const { error } = userIdSchema.validate(req.params);
    if (error) return respondError(req, res, 400, error.message);

    const [trabajador, errorTrabajador] = await UserService.getTrabajadorById(req.params.id);
    if (errorTrabajador) return respondError(req, res, 404, errorTrabajador);
    console.log("CONTROLLER TRAB: ", trabajador);
    respondSuccess(req, res, 200, trabajador);
  } catch (error) {
    handleError(error, "user.controller -> getTrabajadorById");
    respondError(req, res, 400, error.message);
  }
}
/**
 * Crea un nuevo administrador en la base de datos
 * 
 * 
 */
async function createAdministrador(req, res) {
  try {
    const { error } = userAdministradorSchema.validate(req.body);
    if (error) return respondError(req, res, 400, error.message);

    const [newAdministrador, errorAdministrador] = await UserService.createAdministrador(req.body);
    if (errorAdministrador) return respondError(req, res, 400, errorAdministrador);

    respondSuccess(req, res, 201, newAdministrador);
  } catch (error) {
    handleError(error, "user.controller -> createAdministrador");
    respondError(req, res, 400, error.message);
  }
}

/**
 * Crea un nuevo cliente en la base de datos
 * 
 * 
 */
async function createCliente(req, res) {
  try {
    const { error } = userClienteSchema.validate(req.body);
    if (error) return respondError(req, res, 400, error.message);

    const [newCliente, errorCliente] = await UserService.createCliente(req.body);
    if (errorCliente) return respondError(req, res, 400, errorCliente);

    respondSuccess(req, res, 201, newCliente);
  } catch (error) {
    handleError(error, "user.controller -> createCliente");
    respondError(req, res, 400, error.message);
  }
}

/**
 * Obtiene un usuario de la base de datos
 * 
 * 
 */
async function getUserById(req, res) {
  try {
    const { error } = userIdSchema.validate(req.params);
    if (error) return respondError(req, res, 400, error.message);

    const [user, errorUser] = await UserService.getUser(req.params.id);
    if (errorUser) return respondError(req, res, 404, errorUser);

    respondSuccess(req, res, 200, user);
  } catch (error) {
    handleError(error, "user.controller -> getUser");
    respondError(req, res, 400, error.message);
  }
}

/**
 * Elimina un usuario de la base de datos
 * 
 * 
 */
async function deleteUser(req, res) {
  try {
    const { error } = userIdSchema.validate(req.params);
    if (error) return respondError(req, res, 400, error.message);

    const [user, errorUser] = await UserService.deleteUser(req.params.id);
    if (errorUser) return respondError(req, res, 404, errorUser);

    respondSuccess(req, res, 200, user);
  } catch (error) {
    handleError(error, "user.controller -> deleteUser");
    respondError(req, res, 400, error.message);
  }
}

async function updateTrabajador(req, res) {
  try {
    const { error } = userIdSchema.validate(req.params);
    if (error) return respondError(req, res, 400, error.message);
    const { trabajadorData } = req.body; 
    if (!trabajadorData) return respondError(req, res, 400, "No se envió información para actualizar");
    

    const [trabajador, errorTrabajador] = await UserService.updateTrabajador(req.params.id, trabajadorData);
    if (errorTrabajador) return respondError(req, res, 404, errorTrabajador);

    respondSuccess(req, res, 200, trabajador);
  } catch (error) {
    handleError(error, "user.controller -> updatedTrabajador");
    respondError(req, res, 400, error.message);
  }
}

export default {
  getUsers,
  createUser,
  changePassword,
  createTrabajador,
  createAdministrador,
  createCliente,
  getUserById,
  deleteUser,
  getTrabajadorById,
  updateTrabajador,
};
