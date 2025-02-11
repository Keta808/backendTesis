import Invitacion from "../models/invitacion.model.js";
import Enlace from "../models/enlace.model.js";
import Microempresa from "../models/microempresa.model.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import crypto from "crypto";
import mongoose from "mongoose";

dotenv.config(); // Cargar variables de entorno

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

/**
 * Genera un token aleatorio para la invitación
 */
const generateToken = () => crypto.randomBytes(32).toString("hex");

/**
 * Crea una nueva invitación para un trabajador
 */
export async function crearInvitacion({ idMicroempresa, email }) {
    try {
        // Verificar que la microempresa existe
        const microempresa = await Microempresa.findById(idMicroempresa);
        if (!microempresa) throw new Error("La microempresa no existe");

        // Verificar si ya tiene 10 trabajadores
        const totalTrabajadores = await Enlace.countDocuments({ id_microempresa: idMicroempresa });
        if (totalTrabajadores >= 10) throw new Error("La microempresa ya alcanzó el límite de 10 trabajadores");

        // Crear el token único para la invitación
        const token = generateToken();
        console.log("🔑 Token generado en backend:", token);

        // Crear la invitación con estado "pendiente"
        const nuevaInvitacion = await Invitacion.create({
            idMicroempresa,
            email,
            id_role: new mongoose.Types.ObjectId("67a4f4fd19fd800efa096295"), // ID del rol "Trabajador"
            estado: "pendiente",
            token,
            fechaExpiracion: new Date(Date.now() + 24 * 60 * 60 * 1000), // Expira en 24h
        });

        // 📩 **Generar el enlace deep link con el esquema correcto**
        const deepLink = `reserbio://invitaciones/aceptar/${token}`;

        // 📩 **Enviar email de invitación con el deep link**
        // 📩 **Enviar email de invitación con el deep link clickeable**
        // 📩 **Enviar email de invitación con el deep link clickeable**
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Invitación a unirse a una microempresa",
            html: `
                <p>Has sido invitado a unirte a la microempresa <strong>${microempresa.nombre}</strong>.</p>
                <p>Para aceptar la invitación, <strong>haz clic en el siguiente botón:</strong></p>
                <p>
                <a href="reserbio://invitaciones/aceptar/${token}" 
                    style="background-color: #008CBA; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                    Aceptar Invitación
                </a>
                </p>
                <p>Si el botón no funciona, copia y pega esta URL en tu navegador:</p>
                <p style="word-wrap: break-word;"> <strong>reserbio://invitaciones/aceptar/${token}</strong> </p>
            `,
        });

        console.log("📩 Invitación enviada a:", email, "🔗 Deep Link:", deepLink);

        return { message: "Invitación enviada con éxito", data: nuevaInvitacion };
    } catch (error) {
        console.error("❌ Error al enviar la invitación:", error.message);
        throw new Error(error.message);
    }
}



/**
 * Obtiene una invitación por su token
 */
export async function obtenerInvitacionPorToken(token) {
    return await Invitacion.findOne({ token });
}

/**
 * Acepta una invitación y añade al trabajador a la microempresa
 */
export async function aceptarInvitacion(token, userId) {
    try {
        const invitacion = await obtenerInvitacionPorToken(token);
        if (!invitacion) throw new Error("Invitación no encontrada");

        const microempresa = await Microempresa.findById(invitacion.idMicroempresa);
        if (!microempresa) {
            throw new Error("La microempresa asociada a la invitación no existe.");
        }

        // Verificar si ya expiró
        if (new Date() > invitacion.fechaExpiracion) {
            invitacion.estado = "expirada";
            await invitacion.save();
            throw new Error("La invitación ha expirado");
        }

        // Crear enlace de trabajador
        await Enlace.create({
            id_trabajador: userId,
            id_role: invitacion.id_role,
            id_microempresa: invitacion.idMicroempresa,
            fecha_inicio: new Date(),
            estado: true,
        });

        // Actualizar estado de la invitación
        invitacion.estado = "aceptada";
        await invitacion.save();

        // Enviar correo de confirmación
        await enviarCorreoConfirmacion(invitacion.email, "aceptada", microempresa.nombre);

        return { message: "Invitación aceptada y trabajador añadido" };
    } catch (error) {
        throw new Error(error.message);
    }
}

/**
 * Rechaza una invitación
 */
export async function rechazarInvitacion(token) {
    try {
        const invitacion = await Invitacion.findOne({ token });

        if (!invitacion) {
            throw new Error("Invitación no encontrada");
        }

        const microempresa = await Microempresa.findById(invitacion.idMicroempresa);
        if (!microempresa) {
            throw new Error("La microempresa asociada a la invitación no existe.");
        }

        // Cambiar el estado de la invitación a "rechazada"
        invitacion.estado = "rechazada";
        await invitacion.save();

        // Enviar correo de confirmación
        await enviarCorreoConfirmacion(invitacion.email, "rechazada", microempresa.nombre);

        return { message: "Invitación rechazada exitosamente" };
    } catch (error) {
        throw new Error(error.message);
    }
}


/**
 * Obtiene las invitaciones pendientes de una microempresa
 */
export async function obtenerInvitaciones(idMicroempresa) {
    try {
        const invitaciones = await Invitacion.find({ idMicroempresa, estado: "pendiente" });
        return invitaciones;
    } catch (error) {
        throw new Error(error.message);
    }
}

/**
 *   Envia un correo al usuario dependiendo del estado de la invitación
 */
async function enviarCorreoConfirmacion(email, estado, microempresaNombre) {
    let subject = "";
    let message = "";

    switch (estado) {
        case "aceptada":
            subject = "Invitación aceptada";
            message = `Has aceptado la invitación para unirte a ${microempresaNombre}. Ya puedes acceder a la plataforma.`;
            break;
        case "rechazada":
            subject = "Invitación rechazada";
            message = `Has rechazado la invitación para unirte a ${microempresaNombre}. Si fue un error, puedes solicitar otra invitación.`;
            break;
        case "expirada":
            subject = "Invitación expirada";
            message = `Tu invitación para unirte a ${microempresaNombre} ha expirado. Si deseas unirte, solicita una nueva invitación.`;
            break;
        default:
            return;
    }

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject,
        text: message,
    });
}

