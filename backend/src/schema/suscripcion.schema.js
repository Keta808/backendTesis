/* eslint-disable max-len */
"use strict";

import Joi from "joi";

const suscripcionBodySchema = Joi.object({
    idUser: Joi.string().required().messages({
        "string.empty": "El idUser no puede estar vacío.",
        "any.required": "El idUser es obligatorio.",
        "string.base": "El idUser debe ser de tipo string.",
    }),
    idPlan: Joi.string().required().messages({
        "string.empty": "El idPlan no puede estar vacío.",
        "any.required": "El idPlan es obligatorio.",
        "string.base": "El idPlan debe ser de tipo string.",
    }), 
    estado: Joi.string().valid("pendiente", "activo", "cancelado", "expirado").required().messages({
        "string.empty": "El estado no puede estar vacío.",
        "any.required": "El estado es obligatorio.",
        "string.base": "El estado debe ser de tipo string.",
        "any.only": "El estado debe ser uno de los siguientes valores: pendiente, activo, cancelado, expirado",
    }),
    fecha_inicio: Joi.date().required().messages({
        "date.base": "La fecha de inicio debe ser de tipo date.",
        "any.required": "La fecha de inicio es obligatoria.",
    }),
    fecha_fin: Joi.date().required().messages({
        "date.base": "La fecha de fin debe ser de tipo date.",
        "any.required": "La fecha de fin es obligatoria.",
    }),
    preapproval_id: Joi.string().required().messages({
        "string.empty": "El preapproval_id no puede estar vacío.",
        "any.required": "El preapproval_id es obligatorio.",
        "string.base": "El preapproval_id debe ser de tipo string.",
    }),
}).messages({
    "object.unknown": "No se permiten propiedades adicionales.",
});

const suscripcionIdSchema = Joi.object({
    id: Joi.string().required().messages({
        "string.empty": "El id no puede estar vacío.",
        "any.required": "El id es obligatorio.",
        "string.base": "El id debe ser de tipo string.",
    }),
}).messages({
    "object.unknown": "No se permiten propiedades adicionales.",
}); 

export { suscripcionBodySchema, suscripcionIdSchema }; 
