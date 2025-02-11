import Joi from "joi"; 

const cardBodySchema = Joi.object({
    userId: Joi.string().required().messages({
        "string.empty": "El userId no puede estar vacío.",
        "any.required": "El userId es obligatorio.",
        "string.base": "El userId debe ser de tipo string.",
    }),
    customerId: Joi.string().required().messages({
        "string.empty": "El customerId no puede estar vacío.",
        "any.required": "El customerId es obligatorio.",
        "string.base": "El customerId debe ser de tipo string.",
    }),
    cardTokenId: Joi.string().required().messages({
        "string.empty": "El cardTokenId no puede estar vacío.",
        "any.required": "El cardTokenId es obligatorio.",
        "string.base": "El cardTokenId debe ser de tipo string.",
    }),
    lastFourDigits: Joi.string().required().messages({
        "string.empty": "El lastFourDigits no puede estar vacío.",
        "any.required": "El lastFourDigits es obligatorio.",
        "string.base": "El lastFourDigits debe ser de tipo string.",
    }),
    paymenthMethod: Joi.string().required().messages({
        "string.empty": "El paymenthMethod no puede estar vacío.",
        "any.required": "El paymenthMethod es obligatorio.",
        "string.base": "El paymenthMethod debe ser de tipo string.",
    }),
    expirationDate: Joi.string().required().messages({
        "string.empty": "El expirationDate no puede estar vacío.",
        "any.required": "El expirationDate es obligatorio.",
        "string.base": "El expirationDate debe ser de tipo string.",
    }),
}).messages({
    "object.unknown": "No se permiten propiedades adicionales.",
});

const cardIdSchema = Joi.object({
    id: Joi.string().required().messages({
        "string.empty": "El id no puede estar vacío.",
        "any.required": "El id es obligatorio.",
        "string.base": "El id debe ser de tipo string.",
    }),
}).messages({
    "object.unknown": "No se permiten propiedades adicionales.",
});


export { cardBodySchema, cardIdSchema };    
