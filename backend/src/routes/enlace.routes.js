"use strict";

import { Router } from "express";

import enlaceController from "../controllers/enlace.controller.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";

import authentificationMiddleware from "../middlewares/authentication.middleware.js";

const router = Router();    

router.use(authentificationMiddleware); 

router.get("/", enlaceController.getEnlaces);
router.post("/", enlaceController.createEnlace);
router.delete("/:id", enlaceController.deleteEnlace);
router.put("/:id", enlaceController.updateEnlace);
router.get("/microempresa/:id", enlaceController.getTrabajadoresPorMicroempresa);
router.put("/update/:id", enlaceController.updateEnlaceParcial);

export default router;
