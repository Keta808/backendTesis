/* eslint-disable no-multiple-empty-lines */
/* eslint-disable padded-blocks */
/* eslint-disable camelcase */
/* eslint-disable space-before-blocks */
/* eslint-disable max-len */
/* eslint-disable no-console */
/* eslint-disable quote-props */
/* eslint-disable quotes */
/* eslint-disable comma-dangle */
/* eslint-disable require-jsdoc */
import axios from 'axios';
import Suscripcion from '../models/suscripcion.model.js';
import UserModels from '../models/user.model.js';  
const { User } = UserModels;
import { handleError } from "../utils/errorHandler.js";
import { ACCESS_TOKEN } from '../config/configEnv.js'; 


async function getSuscripciones() {
    try {
        const suscripciones = await Suscripcion.find().populate("idPlan idUser").exec();
        if (!suscripciones || suscripciones.length === 0) {
            return [null, "No hay suscripciones disponibles."];
        }
        return [suscripciones, null];
    } catch (error) {
        handleError(error, "suscripcion.service -> getSuscripciones");
        
    }
}
async function getSuscripcion(id) {
    try {
        if (!id) throw new Error("ID de suscripción no proporcionado.");

        const suscripcion = await Suscripcion.findById(id).populate("idPlan idUser").exec();
        if (!suscripcion) return [null, "La suscripción no existe."];

        return [suscripcion, null];
    } catch (error) {
        handleError(error, "suscripcion.service -> getSuscripcion");
    }
}
// Eliminar una suscripción por ID
async function deleteSuscripcion(id) {
    try {
        if (!id) throw new Error("ID de suscripción no proporcionado.");

        const suscripcion = await Suscripcion.findByIdAndDelete(id).exec();
        if (!suscripcion) return [null, "La suscripción no existe o ya fue eliminada."];

        return [suscripcion, null];
    } catch (error) {
        handleError(error, "suscripcion.service -> deleteSuscripcion");
    }
}
async function updateSuscripcion(id, suscripcion) {
    try {
        if (!id) return [null, "Error al actualizar la suscripción: ID no proporcionado."];

        const existingSuscripcion = await Suscripcion.findById(id).exec();
        if (!existingSuscripcion) return [null, "La suscripción no existe."];

        const { idUser, idPlan, estado, preapproval_id, cardTokenId } = suscripcion;

        const updatedSuscripcion = await Suscripcion.findByIdAndUpdate(
            id,
            { idUser, idPlan, estado, preapproval_id, cardTokenId },
            { new: true }
        ).exec();

        return [updatedSuscripcion, null];
    } catch (error) {
        handleError(error, "suscripcion.service -> updateSuscripcion");
    }
} 
// Funciones para obtener datos dinámicos de Mercado Pago
// funcion para obtener issuers (bancos emisores)
async function getIssuers(paymentMethodId){
    try { 
        
    const response = await axios.get(
        `https://api.mercadopago.com/v1/payment_methods/card_issuers?payment_method_id=${paymentMethodId}`,
        {
            headers: {
                Authorization: `Bearer ${ACCESS_TOKEN}`,
            },
        }
    );

    return response.data; // Devuelve la lista de emisores
} catch (error) {
    console.error(`Error al obtener emisores:`, error.response?.data || error.message);
    handleError(error, "suscripcion.service -> getIssuers");
}
}  
// Funcion para obtener tipos de identificacion
async function getIdentificationTypes(){
    try {
        const response = await axios.get(
            "https://api.mercadopago.com/v1/identification_types",
            {
                headers: {
                    Authorization: `Bearer ${ACCESS_TOKEN}`,
                },
            }
        );

        return response.data; // Devuelve los tipos de identificación
    } catch (error) {
        console.error(`Error al obtener tipos de identificación:`, error.response?.data || error.message);
        handleError(error, "suscripcion.service -> getIdentificationTypes");
    }
}
async function getSuscripcionBypreapprovalId(preapprovalId) {
    try {
        if (!preapprovalId) throw new Error("ID de suscripción no proporcionado.");

        const suscripcion = await Suscripcion.findOne({ preapproval_id: preapprovalId }).exec();
        if (!suscripcion) return [null, "La suscripción no existe."];

        return [suscripcion, null];
    } catch (error) {
        handleError(error, "suscripcion.service -> getSuscripcionBypreapprovalId");
        return [null, error.message];
    }
} 
async function updateCardTokenByUserId(cardTokenId, idUser) { 
    try {
        
        if (!cardTokenId) return [null, "Error al actualizar la suscripción: cardTokenId no proporcionado."];
        if (!idUser || !idUser._id) throw new Error("Error al actualizar la suscripción: usuario no proporcionado.");
        const suscripcion = await Suscripcion.findOne({ 
            idUser, 
            estado: "active" // Buscar solo suscripciones activas
        }).exec(); 
        if (!suscripcion) {
            return [null, "No se encontró una suscripción activa para este usuario."];
        } 
        // Actualizar el cardTokenId en la BD
        suscripcion.cardTokenId = cardTokenId;
        await suscripcion.save();
        return [suscripcion, null];
    } catch (error) {
        console.error(`Error al actualizar el cardtoken de la suscripción:`, error.response?.data || error.message);
        handleError(error, "suscripcion.service -> updateCardTokenByUserId");
        return [null, error.response?.data || error.message];
    }
}
// Funciones Tarjeta-Suscripcion Mercado Pago 
async function updateSuscripcionCard(preapprovalId, newCardTokenId, idUser){ 
    try {
        if (!preapprovalId) return [null, "Error al actualizar la suscripción: ID de preaprobación no proporcionado."];
        if (!newCardTokenId) return [null, "Error al actualizar la suscripción: cardTokenId no proporcionado."];
        if (!idUser ) return [null, "Error al actualizar la suscripción: usuario no proporcionado."];
       // Buscar la suscripción en la BD
       const suscripcion = await Suscripcion.findOne({ 
        preapproval_id: preapprovalId, 
        idUser,
        estado: "authorized" || "pending", 
        }).exec();

        if (!suscripcion) {
            return [null, "No se encontró una suscripción asociada al ID proporcionado y al usuario."];
        }
       
        // SOLICITUD MERCADO PAGO
        const response = await axios.put(`https://api.mercadopago.com/preapproval/${preapprovalId}`,
            {
                card_token_id: newCardTokenId
            },
            {
                headers: {
                    Authorization: `Bearer ${ACCESS_TOKEN}`,
                    "Content-Type": "application/json",
                },
            }

        );
        console.log("Respuesta de Mercado Pago:", response.data);
        if (!response.data) {
            console.error("Error al actualizar la suscripción:", response.data);
            return [null, "Error al actualizar la suscripción."];
        } 
        // Actualizar el cardTokenId en la BD
        suscripcion.cardTokenId = newCardTokenId;
        await suscripcion.save();

        return [suscripcion, null];
        
    } catch (error){
        console.error(`Error al actualizar la suscripción:`, error.response?.data || error.message);
        handleError(error, "suscripcion.service -> updateSuscripcionCard");
        return [null, error.response?.data || error.message];
    }
}
// Funcion para generar cardTokenId
async function cardForm(paymentData){
    try { 
        // DEPURACION: Mostrar datos recibidos
        console.log("CARD FORM: Datos recibidos para generar cardTokenId:", paymentData);
        const { cardNumber, expirationMonth, expirationYear, securityCode, cardholderName, issuer, identificationType, identificationNumber, cardholderEmail } = paymentData; 
        const payload = {
            card_number: cardNumber, 
            expiration_month: parseInt(expirationMonth, 10),
            expiration_year: parseInt(expirationYear, 10),
            security_code: securityCode,
            cardholder: {
                name: cardholderName,
                email: cardholderEmail,
                identification: {
                    type: identificationType,
                    number: identificationNumber,
                },    
            }, 
            issuer_id: issuer,
        }; 
        console.log("Datos enviados a Mercado Pago:", payload);
        const response = await axios.post(
            "https://api.mercadopago.com/v1/card_tokens",
            payload,
            {
                headers: {
                    Authorization: `Bearer ${ACCESS_TOKEN}`,
                    "Content-Type": "application/json",
                },
            }
        );
        console.log("CARD FORM: Respuesta de Mercado Pago:", response.data);
        if (response.data.id) {
            return response.data.id; // Devuelve el cardTokenId
        } else {
            console.error("No se generó un cardToken válido:", response.data);
            return null;
        }
    } catch (error) {
        console.error(`Error al generar cardTokenId:`, error.response?.data || error.message);
        handleError(error, "suscripcion.service -> cardForm");
    }
}

