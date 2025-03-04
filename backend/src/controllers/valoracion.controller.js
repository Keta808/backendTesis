import valoracionService from "../services/valoracion.service.js";

/**
 * Obtiene todas las valoraciones de una microempresa.
 * @param {Request} req - Petición HTTP con `microempresaId` como parámetro.
 * @param {Response} res - Respuesta HTTP.
 */
async function getValoracionesPorMicroempresa(req, res) {
    try {
        const { microempresaId } = req.params;
        console.log("microempresaId", microempresaId);
        const [valoraciones, error] = await valoracionService.getValoracionesPorMicroempresa(microempresaId);

        if (error) return res.status(404).json({ message: error });

        return res.status(200).json(valoraciones);
    } catch (error) {
        console.error("Error en getValoracionesPorMicroempresa:", error);
        return res.status(500).json({ message: "Error interno al obtener las valoraciones" });
    }
}

/**
 * Obtiene todas las valoraciones de un trabajador específico.
 * @param {Request} req - Petición HTTP con `trabajadorId` como parámetro.
 * @param {Response} res - Respuesta HTTP.
 */
async function getValoracionesPorTrabajador(req, res) {
    try {
        const { trabajadorId } = req.params;
        const [valoraciones, error] = await valoracionService.getValoracionesPorTrabajador(trabajadorId);

        if (error) return res.status(404).json({ message: error });

        return res.status(200).json(valoraciones);
    } catch (error) {
        console.error("Error en getValoracionesPorTrabajador:", error);
        return res.status(500).json({ message: "Error interno al obtener las valoraciones del trabajador" });
    }
}

/**
 * Crea una nueva valoración.
 * @param {Request} req - Petición HTTP con datos de la valoración en el cuerpo.
 * @param {Response} res - Respuesta HTTP.
 */
async function crearValoracion(req, res) {
    try {
        const [nuevaValoracion, error] = await valoracionService.crearValoracion(req.body);

        if (error) return res.status(400).json({ message: error });

        return res.status(201).json(nuevaValoracion);
    } catch (error) {
        console.error("Error en crearValoracion:", error);
        return res.status(500).json({ message: "Error interno al crear la valoración" });
    }
}

/**
 * Elimina una valoración por ID.
 * @param {Request} req - Petición HTTP con `valoracionId` como parámetro.
 * @param {Response} res - Respuesta HTTP.
 */
async function eliminarValoracion(req, res) {
    try {
        const { valoracionId } = req.params;
        const [valoracionEliminada, error] = await valoracionService.eliminarValoracion(valoracionId);

        if (error) return res.status(404).json({ message: error });

        return res.status(200).json({ message: "Valoración eliminada con éxito" });
    } catch (error) {
        console.error("Error en eliminarValoracion:", error);
        return res.status(500).json({ message: "Error interno al eliminar la valoración" });
    }
}

async function getValoracionPromedioPorMicroempresa(req, res) {
    try {
        const { microempresaId } = req.params;
        const [promedio, error] = await valoracionService.getValoracionPromedioPorMicroempresa(microempresaId);

        if (error) return res.status(404).json({ message: error });

        return res.status(200).json({ microempresaId, promedio });
    } catch (error) {
        console.error("Error en getValoracionPromedioPorMicroempresa:", error);
        return res.status(500).json({ message: "Error interno al obtener la valoración promedio" });
    }
}

// verificar si existe una valoracion para una reserva

async function existeValoracionPorReserva(req, res) {
    try {
        const { reservaId } = req.params;
        const existe = await valoracionService.existeValoracionPorReserva(reservaId);
        return res.status(200).json({ existe });
    } catch (error) {
        console.error("Error en existeValoracionPorReserva:", error);
        return res.status(500).json({ message: "Error interno al verificar la existencia de la valoración" });
    }
}

export default {
    getValoracionPromedioPorMicroempresa,
    getValoracionesPorMicroempresa,
    getValoracionesPorTrabajador,
    crearValoracion,
    eliminarValoracion,
    existeValoracionPorReserva,
    
};
