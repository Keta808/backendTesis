import { Router } from "express"; 

import mercadoPagoController from "../controllers/mercadoPago.controller.js"; 

const router = Router();

router.post("/crearMercadoPagoAcc", mercadoPagoController.crearMercadoPagoAcc);
router.get("/getMercadoPagoAcc/:id", mercadoPagoController.getMercadoPagoAcc);
router.put("/updateMercadoPagoAcc/:id", mercadoPagoController.updateMercadoPagoAcc);
router.delete("/deleteMercadoPagoAcc/:id", mercadoPagoController.deleteMercadoPagoAcc);
router.get("/getMercadoPagoAccs", mercadoPagoController.getMercadoPagoAccs);

// Mercado Pago Routes
router.post("/generar-url", mercadoPagoController.generarUrlOnBoarding); 
router.get("/callback", mercadoPagoController.onBoarding);  
router.post("/refreshtoken/:id", mercadoPagoController.refreshToken); 
router.get("/redirect", mercadoPagoController.obtenerRedirect);

router.post("/servicio/:idServicio", mercadoPagoController.crearPreferenciaServicio);

export default router; 
