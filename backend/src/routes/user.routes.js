"use strict";
// Importa el modulo 'express' para crear las rutas
import { Router } from "express";

/** Controlador de usuarios */
import usuarioController from "../controllers/user.controller.js";

/** Middlewares de autorización */
import { isAdmin, isTrabajador, isCliente } from "../middlewares/authorization.middleware.js";

/** Middleware de autenticación */
import authenticationMiddleware from "../middlewares/authentication.middleware.js";

/** Instancia del enrutador */
const router = Router();

// 🔓 **Rutas públicas (Sin autenticación)**
router.post("/createcliente", usuarioController.createCliente); // Permitir registro sin autenticación
router.post("/createtrabajador", usuarioController.createTrabajador); // Permitir registro sin autenticación
router.post("/createuser", usuarioController.createUser); // Permitir creación de usuario sin autenticación

// para cambiar la contraseña
router.post("/changepassword", usuarioController.changePassword);

// 🔒 **Aplicar autenticación a todas las rutas siguientes**
router.use(authenticationMiddleware);

// 🔒 **Rutas protegidas**
router.get("/", usuarioController.getUsers);
router.post("/", isAdmin, usuarioController.createAdministrador);
router.get("/:id", isAdmin, usuarioController.getUserById);
router.delete("/:id", isAdmin, usuarioController.deleteUser);
router.get("/trabajador/:id", usuarioController.getTrabajadorById);
router.post("/trabajador/:id", usuarioController.updateTrabajador);
router.get("/cliente/:id", usuarioController.getClienteById);
router.post("/cliente/:id", usuarioController.updateCliente);

// Exporta el enrutador
export default router;
