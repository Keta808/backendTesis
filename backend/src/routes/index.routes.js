"use strict";
// Importa el modulo 'express' para crear las rutas
import { Router } from "express";

/** Enrutador de usuarios  */
import userRoutes from "./user.routes.js";

/** Enrutador de microempresas */
import microempresaRoutes from "./microempresa.routes.js";

/** Enrutador de imagenes */
import imageRoutes from "./image.routes.js";

/** Enrutador de invitaciones */
import invitacionRoutes from "./invitacion.routes.js";

/** Enrutador de autenticación */
import authRoutes from "./auth.routes.js";

/** Enrutador de enlaces */

import enlaceRoutes from "./enlace.routes.js"; 

import reservaRoutes from "./reserva.routes.js"; 
import servicioRoutes from "./servicio.routes.js";
import disponibilidadRoutes from "./disponibilidad.routes.js";

import valoracionRoutes from "./valoracion.routes.js";

/** Middleware de autenticación */
import authenticationMiddleware from "../middlewares/authentication.middleware.js";

/** Instancia del enrutador */
const router = Router();

// Define las rutas para los usuarios /api/usuarios
router.use("/users", authenticationMiddleware, userRoutes);
// Define las rutas para la autenticación /api/auth
router.use("/auth", authRoutes);

router.use("/reservas", authenticationMiddleware, reservaRoutes);

// Define las rutas para los enlaces /api/enlaces
router.use("/enlaces", authenticationMiddleware, enlaceRoutes);

// Define las rutas para las microempresas /api/microempresas
router.use("/microempresas", authenticationMiddleware, microempresaRoutes);

import planRoutes from "./plan.routes.js";
router.use("/planes", authenticationMiddleware, planRoutes);
import SuscripcionRoutes from "./suscripcion.routes.js";
router.use("/suscripcion", authenticationMiddleware, SuscripcionRoutes); 


// Define las rutas para las imagenes /api/imagenes
router.use("/imagenes", authenticationMiddleware, imageRoutes);

router.use("/servicios", authenticationMiddleware, servicioRoutes);

router.use("/disponibilidad", authenticationMiddleware, disponibilidadRoutes);

router.use("/valoraciones", authenticationMiddleware, valoracionRoutes);
// Define las rutas para las invitaciones /api/invitaciones
router.use("/invitaciones", authenticationMiddleware, invitacionRoutes);

// Exporta el enrutador
export default router;
