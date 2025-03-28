import InvitacionService from "../services/invitacion.service.js";
import mongoose from "mongoose";

/**
 * Controlador para enviar una invitación a un trabajador con código numérico
 */
async function enviarInvitacion(req, res) {
    try {
        const { idMicroempresa, email } = req.body;
        const result = await InvitacionService.crearInvitacion({ idMicroempresa, email });
        return res.status(201).json({ state: "Success", data: result });
    } catch (error) {
        return res.status(400).json({ state: "Error", message: error.message });
    }
}

/**
 * Controlador para verificar si un código de invitación es válido
 */
async function verificarCodigoInvitacion(req, res) {
    try {
        let { codigo } = req.params;
        codigo = codigo.trim(); // 🔹 Eliminar espacios en blanco

        const result = await InvitacionService.verificarCodigoInvitacion(codigo);

        if (!result.success) {
            return res.status(400).json({ state: "Error", message: result.message });
        }

        return res.status(200).json({ state: "Success", data: result.data });
    } catch (error) {
        console.error("❌ Error al verificar código de invitación:", error.message);
        res.status(500).json({ message: "Error interno del servidor" });
    }
}

/**
 * Controlador para aceptar una invitación con código numérico
 */
async function aceptarInvitacion(req, res) {
    try {
        console.log("📩 Petición recibida en aceptarInvitacion");

        const { codigo } = req.params;
        const { userId } = req.body; // Recibe el ID del usuario desde el frontend

        const result = await InvitacionService.aceptarInvitacionPorCodigo(codigo, userId);

        return res.status(200).json({ state: "Success", message: result });
    } catch (error) {
        console.error("❌ Error en aceptarInvitacion:", error);
        return res.status(500).json({ state: "Error", message: error.message });
    }
}

/**
 * Controlador para obtener todas las invitaciones pendientes
 */
async function obtenerInvitaciones(req, res) {
    try {
        const { idMicroempresa } = req.params;
        const result = await InvitacionService.obtenerInvitaciones(idMicroempresa);
        return res.status(200).json({ state: "Success", data: result });
    } catch (error) {
        return res.status(400).json({ state: "Error", message: error.message });
    }
}

/**
 * Controlador para eliminar una invitación por su ID
 */
export async function eliminarInvitacion(req, res) {
    try {
        const { id } = req.params;
        console.log("id recibido en controller:", id);
        // Validar si el ID es un ObjectId válido ANTES de llamar al servicio
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "ID de invitación no válido." });
            console.log("Error en controller: ID de invitación no válido.");
        }

        const result = await InvitacionService.eliminarInvitacion(id);

        return res.status(200).json(result); // Retorna el mensaje de éxito
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export default {
    enviarInvitacion,
    verificarCodigoInvitacion,
    aceptarInvitacion,
    obtenerInvitaciones,
    eliminarInvitacion,
};


