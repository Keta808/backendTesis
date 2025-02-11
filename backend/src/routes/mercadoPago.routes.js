import { Router } from "express"; 

import mercadoPagoController from "../controllers/mercadoPago.controller.js"; 

const router = Router();

router.post("/crearMercadoPagoAcc", mercadoPagoController.crearMercadoPagoAcc);
router.get("/getMercadoPagoAcc/:idMicroempresa", mercadoPagoController.getMercadoPagoAcc);
router.put("/updateMercadoPagoAcc/:idMicroempresa", mercadoPagoController.updateMercadoPagoAcc);
router.delete("/deleteMercadoPagoAcc/:idMicroempresa", mercadoPagoController.deleteMercadoPagoAcc);
router.get("/getMercadoPagoAccs", mercadoPagoController.getMercadoPagoAccs);
router.post("/generar-url/:idMicroempresa", mercadoPagoController.generarUrlOnBoarding); 
router.post("/onBoarding", mercadoPagoController.onBoarding); 

export default router; 
