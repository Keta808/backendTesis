"use strict";

import Joi from "joi";

/**
 * Esquema de validación para el cuerpo de la solicitud de horario.
 * @constant {Object}
 */

const horarioBodySchema = Joi.object({
  trabajador: Joi.string().required().messages({
    "string.empty": "El trabajador no puede estar vacío.",
    "any.required": "El trabajador es obligatorio.",
    "string.base": "El trabajador debe ser de tipo string.",
  }),

  dia: Joi.string()
    .valid("lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo")
    .required()
    .messages({
      "string.empty": "El día no puede estar vacío.",
      "any.required": "El día es obligatorio.",
      "string.base": "El día debe ser de tipo string.",
      "any.only": "El día debe ser uno de: lunes, martes, miércoles, jueves, viernes, sábado o domingo.",
    }),

  bloques: Joi.array()
    .items(
      Joi.object({
        hora_inicio: Joi.string()
          .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
          .required()
          .messages({
            "string.empty": "La hora de inicio no puede estar vacía.",
            "any.required": "La hora de inicio es obligatoria.",
            "string.base": "La hora de inicio debe ser de tipo string.",
            "string.pattern.base": "La hora de inicio debe estar en el formato HH:MM (por ejemplo, 08:00 o 15:00).",
          }),

        hora_fin: Joi.string()
          .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
          .required()
          .messages({
            "string.empty": "La hora de fin no puede estar vacía.",
            "any.required": "La hora de fin es obligatoria.",
            "string.base": "La hora de fin debe ser de tipo string.",
            "string.pattern.base": "La hora de fin debe estar en el formato HH:MM (por ejemplo, 08:00 o 15:00).",
          }),
      })
    )
    .min(1)
    .required()
    .messages({
      "array.base": "Los bloques deben ser de tipo array.",
      "array.min": "Debe haber al menos un bloque horario.",
      "any.required": "Los bloques son obligatorios.",
    }),
}).messages({
  "object.unknown": "No se permiten propiedades adicionales.",
});


const horarioIdSchema = Joi.object({
  id: Joi.string().hex().length(24).optional().messages({
    "string.base": "El ID debe ser de tipo string.",
    "string.hex": "El ID debe ser un valor hexadecimal válido.",
    "string.length": "El ID debe tener 24 caracteres.",
  }),
});

  
export { horarioBodySchema, horarioIdSchema };
