"use strict";   

import mongoose from "mongoose";

const DisponibilidadSchema = new mongoose.Schema({
    
    trabajador: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true,
    },

    dia: {
        type: String,
        required: true,
    },

    hora_inicio: {
        type: String,
        required: true,
    },

    hora_fin: {
        type: String,
        required: true,
    },

    excepciones:  [{
        inicio_no_disponible: { 
            type: String 
        },  
        fin_no_disponible: { 
            type: String 
        }   
    }]

});


const Disponibilidad = mongoose.model('Disponibilidad', DisponibilidadSchema);
export default Disponibilidad;