// Funcion obtener Suscripcion 
async function obtenerSuscripcion(plan, user, cardTokenId, payer_email){
    try {
        if (!plan || !user || !cardTokenId || !payer_email){
            return [null, "Faltan datos para crear la suscripción."];
        }
        // Verificar si ya existe una suscripción activa para el usuario
        const suscripcionActiva = await Suscripcion.findOne({
            idUser: user.id,
            estado: "authorized",
        }).exec();

        if (suscripcionActiva) {
            return [null, "El usuario ya tiene una suscripción activa."];
        }
        // Configurar fechas de la suscripción
        const startDate = new Date(); // Fecha actual
        const endDate = new Date();
        endDate.setMonth(startDate.getMonth() + 1); // Duración: 1 mes   
       
        // DEPURACION: Mostrar datos de la suscripción
        console.log("SERVICES OBTENER SUS: Datos de suscripción:", { plan, user, cardTokenId, payer_email });


        const preapprovalData = {
            preapproval_plan_id: plan.mercadoPagoId,
            reason: "Suscripción Plan Reserbio",
            payer_email: payer_email,
            card_token_id: cardTokenId.cardTokenId,
            auto_recurring: {
                frequency: 1,
                frequency_type: "months",
                start_date: startDate.toISOString(),
                end_date: endDate.toISOString(),
                transaction_amount: plan.precio,
                currency_id: "CLP",
            },
            back_url: "https://www.mercadopago.com",
            status: "authorized",
        };  

        console.log("SERVICES OBTENER SUS: Datos de preaprobación:", preapprovalData); 
        const cleanData = JSON.parse(JSON.stringify(preapprovalData));

        console.log("Datos limpios enviados a Mercado Pago:", cleanData);
        // SOLICITUD MERCADO PAGO 
        const response = await axios.post(
            "https://api.mercadopago.com/preapproval",
            preapprovalData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${ACCESS_TOKEN}`,
                },
            }
        ); 
        if (!response.data || !response.data.id) {
            return [null, "Error en la respuesta de Mercado Pago."];
        } 
        console.log("SERVICE OBTENER SUS: Respuesta de Mercado Pago:", response.data);
        console.log("SERVICE OBTENER SUS:ID de preaprobación:", response.data.id);
        
        // Obtener preaproval_id de la respuesta
        const preapprovalId = response.data.id;
        // Convertir a trabajador 
        const [newTrabajador, errorChange] = await userChange(user.id);
        if (errorChange) return [null, errorChange];

        // Guardar la suscripción en la BD
        const [suscripcion, error] = await crearSuscripcion({
            idUser: newTrabajador._id,
            idPlan: plan._id,
            estado: "authorized",
            preapproval_id: preapprovalId,
            cardTokenId: cardTokenId.cardTokenId,
        });

        if (error) {
            return [null, "Error al guardar la suscripción en la BD."];
        }

        return [suscripcion, null];



    } catch (error){
        console.error(`Error al crear la suscripción:`, error.response?.data || error.message);
        handleError(error, "suscripcion.service -> crearSuscripcion");
        return [null, error.response?.data || error.message];
    }
} 
async function userChange(id){
    try {
        if (!id) return [null, "ID de usuario no proporcionado."];
     
        const user = await UserModels.Cliente.findById(id); 
        if (!user) return [null, "El usuario (cliente) no existe."]; 

        

        const newTrabajador = new UserModels.Trabajador({
            nombre: user.nombre,
            apellido: user.apellido,
            telefono: user.telefono,
            email: user.email,
            password: user.password,
            state: user.state,
            kind: "Trabajador",
        });
        await newTrabajador.save(); 
        console.log("Usuario cambiado a trabajador:", newTrabajador);
        return [newTrabajador, null];
    } catch (error){
        console.error(`Error al cambiar el usuario a trabajador:`, error.response?.data || error.message);
        handleError(error, "suscripcion.service -> userChange");
        return [null, error.response?.data || error.message];
    }
}

// Funciones Mercado pago 
// Funcion para Buscar en las Suscripciones 
async function searchSuscripcionMP(params){ 
    try {
         // SOLICITUD MERCADO PAGO 
         const response = await axios.get(
            "https://api.mercadopago.com/preapproval/search",
            
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${ACCESS_TOKEN}`,
                },
                params,
            },
            

        );
        // Retorna los resultados encontrados
        return [response.data.results, null];
    } catch (error) {
        console.error(`Error al buscar la suscripción:`, error.response?.data || error.message);
        handleError(error, "suscripcion.service -> searchSuscripcionMP");
        return [null, error.response?.data || error.message];
    }
}   
// Funcion getSuscripcionById
async function getSuscripcionById(id){
    try {
        if (!id) return [null, "id de suscripción no proporcionado."]; 

         // SOLICITUD MERCADO PAGO 
         const response = await axios.get(
            "https://api.mercadopago.com/preapproval/{id}",
            id,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${ACCESS_TOKEN}`,
                },
            }
        ); 
        return [response.data, null];
    } catch (error) {
        console.error(`Error al obtener la suscripción:`, error.response?.data || error.message);
        handleError(error, "suscripcion.service -> getSuscripcionById");
        return [null, error.response?.data || error.message];
    }
} 
// Funcion para Actualizar Suscripcion 
async function updateSuscripcionMP(id, data){
    try {
        if (!id) throw new Error("ID de suscripción no proporcionado.");
        // SOLICITUD MERCADO PAGO 
        const response = await axios.put(
            "https://api.mercadopago.com/preapproval/{id}",
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${ACCESS_TOKEN}`,
                },
            }
        );
        return [response.data, null];
    } catch (error) {
        console.error(`Error al actualizar la suscripción:`, error.response?.data || error.message);
        handleError(error, "suscripcion.service -> updateSuscripcion");
        return [null, error.response?.data || error.message];
    }
}

