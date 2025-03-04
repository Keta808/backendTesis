import { Router } from "express"; 
import paymentController from "../controllers/payment.controller.js"; 

const router = Router();

router.post("/webhook", paymentController.webhook);
router.post("/refund/:paymentId", paymentController.refundPayment);
router.post("/verificar-pago", paymentController.verificarUltimoPagoController);
router.post("/actualizar-id-cliente", paymentController.actualizarPagoCliente);
router.get("/payment/:paymentId", paymentController.getPaymentById);
router.get("/payment-cliente/:idCliente", paymentController.getPaymentByClientId);

export default router;
