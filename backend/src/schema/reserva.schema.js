import joi from "joi";

/**
 * Valida que la fecha siga el formato "YYYY-MM-DD".
 * Si no cumple el regex, lanza un error con código "any.invalid".
 * Si no es una fecha válida, lanza un error con código "date.base".
 * Retorna un objeto Date válido si todo va bien.
 */
const fechaFormatoValido = (value, helpers) => {
  // Regex para YYYY-MM-DD
  // Año: 4 dígitos
  // Mes: 01 - 12
  // Día: 01 - 31
  const regex = /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

  if (!regex.test(value)) {
    return helpers.error("any.invalid", {
      message: "El campo fecha debe estar en formato YYYY-MM-DD (por ejemplo, 2025-02-03)."
    });
  }

  // Extraer (year, month, day) desde value
  const [year, month, day] = value.split("-");
  const fecha = new Date(`${year}-${month}-${day}T00:00:00Z`);

  // Verificar si la fecha es válida
  if (isNaN(fecha.getTime())) {
    return helpers.error("date.base", {
      message: "El campo fecha debe ser una fecha válida (YYYY-MM-DD)."
    });
  }

  return fecha; // Retorna el objeto Date
};

// Schema principal para crear una reserva
const reservaBodySchema = joi.object({
  hora_inicio: joi.string()
    .required()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .messages({
      "any.required": "La hora de inicio es obligatoria.",
      "string.pattern.base": "La hora de inicio debe estar en el formato HH:MM (por ejemplo, 08:00 o 15:00).",
      "string.empty": "La hora de inicio no puede estar vacía.",
    }),

  fecha: joi.string()
    .required()
    .custom(fechaFormatoValido) // Usa el validador custom
    .messages({
      "any.required": "La fecha es obligatoria.",
      "date.base": "La fecha debe ser una fecha válida en formato YYYY-MM-DD.",
      "any.invalid": "La fecha debe estar en formato YYYY-MM-DD (por ejemplo, 2025-02-03).",
    }),

  cliente: joi.string()
    .required()
    .pattern(/^(?:[0-9a-fA-F]{24}|[0-9a-fA-F]{12})$/)
    .messages({
      "string.empty": "El id del cliente no puede estar vacío.",
      "any.required": "El id del cliente es obligatorio.",
      "string.base": "El id del cliente debe ser de tipo string.",
      "string.pattern.base": "El id del cliente proporcionado no es un ObjectId válido.",
    }),

  trabajador: joi.string()
    .required()
    .pattern(/^(?:[0-9a-fA-F]{24}|[0-9a-fA-F]{12})$/)
    .messages({
      "string.empty": "El id del trabajador no puede estar vacío.",
      "any.required": "El id del trabajador es obligatorio.",
      "string.base": "El id del trabajador debe ser de tipo string.",
      "string.pattern.base": "El id del trabajador proporcionado no es un ObjectId válido.",
    }),

  servicio: joi.string()
    .required()
    .pattern(/^(?:[0-9a-fA-F]{24}|[0-9a-fA-F]{12})$/)
    .messages({
      "string.empty": "El id del servicio no puede estar vacío.",
      "any.required": "El id del servicio es obligatorio.",
      "string.base": "El id del servicio debe ser de tipo string.",
      "string.pattern.base": "El id del servicio proporcionado no es un ObjectId válido.",
    }),

  estado: joi.string()
    .required()
    .messages({
      "string.empty": "El estado no puede estar vacío.",
      "any.required": "El estado es obligatorio.",
    }),
});

// Schema para validar el ID de la reserva
const reservaIdSchema = joi.object({
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

export { reservaBodySchema, reservaIdSchema };
