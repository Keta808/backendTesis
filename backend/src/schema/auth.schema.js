"use strict";

import Joi from "joi";

/**
 * Esquema de validación para el cuerpo de la solicitud de inicio de sesión.
 * Se permite el campo "kind" con valores "Trabajador", "Cliente" o "Administrador".
 * @constant {Object}
 */
const authLoginBodySchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "El email no puede estar vacío.",
    "any.required": "El email es obligatorio.",
    "string.base": "El email debe ser de tipo string.",
    "string.email": "El email debe tener un formato válido.",
  }),
  password: Joi.string().required().messages({
    "string.empty": "La contraseña no puede estar vacía.",
    "any.required": "La contraseña es obligatoria.",
    "string.base": "La contraseña debe ser de tipo string.",
  }),
  kind: Joi.string()
    .valid("Trabajador", "Cliente", "Administrador")
    .optional()
    .messages({
      "any.only": "El tipo de usuario debe ser 'Trabajador', 'Cliente' o 'Administrador'.",
      "string.base": "El tipo de usuario debe ser de tipo string.",
    }),
}).messages({
  "object.unknown": "No se permiten propiedades adicionales.",
});

export { authLoginBodySchema };
