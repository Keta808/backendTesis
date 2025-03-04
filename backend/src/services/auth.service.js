"use strict";

import UserModels from "../models/user.model.js";
const { User, Trabajador, Cliente, Administrador } = UserModels;

import jwt from "jsonwebtoken";
import { ACCESS_JWT_SECRET, REFRESH_JWT_SECRET } from "../config/configEnv.js";
import { handleError } from "../utils/errorHandler.js";

/**
 * Función genérica para iniciar sesión según el tipo de usuario.
 * @async
 * @function loginUserByKind
 * @param {Object} user - Objeto con email y password
 * @param {string} kind - Tipo de usuario ("Trabajador", "Cliente", "Administrador")
 */
async function loginUserByKind(user, kind) {
  try {
    console.log("user", user);
    const { email, password } = user;
    const userFound = await User.findOne({ email, kind }).exec();

    if (!userFound) {
      return [null, null, "El usuario y/o contraseña son incorrectos"];
    }

    const matchPassword = await User.comparePassword(password, userFound.password);
    if (!matchPassword) {
      return [null, null, "El usuario y/o contraseña son incorrectos"];
    }

    const accessToken = jwt.sign(
      { email: userFound.email, kind, id: userFound._id, isAdmin: userFound.isAdmin },
      ACCESS_JWT_SECRET,
      { expiresIn: "1d" },
    );

    const refreshToken = jwt.sign(
      { email: userFound.email },
      REFRESH_JWT_SECRET,
      { expiresIn: "7d" }
    );

    return [accessToken, refreshToken, null, kind, userFound];
  } catch (error) {
    handleError(error, "auth.service -> loginUserByKind");
  }
}

/**
 * Inicia sesión como Trabajador.
 * @async
 * @function loginTrabajador
 * @param {Object} user - Objeto de usuario
 */
async function loginTrabajador(user) {
  return await loginUserByKind(user, "Trabajador");
}

/**
 * Inicia sesión como Cliente.
 * @async
 * @function loginCliente
 * @param {Object} user - Objeto de usuario
 */
async function loginCliente(user) {
  return await loginUserByKind(user, "Cliente");
}

/**
 * Inicia sesión como Administrador.
 * @async
 * @function loginAdministrador
 * @param {Object} user - Objeto de usuario
 */
async function loginAdministrador(user) {
  return await loginUserByKind(user, "Administrador");
}

/**
 * Refresca el token de acceso
 * @async
 * @function refresh
 * @param {Object} cookies - Objeto de cookies
 */
async function refresh(cookies) {
  try {
    if (!cookies.jwt) return [null, "No hay autorización"];
    const refreshToken = cookies.jwt;

    const accessToken = await jwt.verify(
      refreshToken,
      REFRESH_JWT_SECRET,
      async (err, user) => {
        if (err) return [null, "La sesión ha caducado, vuelva a iniciar sesión"];

        const userFound = await User.findOne({ email: user.email })
          .populate("roles")
          .exec();

        if (!userFound) return [null, "Usuario no autorizado"];

        const accessToken = jwt.sign(
          { email: userFound.email, roles: userFound.roles },
          ACCESS_JWT_SECRET,
          { expiresIn: "1d" }
        );

        return [accessToken, null];
      }
    );

    return accessToken;
  } catch (error) {
    handleError(error, "auth.service -> refresh");
  }
}

export default {
  loginTrabajador,
  loginCliente,
  loginAdministrador,
  refresh,
};
