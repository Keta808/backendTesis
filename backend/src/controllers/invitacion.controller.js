import * as InvitacionService from "../services/invitacion.service.js";

/**
 * Controlador para enviar una invitación a un trabajador
 */
export async function enviarInvitacion(req, res) {
    try {
        const { idMicroempresa, email, role } = req.body;
        const result = await InvitacionService.crearInvitacion({ 
            idMicroempresa, 
            email, 
            role,
        });
        return res.status(201).json({ state: "Success", data: result });
    } catch (error) {
        return res.status(400).json({ state: "Error", message: error.message });
    }
}

/**
 * Controlador para aceptar una invitación
 */
export async function aceptarInvitacion(req, res) {
    try {
        console.log("📩 Petición recibida en aceptarInvitacion");
        console.log("📩 Token recibido:", req.params.token);

        const { token } = req.params;
        const { userId } = req.body; // Recibe el ID del usuario desde el frontend

        const result = await InvitacionService.aceptarInvitacion(token, userId);

        return res.status(200).json({ state: "Success", message: result });
    } catch (error) {
        console.error("❌ Error en aceptarInvitacion:", error);
        return res.status(500).json({ state: "Error", message: error.message });
    }
}

/**
 * Controlador para rechazar una invitación
 */
export async function rechazarInvitacion(req, res) {
    try {
        console.log("📩 Petición recibida en rechazarInvitacion");
        console.log("📩 Token recibido:", req.params.token);

        const { token } = req.params;

        const result = await InvitacionService.rechazarInvitacion(token);
        return res.json({ state: "Success", message: result });
    } catch (error) {
        console.error("❌ Error en rechazarInvitacion:", error);
        return res.status(500).json({ state: "Error", message: error.message });
    }
}

/**
 * Controlador para obtener todas las invitaciones pendientes
 */
export async function obtenerInvitaciones(req, res) {
    try {
        const { idMicroempresa } = req.params;
        const result = await InvitacionService.obtenerInvitaciones(idMicroempresa);
        return res.status(200).json({ state: "Success", data: result });
    } catch (error) {
        return res.status(400).json({ state: "Error", message: error.message });
    }
}

export default {
    enviarInvitacion,
    aceptarInvitacion,
    rechazarInvitacion,
    obtenerInvitaciones,
};