async function crearSuscripcion(suscripcionData){
    try {
        const { idUser, idPlan, estado, preapproval_id, cardTokenId } = suscripcionData;
        const nuevaSuscripcion = new Suscripcion({ idUser, idPlan, estado, preapproval_id, cardTokenId });
        console.log("Datos de suscripción a guardar:", { idUser, idPlan, estado, preapproval_id, cardTokenId });
        await nuevaSuscripcion.save();
        return [nuevaSuscripcion, null];
    } catch (error) {
        handleError(error, "suscripcion.service -> crearSuscripcion");
    }   
}

async function cancelarSuscripcion(idUser, preapprovalId) {
    try {
        if (!preapprovalId) return [null, "Error al cancelar la suscripción: ID de preaprobación no proporcionado."];
        
        const suscripcion = await Suscripcion.findOne({ preapproval_id: preapprovalId, estado: "authorized" }).exec();
        console.log("Suscripcion encontrada:", suscripcion);
        if (!suscripcion) {
            return [null, "No se encontró una suscripción activa con este ID."];
        }

        if (String(suscripcion.idUser) !== String(idUser)) {
            return [null, "No tienes permiso para cancelar la suscripcion."];
        }
        console.log("Datos de la suscripción a cancelar:", suscripcion); 
        const response = await axios.put(
            `https://api.mercadopago.com/preapproval/${preapprovalId}`,
            { status: "cancelled" },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${ACCESS_TOKEN}`,
                },
            }
        );
        console.log("Mercado pago response: ", response); 
        if (!response || response.status !== 200) {
            return [null, "Error al cancelar la suscripción en Mercado Pago."];
        }

       
        // 🔹 2️⃣ Eliminar el usuario Trabajador de la BD
        const userTrabajador = await UserModels.User.findOne({ _id: idUser, kind: "Trabajador" }).exec();
        if (userTrabajador) {
            await User.deleteOne({ _id: idUser });
            console.log(`Usuario Trabajador con ID ${idUser} eliminado.`);
        } else {
            console.log(`No se encontró usuario Trabajador con ID ${idUser}.`);
        }

        // 🔹 3️⃣ Eliminar la suscripción de la BD
        await Suscripcion.deleteOne({ preapproval_id: preapprovalId });
        console.log("Suscripción eliminada de la BD.");

        return ["Suscripción cancelada y cuenta de Trabajador eliminada.", null];
    } catch (error) {
        console.error(`Error al cancelar la suscripción:`, error.response?.data || error.message);
        handleError(error, "suscripcion.service -> cancelarSuscripcion");
        return [null, error.response?.data || error.message];
    }
} 
async function sincronizarEstados() {
    try {
         // Obtener suscripciones que no están canceladas ni expiradas
         const suscripciones = await Suscripcion.find({
            estado: { $nin: ["cancelled", "expired"] },
        }).exec(); 
        if (suscripciones.length === 0) {
            console.log("No hay suscripciones pendientes de sincronización.");
            return;
        }
        console.log(`Sincronizando ${suscripciones.length} suscripciones...`); 

        for (const suscripcion of suscripciones) {
            try {
                // Consultar Mercado Pago
                const response = await axios.get(
                    `https://api.mercadopago.com/preapproval/${suscripcion.preapproval_id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${ACCESS_TOKEN}`,
                        },
                    }
                );

                const estadoMP = response.data.status; // Estado de MP
                const fechaFinMP = response.data.auto_recurring?.end_date
                    ? new Date(response.data.auto_recurring.end_date)
                    : null;

                // Determinar el nuevo estado
                if (estadoMP === "cancelled") {
                    suscripcion.estado = "cancelled";
                } else if (estadoMP === "paused") {
                    suscripcion.estado = "paused";
                } else if (["authorized", "active"].includes(estadoMP)) {
                    suscripcion.estado = "authorized";
                } else if (fechaFinMP && new Date() > fechaFinMP) {
                    suscripcion.estado = "expired";
                }

                // Guardar cambios en la base de datos si hay modificaciones
                await suscripcion.save();
                console.log(`Suscripción ${suscripcion._id} actualizada a estado: ${suscripcion.estado}`);
            } catch (error) {
                console.error(
                    `Error al sincronizar la suscripción ${suscripcion.preapproval_id}:`,
                    error.response?.data || error.message
                );
            }
        }

        console.log("Sincronización de estados completada.");
    } catch (error) {
        console.error("Error al sincronizar estados:", error.response?.data || error.message);
        handleError(error, "suscripcion.service -> sincronizarEstados");
    }
} 

