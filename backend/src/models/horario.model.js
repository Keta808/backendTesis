// MODELO DE PRUEBA PARA TESTEAR EN BACKEND DE LA APLICACIÓN

"use strict";

import mongoose from "mongoose";

const HorarioSchema = new mongoose.Schema({
    trabajador: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    dia: {
        type: String,
        required: true, // Ejemplo: "Lunes", "Martes"
    },

    bloques: [
        {
            hora_inicio: {
                type: String, // Formato "HH:mm"
                required: true,
            },
            hora_fin: {
                type: String, // Formato "HH:mm"
                required: true,
            }
        }
    ]
});

const Horario = mongoose.model("Horario", HorarioSchema);
export default Horario;
