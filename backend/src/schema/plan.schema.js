"use strict";

import Joi from "joi";

const planBodySchema = Joi.object({
    tipo_plan: Joi.string().required().messages({
        "string.empty": "El tipo_plan no puede estar vacío.",
        "any.required": "El tipo_plan es obligatorio.",
        "string.base": "El tipo_plan debe ser de tipo string.",
    }),
    precio: Joi.number().required().messages({
        "number.empty": "El precio no puede estar vacío.",
        "any.required": "El precio es obligatorio.",
        "number.base": "El precio debe ser de tipo number.",
    }),
    mercadoPagoId: Joi.string().required().messages({   
        "string.empty": "El mercadoPagoId no puede estar vacío.",
        "any.required": "El mercadoPagoId es obligatorio.",
        "string.base": "El mercadoPagoId debe ser de tipo string.",
    }),
    estado: Joi.string().required().messages({
        "string.empty": "El estado no puede estar vacía.",
        "any.required": "El estado es obligatoria.",
        "string.base": "El estado debe ser de tipo string.",
    }),
    fecha_creacion: Joi.date().messages({
        "date.base": "La fecha_creacion debe ser de tipo date.",
    }), 
    
    
}).messages({
    "object.unknown": "No se permiten propiedades adicionales.",
});
const planIdSchema = Joi.object({
    id: Joi.string().required().messages({
        "string.empty": "El id no puede estar vacío.",
        "any.required": "El id es obligatorio.",
        "string.base": "El id debe ser de tipo string.",
    }),
}).messages({
    "object.unknown": "No se permiten propiedades adicionales.",
}); 


export { planBodySchema, planIdSchema };
