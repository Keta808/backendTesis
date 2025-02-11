import ReservaService from '../services/reserva.service.js'; 
import { respondSuccess, respondError } from "../utils/resHandler.js";
import { handleError } from "../utils/errorHandler.js";
import { reservaBodySchema, reservaIdSchema } from "../schema/reserva.schema.js";

/*
Get de todas las reservas de la base de datos
*/

async function getReservas(req, res) {
    try {
        const [reservas, errorReservas] = await ReservaService.getReservas();
        if (errorReservas) return respondError(req, res, 404, errorReservas);

        reservas.length === 0
            ? respondSuccess(req, res, 204)
            : respondSuccess(req, res, 200, reservas);
    } catch (error) {
        handleError(error, "reserva.controller -> getReservas");
        respondError(req, res, 400, error.message);
    }
}

/*
Get de todas las reservas de la base de datos por id del trabajador
*/

async function getReservasByTrabajador(req, res) {
    const { id } = req.params; // Asumimos que el ID del trabajador viene en los parámetros de la ruta
    try {
      const [reservas, error] = await ReservaService.getReservasByTrabajador(id);
      if (error || !reservas) {
        return res.status(404).json({ error: "No hay reservas" });
      }
  
      // Transforma cada reserva en un array que contenga un objeto JSON
      const reservasEnArray = reservas.map(reserva => {
        return [
          {
            id: reserva._id,
            cliente: reserva.cliente,      // Objeto completo poblado de cliente
            servicio: reserva.servicio,    // Objeto completo poblado de servicio
            trabajador: reserva.trabajador,
            estado: reserva.estado,
            duracion: reserva.duracion,
            fecha: reserva.fecha,
            hora_inicio: reserva.hora_inicio,
          }
        ];
      });
  
      return res.status(200).json(reservasEnArray);
    } catch (error) {
      console.error("Error en controlador getReservasByTrabajador:", error);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }
  

/**
 * Crea una nueva reserva en la base de datos
 * 
 * @param {Object} req Objeto de solicitud
 * @param {Object} res Objeto de respuesta
 */

async function createReserva(req, res) {
    try {
        console.log("controller reserva create",req.body);

        const { error } = reservaBodySchema.validate(req.body);
        console.log("error",error);
        if (error) return respondError(req, res, 400, error.message);
        const [newReserva, errorReserva] = await ReservaService.createReserva(req.body);
        if (errorReserva) return respondError(req, res, 400, errorReserva);

        respondSuccess(req, res, 201, newReserva);
    } catch (error) {
        handleError(error, "reserva.controller -> createReserva");
        respondError(req, res, 400, error.message);
    }

}

/**
 * Actualiza una reserva en la base de datos
 * 
 */

async function updateReserva(req, res) {
    try {
        const { error } = reservaIdSchema.validate(req.params);
        if (error) return respondError(req, res, 400, error.message);
        const { error: errorBody } = reservaBodySchema.validate(req.body);
        if (errorBody) return respondError(req, res, 400, errorBody.message);
        const [updatedReserva, errorReserva] = await ReservaService.updateReserva(req.params.id, req.body);
        if (errorReserva) return respondError(req, res, 400, errorReserva);
        respondSuccess(req, res, 200, updatedReserva);
    } catch (error) {
        handleError(error, "reserva.controller -> updateReserva");
        respondError(req, res, 400, error.message);
    }
}

/**
 * Elimina una reserva de la base de datos
 * 
 */

async function deleteReserva(req, res) {
    try {
        const { error } = reservaIdSchema.validate(req.params);
        if (error) return respondError(req, res, 400, error.message);

        const [reserva, errorReserva] = await ReservaService.deleteReserva(req.params.id);
        if (errorReserva) return respondError(req, res, 400, errorReserva);

        respondSuccess(req, res, 200, reserva);
    } catch (error) {
        handleError(error, "reserva.controller -> deleteReserva");
        respondError(req, res, 400, error.message);
    }
}

/**
 * Cambia el estado de una reserva a Cancelado
 * 
 * 
 */
async function cancelReserva(req, res) {
    try {
        // Valida el ID con el esquema de validación
        const { error } = reservaIdSchema.validate(req.params);
        if (error) {
            return respondError(req, res, 400, `Error de validación: ${error.message}`);
        }

        // Llama al servicio para cancelar la reserva
        const [reserva, errorReserva] = await ReservaService.cancelReserva(req.params.id);

        // Si hay un error al cancelar la reserva, responde con un mensaje de error
        if (errorReserva) {
            return respondError(req, res, 400, `Error al cancelar la reserva: ${errorReserva}`);
        }

        // Si todo es exitoso, responde con la reserva cancelada
        respondSuccess(req, res, 200, reserva);
    } catch (error) {
        // Manejo de errores generales
        handleError(error, 'reserva.controller -> cancelReserva');
        respondError(req, res, 500, `Error interno del servidor: ${error.message}`);
    }
}

//get reservas cliente

async function getReservasByCliente(req, res) {
    try {
        console.log(req.params);
        const { error } = reservaIdSchema.validate(req.params);
        if (error) return respondError(req, res, 400, error.message);

        const [reservas, errorReservas] = await ReservaService.getReservasByCliente(req.params.id);
        if (errorReservas) return respondError(req, res, 404, errorReservas);

        reservas.length === 0
            ? respondSuccess(req, res, 204)
            : respondSuccess(req, res, 200, reservas);
    } catch (error) {
        handleError(error, "reserva.controller -> getReservasByCliente");
        respondError(req, res, 400, error.message);
    }
}


//actualizar el estado de la reserva a finalizada

async function finalizarReserva(req, res) {
    try {
        const { error } = reservaIdSchema.validate(req.params);
        if (error) return respondError(req, res, 400, error.message);
        const [updatedReserva, errorReserva] = await ReservaService.finalizarReserva(req.params.id);
        if (errorReserva) return respondError(req, res, 400, errorReserva);
        respondSuccess(req, res, 200, updatedReserva);
    } catch (error) {
        handleError(error, "reserva.controller -> finalizarReserva");
        respondError(req, res, 400, error.message);
    }
}



/**
 * Controlador para obtener las reservas activas de un trabajador en una fecha determinada.
 * Se espera recibir en req.params:
 * - workerId: ID del trabajador.
 * - date: Fecha en formato "YYYY-MM-DD".
 */
const getReservasPorFechaTrabajador = async (req, res) => {
    try {
      console.log("getReservasPorFechaTrabajador req params", req.params);
  
      const { workerId, date } = req.params;
      console.log("getReservasPorFechaTrabajador workerId", workerId);
      console.log("getReservasPorFechaTrabajador date", date);
  
      // Llamamos al servicio y esperamos un objeto con la propiedad "reservas"
      const result = await ReservaService.getReservasPorFechaTrabajador(workerId, date);
      
      if (result.error) {
        return res.status(400).json({ error: result.error });
      }
      
      return res.status(200).json({ reservas: result.reservas });
    } catch (err) {
      console.error('Error en getReservasTrabajadorController:', err);
      return res.status(500).json({ error: 'Error interno del servidor.' });
    }
  };
  
  
  /**
   * Controlador para obtener las reservas activas de la microempresa en una fecha determinada.
   * Se espera recibir en req.params:
   * - serviceId: ID del servicio, que se usa para obtener la microempresa.
   * - date: Fecha en formato "YYYY-MM-DD".
   */
  const getReservasPorFechaMicroempresa = async (req, res) => {
    try {
      const { serviceId, date } = req.params;
      const result = await ReservaService.getReservasPorFechaMicroempresa(serviceId, date);
  
      if (result.error) {
        return res.status(400).json({ error: result.error });
      }
      return res.status(200).json({ reservas: result.reservas });
    } catch (err) {
      console.error('Error en getReservasMicroempresaController:', err);
      return res.status(500).json({ error: 'Error interno del servidor.' });
    }
  };
  

export default { 
    getReservas,
    getReservasByTrabajador, 
    createReserva ,
    deleteReserva ,
    updateReserva,
    cancelReserva,
    getReservasByCliente,
    finalizarReserva,
    getReservasPorFechaTrabajador,
    getReservasPorFechaMicroempresa};

