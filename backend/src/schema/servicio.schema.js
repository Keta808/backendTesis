"use strict";

import Joi from "joi";

const servicioBodySchema = Joi.object({
    
        idMicroempresa: Joi.string().required().messages({
            "string.empty": "El idMicroempresa no puede estar vacío.",
            "any.required": "El idMicroempresa es obligatorio.",
            "string.base": "El idMicroempresa debe ser de tipo string.",
        }),
        nombre: Joi.string().required().messages({
            "string.empty": "El nombre no puede estar vacío.",
            "any.required": "El nombre es obligatorio.",
            "string.base": "El nombre debe ser de tipo string.",
        }),
        precio: Joi.number().required().messages({
            "number.base": "El precio debe ser de tipo number.",
            "any.required": "El precio es obligatorio.",
        }),
        duracion: Joi.number().required().messages({
            "number.base": "La duracion debe ser de tipo number.",
            "any.required": "La duracion es obligatoria.",
        }),
        descripcion: Joi.string().required().messages({
            "string.empty": "La descripcion no puede estar vacía.",
            "any.required": "La descripcion es obligatoria.",
            "string.base": "La descripcion debe ser de tipo string.",
        }),
        porcentajeAbono: Joi.number().min(0).max(100).messages({
            "number.base": "El porcentajeAbono debe ser de tipo number.",
            "number.min": "El porcentaje de abono no puede ser menor a 0.",
            "number.max": "El porcentaje de abono no puede ser mayor a 100.",
        }),
        urlPago: Joi.string().allow(null).messages({
            "string.base": "El urlPago debe ser de tipo string.",
        }),
    }).messages({
        "object.unknown": "No se permiten propiedades adicionales.",
    }); 
const servicioIdSchema = Joi.object({
    id: Joi.string().required().messages({
        "string.empty": "El id no puede estar vacío.",
        "any.required": "El id es obligatorio.",
        "string.base": "El id debe ser de tipo string.",
    }),
}).messages({
    "object.unknown": "No se permiten propiedades adicionales.",
}); 
export { servicioBodySchema, servicioIdSchema }; 
