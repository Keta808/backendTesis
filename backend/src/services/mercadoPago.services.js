/* eslint-disable space-before-blocks */
/* eslint-disable max-len */
/* eslint-disable no-console */
/* eslint-disable camelcase */
/* eslint-disable require-jsdoc */
import axios from "axios";
import MercadoPagoAcc from "../models/mercadoPago.model"; 
import { CLIENT_ID, CLIENT_SECRET } from "../config/mercadoPago.config.js"; 

import { handleError } from "../utils/errorHandler.js";
async function crearMercadoPagoAcc(idMicroempresa) {
    try {
        const newMercadoPagoAcc = new MercadoPagoAcc({ idMicroempresa });   
        await newMercadoPagoAcc.save(); 
        return [newMercadoPagoAcc, null];
    } catch (error) {
        handleError(error, "mercadoPago.service -> crearMercadoPagoAcc");
        return [null, error];
    }
}
async function getMercadoPagoAcc(idMicroempresa) {
    try {
        const mercadoPagoAcc = await MercadoPagoAcc.findOne({ idMicroempresa });
        if (!mercadoPagoAcc ) {
            return [null, "No hay cuanta vinculada para esa microempresa."];
        } 
        return [mercadoPagoAcc, null];
    } catch (error) {
        handleError(error, "mercadoPago.service -> getMercadoPagoAcc");
        return [null, error];
    }
} 
async function updateMercadoPagoAcc(idMicroempresa, data) {
    try {
        const mercadoPagoAcc = await MercadoPagoAcc.findOneAndUpdate({ idMicroempresa }, 
            data, 
        { new: true });
        if (!mercadoPagoAcc) {
            return [null, "No hay cuenta vinculada para esa microempresa."];
        } 
        return [mercadoPagoAcc, null];
    } catch (error) { 
        handleError(error, "mercadoPago.service -> updateMercadoPagoAcc");
        return [null, error];
    }
}
async function deleteMercadoPagoAcc(idMicroempresa) {
    try {
        const mercadoPagoAcc = await MercadoPagoAcc.findOneAndDelete({ idMicroempresa });
        if (!mercadoPagoAcc) {
            return [null, "No hay cuenta vinculada para esa microempresa."];
        } 
        return [mercadoPagoAcc, null];
    } catch (error) {
        handleError(error, "mercadoPago.service -> deleteMercadoPagoAcc");
        return [null, error];
    }
} 
async function getMercadoPagoAccs(){
    try {
        const mercadoPagoAccs = await MercadoPagoAcc.find();
        if (!mercadoPagoAccs) return [null, "No hay cuentas de MercadoPago vinculadas."];
        return [mercadoPagoAccs, null];
    } catch (error) {
        handleError(error, "mercadoPago.service -> getMercadoPagoAccs");
        return [null, error];
    }
}
async function onBoarding(code, idMicroempresa) {
    try {
        const response = await axios.post("https://api.mercadopago.com/oauth/token",
         null,
        { 
         params: {
            client_secret: CLIENT_SECRET,
            code,
            grant_type: "authorization_code",
            redirect_uri: "https://www.mercadopago.com",
            test_token: true,
         }, 
        });
        if (!response.data) {
            return [null, "No se pudo obtener el token de acceso."];
        } 
        console.log("Respuesta MP ONBOARDING: ", response.data);
        const { access_token, refresh_token, user_id, public_key } = response.data; 
        
        const newMercadoPagoAcc = new MercadoPagoAcc( 
            { idMicroempresa },
            {
              accessToken: access_token,
              refreshToken: refresh_token,
              mercadopagoUserId: user_id,
              public_key: public_key,
              mercadopagoAccountStatus: "activa",
            },
            { upsert: true, new: true },
    );

        return [newMercadoPagoAcc, null];
    } catch (error) {
        handleError(error, "mercadoPago.service -> onBoarding");
        return [null, "Error al vincular la cuenta de MercadoPago."];
    } 
} 

async function generarUrlOnBoarding(idMicroempresa) { 
    const redirect_uri = "https://www.mercadopago.com";
    const onBoardingUrl = `https://auth.mercadopago.com/authorization?client_id=${CLIENT_ID}&response_type=code&platform_id=mp&redirect_uri=${redirect_uri}&state=${idMicroempresa}`;
    return onBoardingUrl;
}
// Refund
async function refundPayment(paymentId, amount) {
    
}
export { 
    crearMercadoPagoAcc, 
    getMercadoPagoAcc,
    updateMercadoPagoAcc,
    deleteMercadoPagoAcc, 
    onBoarding,
    generarUrlOnBoarding,
    getMercadoPagoAccs,
    refundPayment,
}; 
