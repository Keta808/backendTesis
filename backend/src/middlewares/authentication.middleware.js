"use strict";

import jwt from "jsonwebtoken";
import { ACCESS_JWT_SECRET } from "../config/configEnv.js";
import { respondError } from "../utils/resHandler.js";
import { handleError } from "../utils/errorHandler.js";

// 🟢 Definir rutas públicas (NO requieren autenticación)
const publicRoutes = [
  "/api/users/createcliente",
  "/api/users/createuser",
  "/api/users/createtrabajador",
  "/api/auth/login",
];

/**
  * 📌 Middleware para verificar el token de autenticación
 */
const verifyJWT = (req, res, next) => {
  try {
    // 🟢 Si la ruta está en la lista de rutas públicas, permitir el acceso sin token
    if (publicRoutes.includes(req.path)) {
      return next();
    }

    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return respondError(
        req,
        res,
        401,
        "No autorizado",
        "No hay token valido",
      );
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, ACCESS_JWT_SECRET, (err, decoded) => {
      if (err) return respondError(req, res, 403, "No autorizado", err.message);

      // Asignar los datos decodificados al objeto req.user
      req.user = { email: decoded.email, roles: decoded.roles };

      next();
    });
  } catch (error) {
    handleError(error, "authentication.middleware -> verifyToken");
  }
};

export default verifyJWT;