// Funcion getUserSubscription 
async function getUserSubscription(idUser){ 
    try {
        if (!idUser) return [null, "Error al obtener la suscripción: ID de usuario no proporcionado."];
        const suscripcion = await Suscripcion.findOne({ idUser, estado: { $in: ["authorized"] } }).exec();
        if (!suscripcion) return [null, "No se encontró una suscripción para este usuario."]; 
        
        const { preapproval_id } = suscripcion; 
        // Solicitar detalles de la suscripción a Mercado Pago
        const response = await axios.get(
            `https://api.mercadopago.com/preapproval/${preapproval_id}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${ACCESS_TOKEN}`,
                },
            }
        );
        return [response.data, null];

    } catch (error) {
        console.error(`Error al obtener la suscripción:`, error.response?.data || error.message);
        handleError(error, "suscripcion.service -> getUserSubscription");
        return [null, error.response?.data || error.message];
    }

}


 
export default { crearSuscripcion, cancelarSuscripcion, getSuscripciones, getSuscripcion, 
deleteSuscripcion, updateSuscripcion, sincronizarEstados, 
getIssuers, getIdentificationTypes, cardForm, obtenerSuscripcion, 
searchSuscripcionMP, getSuscripcionById, updateSuscripcionMP, getSuscripcionBypreapprovalId, updateSuscripcionCard, updateCardTokenByUserId,
getUserSubscription, userChange,
}; 
