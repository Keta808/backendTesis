/* eslint-disable max-len */
"use strict";

import Joi from "joi";
import ROLES from "../constants/roles.constants.js";
/**
 * Esquema de validación para el cuerpo de la solicitud de usuario.
 * @constant {Object}
 */
const userBodySchema = Joi.object({

 email: Joi.string().email().required().messages({
  "string.empty": "El email no puede estar vacío.",
    "any.required": "El email es obligatorio.",
    "string.base": "El email debe ser de tipo string.",
    "string.email": "El email debe tener un formato válido.",
  }),
  password: Joi.string().required().min(5).regex(/[0-9]/, "number").messages({
    "string.empty": "La contraseña no puede estar vacía.",
    "any.required": "La contraseña es obligatoria.",
    "string.base": "La contraseña debe ser de tipo string.",
    "string.min": "La contraseña debe tener al menos 5 caracteres.",
    "string.pattern.base": "La contraseña debe tener al menos un numero",
  }),
  state: Joi.array()
    .required()
    .messages({
      "array.base": "El rol debe ser de tipo array.",
      "any.required": "El rol es obligatorio.",
      "string.base": "El rol debe ser de tipo string.",
      "any.only": "El rol proporcionado no es válido.",
    }),
    newPassword: Joi.string().min(5).regex(/[0-9]/, "number").messages({
      "string.empty": "La contraseña no puede estar vacía.",
      "string.base": "La contraseña debe ser de tipo string.",
      "string.min": "La contraseña debe tener al menos 5 caracteres.",
      "string.pattern.base": "La contraseña debe tener al menos un numero",
    }),
  }).messages({

}).messages({
  "object.unknown": "No se permiten propiedades adicionales.",
});

const userTrabajadorSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "El email no puede estar vacío.",
    "any.required": "El email es obligatorio.",
    "string.base": "El email debe ser de tipo string.",
    "string.email": "El email debe tener un formato válido.",
  }),
  password: Joi.string().required().min(5).regex(/[0-9]/, "number").messages({
    "string.empty": "La contraseña no puede estar vacía.",
    "any.required": "La contraseña es obligatoria.",
    "string.base": "La contraseña debe ser de tipo string.",
    "string.min": "La contraseña debe tener al menos 5 caracteres.",
    "string.pattern.base": "La contraseña debe tener al menos un número",
  }),
  nombre: Joi.string().required().messages({
    "string.empty": "El nombre no puede estar vacío.",
    "any.required": "El nombre es obligatorio.",
    "string.base": "El nombre debe ser de tipo string.",
  }),
  apellido: Joi.string().required().messages({
    "string.empty": "El apellido no puede estar vacío.",
    "any.required": "El apellido es obligatorio.",
    "string.base": "El apellido debe ser de tipo string.",
  }),
  telefono: Joi.string().required().messages({
    "string.empty": "El telefono no puede estar vacío.",
    "any.required": "El telefono es obligatorio.",
    "string.base": "El telefono debe ser de tipo string.",
  }),
  state: Joi.string().required().messages({
    "any.required": "El rol es obligatorio.",
    "string.base": "El rol debe ser de tipo string.",
  }),
}).messages({
  "object.unknown": "No se permiten propiedades adicionales.",
});

const userAdministradorSchema = Joi.object({
  nickname: Joi.string().required().messages({
    "string.empty": "El nickname no puede estar vacío.",
    "any.required": "El nickname es obligatorio.",
    "string.base": "El nickname debe ser de tipo string.",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "El email no puede estar vacío.",
    "any.required": "El email es obligatorio.",
    "string.base": "El email debe ser de tipo string.",
    "string.email": "El email debe tener un formato válido.",
  }),
  password: Joi.string().required().min(5).regex(/[0-9]/, "number").messages({
    "string.empty": "La contraseña no puede estar vacía.",
    "any.required": "La contraseña es obligatoria.",
    "string.base": "La contraseña debe ser de tipo string.",
    "string.min": "La contraseña debe tener al menos 5 caracteres.",
    "string.pattern.base": "La contraseña debe tener al menos un número",
  }),
  state: Joi.string().required().messages({
    "any.required": "El rol es obligatorio.",
    "string.base": "El rol debe ser de tipo string.",
  }),

}).messages({
  "object.unknown": "No se permiten propiedades adicionales.",
});

const userClienteSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "El email no puede estar vacío.",
    "any.required": "El email es obligatorio.",
    "string.base": "El email debe ser de tipo string.",
    "string.email": "El email debe tener un formato válido.",
  }),
  password: Joi.string().required().min(5).regex(/[0-9]/, "number").messages({
    "string.empty": "La contraseña no puede estar vacía.",
    "any.required": "La contraseña es obligatoria.",
    "string.base": "La contraseña debe ser de tipo string.",
    "string.min": "La contraseña debe tener al menos 5 caracteres.",
    "string.pattern.base": "La contraseña debe tener al menos un número",
  }),
  nombre: Joi.string().required().messages({
    "string.empty": "El nombre no puede estar vacío.",
    "any.required": "El nombre es obligatorio.",
    "string.base": "El nombre debe ser de tipo string.",
  }),
  apellido: Joi.string().required().messages({
    "string.empty": "El apellido no puede estar vacío.",
    "any.required": "El apellido es obligatorio.",
    "string.base": "El apellido debe ser de tipo string.",
  }),
  telefono: Joi.string().required().messages({
    "string.empty": "El telefono no puede estar vacío.",
    "any.required": "El telefono es obligatorio.",
    "string.base": "El telefono debe ser de tipo string.",
  }),
  state: Joi.string().required().messages({
    "any.required": "El rol es obligatorio.",
    "string.base": "El rol debe ser de tipo string.",
  }),
}).messages({
  "object.unknown": "No se permiten propiedades adicionales.",
});

/**
 * Esquema de validación para el id de usuario.
 * @constant {Object}
 */
const userIdSchema = Joi.object({
  id: Joi.string()
    .required()
    .pattern(/^(?:[0-9a-fA-F]{24}|[0-9a-fA-F]{12})$/)
    .messages({
      "string.empty": "El id no puede estar vacío.",
      "any.required": "El id es obligatorio.",
      "string.base": "El id debe ser de tipo string.",
      "string.pattern.base": "El id proporcionado no es un ObjectId válido.",
    }),
});

export { userBodySchema, userIdSchema, userTrabajadorSchema, userAdministradorSchema, userClienteSchema };
