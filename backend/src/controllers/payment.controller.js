/* eslint-disable no-console */
/* eslint-disable max-len */
/* eslint-disable require-jsdoc */

import { respondSuccess, respondError } from "../utils/resHandler.js";
import { handleError } from "../utils/errorHandler.js"; 
import PaymentServices from "../services/payment.service.js";

async function createPayment(req, res) {
    try {
        const paymentData = req.body;
        const [newPayment, error] = await PaymentServices.createPayment(paymentData);
        if (error) {
            return respondError(req, res, 400, error);
        }
        return respondSuccess(req, res, 200, newPayment);
    } catch (error) {
        handleError(error, "payment.controller -> createPayment");
        return respondError(req, res, 400, error);
    }
} 

async function getPayments(req, res) {
    try {
        const [payments, error] = await PaymentServices.getPayments();
        if (error) {
            return respondError(req, res, 400, error);
        }
        return respondSuccess(req, res, 200, payments);
    } catch (error) {
        handleError(error, "payment.controller -> getPayments");
        return respondError(req, res, 400, error);
    }
} 

async function getPaymentById(req, res) {
    try {
        const { paymentId } = req.params;
        if (!paymentId) return respondError(req, res, 400, "No se ha proporcionado el id del pago.");
        const [payment, error] = await PaymentServices.getPaymentById(paymentId);
        if (error) {
            return respondError(req, res, 400, error);
        }
        return respondSuccess(req, res, 200, payment);
    } catch (error) {
        handleError(error, "payment.controller -> getPaymentById"); 
        return respondError(req, res, 400, error);
    }
} 

async function deletePayment(req, res) {
    try {
        const { paymentId } = req.params;
        if (!paymentId) return respondError(req, res, 400, "No se ha proporcionado el id del pago.");
        const [payment, error] = await PaymentServices.deletePayment(paymentId);
        if (error) {
            return respondError(req, res, 400, error);
        }
        return respondSuccess(req, res, 200, payment);
    } catch (error) {
        handleError(error, "payment.controller -> deletePayment");
        return respondError(req, res, 400, error);
    }
} 
async function updatePayment(req, res) {
    try {
        const { paymentId } = req.params;
        if (!paymentId) return respondError(req, res, 400, "No se ha proporcionado el id del pago.");
        const paymentData = req.body;
        const [updatedPayment, error] = await PaymentServices.updatePayment(paymentId, paymentData);
        if (error) {
            return respondError(req, res, 400, error);
        }
        return respondSuccess(req, res, 200, updatedPayment);
    } catch (error) {
        handleError(error, "payment.controller -> updatePayment");
        return respondError(req, res, 400, error);
    }
}
async function webhook(req, res) {
    try {
        const { id, topic } = req.query; 

        // Verificar que la notificación sea de un pago válido
        if (!id || topic !== "payment") {
            return respondError(req, res, 400, "Parámetros inválidos en la notificación.");
        }

        const paymentId = id;
        const idServicio = req.body.external_reference; // Extraer `idServicio` desde `external_reference`
        console.log("controller: WEBHOOK PAYMENT ID:", paymentId);
        console.log("controller: WEBHOOK MICROEMPRESA ID:", idServicio);
        if (!idServicio) {
            return respondError(req, res, 400, "No se encontró el ID del servicio en la transacción.");
        }

        
        const [payment, error] = await PaymentServices.procesarNotificacionPago(paymentId, idServicio);

        if (error) {
            return respondError(req, res, 400, error);
        }

        return respondSuccess(req, res, 200, payment);
    } catch (error) {
        handleError(error, "payment.controller -> webhook");
        return respondError(req, res, 500, "Error interno al procesar la notificación.");
    }
}  
async function refundPayment(req, res) {
    try {
        const { paymentId } = req.params; 
        console.log(" controller: REFUND PAYMENT ID:", paymentId);
        if (!paymentId) return respondError(req, res, 400, "No se ha proporcionado el id del pago.");
        const [payment, error] = await PaymentServices.refundPayment(paymentId);
        console.log("controller: PAYMENT", payment); 
        if (error) return respondError(req, res, 400, error);    
        return respondSuccess(req, res, 200, payment);
    } catch (error) {
        handleError(error, "payment.controller -> refundPayment");
        return respondError(req, res, 400, error);
    }
}
async function verificarUltimoPagoController(req, res) {
    try {
        const { idServicio } = req.body;

        const [pago, error] = await PaymentServices.verificarUltimoPago(idServicio);
        if (error) {
            return respondError(req, res, 400, error);
        }

        return respondSuccess(req, res, 200, pago);
    } catch (error) {
        handleError(error, "payment.controller -> verificarUltimoPagoController");
        return respondError(req, res, 500, "Error interno al verificar el pago.");
    }
}
async function actualizarPagoCliente(req, res) {
    try {
        const { idServicio, idCliente } = req.body; 
        const [pago, error] = await PaymentServices.actualizarIdClienteEnPago(idServicio, idCliente);
        if (error) {
            return respondError(req, res, 400, error);
        } 
        return respondSuccess(req, res, 200, pago);
    } catch (error) {
        handleError(error, "payment.controller -> actualizarPagoCliente");
        return respondError(req, res, 500, "Error interno al actualizar el pago.");
    }
}
async function getPaymentByClientId(req, res) {
    try {
        const { idCliente } = req.params;

        if (!idCliente) return respondError(req, res, 400, "No se ha proporcionado el ID del cliente.");

        const [pagos, error] = await PaymentServices.getPaymentsByClientId(idCliente);
        if (error) return respondError(req, res, 400, error);

        return respondSuccess(req, res, 200, pagos);
    } catch (error) {
        handleError(error, "payment.controller -> getPaymentByClientId");
        return respondError(req, res, 500, "Error interno al obtener los pagos del cliente.");
    }
}

export default { 
    createPayment,
    getPayments,
    getPaymentById,
    deletePayment,
    updatePayment,
    webhook,
    refundPayment,
    verificarUltimoPagoController,
    actualizarPagoCliente,
    getPaymentByClientId,
}; 
