import cloudinary from "../config/cloudinary.js";
import { respondSuccess, respondError } from "../utils/resHandler.js";
import Microempresa from "../models/microempresa.model.js";
import upload from "../middlewares/upload.middleware.js";

/**
 * Maneja la subida de una foto de perfil a Cloudinary
 */
async function uploadFotoPerfil(req, res) {
    try {
        // console.log("Archivo recibido:", req.file);
        // console.log("Datos recibidos:", req.body);
        if (!req.file) {
            return respondError(req, res, 400, "No se ha proporcionado ninguna imagen");
        }

        const { microempresaId } = req.body;
        console.log("🖼️ Recibido microempresaId:", microempresaId);

        if (!microempresaId) {
            return res.status(400).json({ error: "No se proporcionó el ID de la microempresa." });
        }

        // Subir la imagen a Cloudinary
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: "microempresas", // Carpeta en Cloudinary
                    resource_type: "image",
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                },
            );
            stream.end(req.file.buffer);
        });

        // Actualizar la Microempresa con la foto de perfil
        const microempresa = await Microempresa.findById(req.body.microempresaId);
        if (!microempresa) {
            return respondError(req, res, 404, "Microempresa no encontrada");
        }

        microempresa.fotoPerfil = {
            url: result.secure_url,
            public_id: result.public_id,
        };

        await microempresa.save();

        return respondSuccess(req, res, 200, { url: result.secure_url });
    } catch (error) {
        console.error(error);
        return respondError(req, res, 500, "Error al subir la imagen");
    }
}

/**
 * Maneja la eliminación de la foto de perfil de Cloudinary
 */
async function deleteFotoPerfil(req, res) {
    try {
        const { public_id, microempresaId } = req.body;

        // Validar que se hayan proporcionado los datos requeridos
        if (!public_id || !microempresaId) {
            console.error("Datos recibidos en req.body:", req.body);
            return respondError(req, res, 400, "Falta el public_id o el microempresaId");
        }

        // Eliminar la imagen de Cloudinary
        const result = await cloudinary.uploader.destroy(public_id);
        if (result.result !== "ok") {
            console.error("Error en la respuesta de Cloudinary:", result);
            return respondError(req, res, 500, "Error al eliminar la imagen de Cloudinary");
        }

        // Buscar la microempresa en la base de datos
        const microempresa = await Microempresa.findById(microempresaId);
        if (!microempresa) {
            return respondError(req, res, 404, "Microempresa no encontrada");
        }

        console.log("Valor almacenado de public_id en la base de datos:", microempresa.fotoPerfil?.public_id);
        console.log("Valor recibido en la solicitud:", public_id);

        // Validar si el public_id proporcionado coincide con el almacenado en fotoPerfil
        if (microempresa.fotoPerfil?.public_id !== public_id) {
            console.warn("El public_id no coincide con la foto de perfil actual");
            return respondError(req, res, 400, "La foto de perfil no coincide con el public_id proporcionado");
        }

        // Eliminar la referencia a la foto de perfil
        microempresa.fotoPerfil = { url: null, public_id: null };

        // Guardar los cambios
        await microempresa.save();

        // Responder con éxito
        return respondSuccess(req, res, 200, "Foto de perfil eliminada correctamente");
    } catch (error) {
        console.error(error);
        return respondError(req, res, 500, "Error al eliminar la foto de perfil");
    }
}

/**
 * Maneja la subida de imágenes adicionales a galeria de Cloudinary
 */
async function uploadImagenes(req, res) {
    try {
        console.log("📥 Petición recibida en /imagenes/portafolio");
        console.log("📥 Archivos recibidos en el backend:", req.files);
        console.log("📥 Body recibido:", req.body);

        if (!req.files || req.files.length === 0) {
            return respondError(req, res, 400, "No se ha proporcionado ninguna imagen");
        }

        // Encuentra la microempresa
        const microempresa = await Microempresa.findById(req.body.microempresaId);
        if (!microempresa) {
            return respondError(req, res, 404, "Microempresa no encontrada");
        }


        // Limitar el número de imágenes
        if (microempresa.imagenes.length + req.files.length > 5) { // Límite de 5 imágenes
            return respondError(req, res, 400, "Has alcanzado el límite de imágenes permitidas");
        }

        const uploadedImages = [];

        for (const file of req.files) {
            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        folder: "microempresas/imagenes",
                        resource_type: "image",
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    },
                );
                stream.end(file.buffer);
            });

            console.log("✅ Imagen subida con éxito:", result.secure_url);

            // Añadir cada imagen subida al array de imágenes
            uploadedImages.push({
                url: result.secure_url,
                public_id: result.public_id,
            });

            // Añadir la imagen a la microempresa
            microempresa.imagenes.push({
                url: result.secure_url,
                public_id: result.public_id,
            });
        }

        await microempresa.save();
        console.log("✅ Microempresa actualizada con nuevas imágenes.");

        return respondSuccess(req, res, 200, {
            message: "Imágenes subidas con éxito",
            data: uploadedImages,
        });
    } catch (error) {
        console.error(error);
        return respondError(req, res, 500, "Error al subir las imágenes");
    }
}


/**
 * Maneja la eliminación de una imagen
 */
async function eliminarImagen(req, res) {
    try {
        // console.log("Archivos recibidos:", req.files);
        // console.log("Datos recibidos:", req.body);
        const { public_id, microempresaId } = req.body;

        // Validar que se haya proporcionado el public_id y microempresaId
        if (!public_id || !microempresaId) {
            return respondError(req, res, 400, "Falta el public_id o el microempresaId");
        }

        // Eliminar la imagen de Cloudinary
        const result = await cloudinary.uploader.destroy(public_id);
        if (result.result !== "ok") {
            return respondError(req, res, 500, "Error al eliminar la imagen de Cloudinary");
        }

        // Buscar la microempresa y eliminar la imagen del array de imágenes
        const microempresa = await Microempresa.findById(microempresaId);
        if (!microempresa) {
            return respondError(req, res, 404, "Microempresa no encontrada");
        }

        // Filtrar la imagen eliminada del array de imágenes
        microempresa.imagenes = microempresa.imagenes.filter(
            (img) => img.public_id !== public_id
        );

        // Guardar los cambios
        await microempresa.save();

        return respondSuccess(req, res, 200, "Imagen eliminada correctamente");
    } catch (error) {
        console.error(error);
        return respondError(req, res, 500, "Error al eliminar la imagen");
    }
}

export default {
    uploadFotoPerfil,
    deleteFotoPerfil,
    uploadImagenes,
    eliminarImagen,
};
