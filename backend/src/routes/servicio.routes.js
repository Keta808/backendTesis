/* eslint-disable max-len */
"use strict";

import { Router } from "express";

import servicioController from "../controllers/servicio.controller.js"; 
import { isAdmin, isCliente, isTrabajador } from "../middlewares/authorization.middleware.js";


import authentificationMiddleware from "../middlewares/authentication.middleware.js"; 
import verificarAdminMicroempresa from "../middlewares/verificarAdminM.middleware.js";


const router = Router(); 

router.use(authentificationMiddleware); 

router.get("/", servicioController.getServicios); 
router.post("/", verificarAdminMicroempresa, servicioController.createServicio);
router.delete("/:id", verificarAdminMicroempresa, servicioController.deleteServicio);
router.put("/:id", verificarAdminMicroempresa, servicioController.updateServicio);
router.get("/servicio/:id", servicioController.getServicioById); 
router.get("/servicios/:id", servicioController.getServiciosByMicroempresaId);
router.post("/servicio/:id", verificarAdminMicroempresa, servicioController.configurarPorcentajeAbono);
router.post("/servicios/:id", servicioController.calcularMontoAbono);

router.get("/servicio/:id/microempresa", servicioController.getMicroempresaIdByServicioId);


export default router; 

