import joi from "joi";
import mongoose from "mongoose";
import CATEGORIA from "../constants/categoria.constants.js";

/** sdf */
const objectIdValidator = (value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.message("El valor proporcionado no es un ObjectId válido.");
    }
    return value;
};

/**
 * Esquema de validación para el body de microempresa.
 */
const microempresaBodySchema = joi.object({
    
        nombre: joi.string().max(50).required().messages({
            "string.empty": "El nombre no puede estar vacío.",
            "any.required": "El nombre es obligatorio.",
            "string.base": "El nombre debe ser de tipo string.",
            "string.max": "El nombre no puede tener mas de 50 caracteres.",
        }),
        descripcion: joi.string().max(200).required().messages({
            "string.empty": "La descripción no puede estar vacía.",
            "any.required": "La descripción es obligatoria.",
            "string.base": "La descripción debe ser de tipo string.",
            "string.max": "La descripción no puede tener mas de 200 caracteres.",
        }),
        telefono: joi.string().length(9).pattern(/^[0-9]+$/).required().messages({
            "string.empty": "El teléfono no puede estar vacío.",
            "any.required": "El teléfono es obligatorio.",
            "string.base": "El teléfono debe ser de tipo string.",
            "string.length": "El teléfono debe tener exactamente 9 dígitos.",
            "string.pattern.base": "El teléfono solo debe contener dígitos numéricos.",
        }),
        direccion: joi.string().max(100).required().messages({
            "string.empty": "La dirección no puede estar vacía.",
            "any.required": "La dirección es obligatoria.",
            "string.base": "La dirección debe ser de tipo string.",
            "string.max": "La dirección no puede tener mas de 100 caracteres.",
        }),
        email: joi.string().email().required().messages({
            "string.empty": "El email no puede estar vacío.",
            "any.required": "El email es obligatorio.",
            "string.base": "El email debe ser de tipo string.",
            "string.email": "El email debe estar en un formato válido.",
        }),
        categoria: joi.string().valid(...CATEGORIA).required().messages({
            "string.empty": "La categoría no puede estar vacía.",
            "any.required": "La categoría es obligatoria.",
            "string.base": "La categoría debe ser de tipo string.",
        }),
        idSuscripcion: joi.string().custom(objectIdValidator).messages({
            "string.empty": "El idPlan no puede estar vacío.",
            // "any.required": "El idPlan es obligatorio.",
            "string.base": "El idPlan debe ser de tipo string.",
        }),
        idTrabajador: joi.string().required().custom(objectIdValidator).messages({
            "string.empty": "El idTrabajador no puede estar vacío.",
            "any.required": "El idTrabajador es obligatorio.",
            "string.base": "El idTrabajador debe ser de tipo string.",
        }),
    }).messages({
        "object.unknown": "No se permiten propiedades adicionales.",
});

const microempresaIdSchema = joi.object({
    id: joi.string()
        .required()
        .pattern(/^(?:[0-9a-fA-F]{24}|[0-9a-fA-F]{12})$/)
        .messages({
            "string.empty": "El id no puede estar vacío.",
            "any.required": "El id es obligatorio.",
            "string.base": "El id debe ser de tipo string.",
            "string.pattern.base": "El id proporcionado no es un ObjectId válido.",
        }),
});

export { microempresaBodySchema, microempresaIdSchema };
