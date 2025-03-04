"use strict";

import { respondSuccess, respondError } from "../utils/resHandler.js";
import { handleError } from "../utils/errorHandler.js";

/** Servicios de autenticación */
import AuthService from "../services/auth.service.js";
import { authLoginBodySchema } from "../schema/auth.schema.js";

/**
 * Inicia sesión con un usuario.
 * Dependiendo del valor de `kind` en el body (por ejemplo, "Trabajador", "Administrador" o "Cliente"),
 * se llamará a la función de login correspondiente.
 *
 * @async
 * @function login
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function login(req, res) {
  try {
    const { body } = req;
    console.log("body en login controller ", body);
    const { error: bodyError } = authLoginBodySchema.validate(body);
    if (bodyError) return respondError(req, res, 400, bodyError.message);

    // Se espera que el body incluya el campo `kind`.
    // Si no se envía, se puede definir un valor por defecto (por ejemplo, "Cliente")
    const kind = body.kind || "Cliente";
    let result;
    console.log("kind", kind);
    // Llamada a la función de login según el tipo de usuario
    if (kind === "Trabajador") {
      result = await AuthService.loginTrabajador(body);
    } else if (kind === "Administrador") {
      result = await AuthService.loginAdministrador(body);
    } else {
      result = await AuthService.loginCliente(body);
    }

    const [accessToken, refreshToken, errorToken, kindFromService, userFound] = result;

    if (errorToken) return respondError(req, res, 400, errorToken);

    // Configuración de la cookie con el token de refresco
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    });

    const userInfo = {
      id: userFound._id,
      email: userFound.email,
      kind: kindFromService,
      nombre: userFound.nombre || null, 
      apellido: userFound.apellido || null, 
      telefono: userFound.telefono || null,
    };

    respondSuccess(req, res, 200, { accessToken, user: userInfo });
  } catch (error) {
    handleError(error, "auth.controller -> login");
    respondError(req, res, 400, error.message);
  }
}

/**
 * Cierra la sesión del usuario.
 * @async
 * @function logout
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function logout(req, res) {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) return respondError(req, res, 400, "No hay token");
    res.clearCookie("jwt", { httpOnly: true });
    respondSuccess(req, res, 200, { message: "Sesión cerrada correctamente" });
  } catch (error) {
    handleError(error, "auth.controller -> logout");
    respondError(req, res, 400, error.message);
  }
}

/**
 * Refresca el token de acceso.
 * @async
 * @function refresh
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function refresh(req, res) {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) return respondError(req, res, 400, "No hay token");

    const [accessToken, errorToken] = await AuthService.refresh(cookies);

    if (errorToken) return respondError(req, res, 400, errorToken);

    respondSuccess(req, res, 200, { accessToken });
  } catch (error) {
    handleError(error, "auth.controller -> refresh");
    respondError(req, res, 400, error.message);
  }
}

export default {
  login,
  logout,
  refresh,
};
