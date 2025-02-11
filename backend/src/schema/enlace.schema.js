"use strict";

import Joi from "joi";

const enlaceBodySchema = Joi.object({

    id_trabajador: Joi.string().required().messages({
        "string.empty": "El id_trabajador no puede estar vacío.",
        "any.required": "El id_trabajador es obligatorio.",
        "string.base": "El id_trabajador debe ser una cadena de texto válida.",
    }),
    id_role: Joi.string().required().messages({
        "string.empty": "El id_role no puede estar vacío.",
        "any.required": "El id_role es obligatorio.",
        "string.base": "El id_role debe ser de tipo string.",
    }),
    id_microempresa: Joi.string().required().messages({
        "string.empty": "El id_microempresa no puede estar vacío.",
        "any.required": "El id_microempresa es obligatorio.",
        "string.base": "El id_microempresa debe ser de tipo string.",
    }),
    fecha_inicio: Joi.date().required().messages({
        "date.base": "La fecha de inicio debe ser de tipo date.",
        "any.required": "La fecha de inicio es obligatoria.",
    }),
    estado: Joi.boolean().required().messages({
        "boolean.base": "El estado debe ser de tipo boolean.",
        "any.required": "El estado es obligatorio.",
    }),
}).messages({
    "object.unknown": "No se permiten propiedades adicionales.",
});

const enlaceIdSchema = Joi.object({
    id: Joi.string().required().messages({
        "string.empty": "El id no puede estar vacío.",
        "any.required": "El id es obligatorio.",
        "string.base": "El id debe ser de tipo string.",
    }),
}).messages({
    "object.unknown": "No se permiten propiedades adicionales.",
});

const enlacePartialUpdateSchema = Joi.object({
    id_trabajador: Joi.string().optional().messages({
        "string.base": "El id_trabajador debe ser de tipo string.",
    }),
    id_role: Joi.string().optional().messages({
        "string.base": "El id_role debe ser de tipo string.",
    }),
    id_microempresa: Joi.string().optional().messages({
        "string.base": "El id_microempresa debe ser de tipo string.",
    }),
    fecha_inicio: Joi.date().optional().messages({
        "date.base": "La fecha de inicio debe ser de tipo date.",
    }),
    estado: Joi.boolean().optional().messages({
        "boolean.base": "El estado debe ser de tipo boolean.",
    }),
}).messages({
    "object.unknown": "No se permiten propiedades adicionales.",
});


export { enlaceBodySchema, enlaceIdSchema, enlacePartialUpdateSchema };
