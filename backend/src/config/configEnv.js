"use strict";
// Import the 'path' module to get the absolute path of the .env file
import path from "node:path"; 
import { fileURLToPath } from "node:url"; 
const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename); 


/** Get the absolute path of the .env file. */
const envFilePath = path.resolve(__dirname, ".env");
// Load environment variables from the .env file
import dotenv from "dotenv";
dotenv.config({ path: envFilePath });

/** Server port */
export const PORT = process.env.PORT;
/** Server host */
export const HOST = process.env.HOST;
/** Database URL */
export const DB_URL = process.env.DB_URL;
/** Access token secret */
export const ACCESS_JWT_SECRET = process.env.ACCESS_JWT_SECRET;
/** Refresh token secret */
export const REFRESH_JWT_SECRET = process.env.REFRESH_JWT_SECRET;

// MercadoPago API credentials
export const ACCESS_TOKEN = process.env.ACCESS_TOKEN; 
export const CLIENT_SECRET = process.env.CLIENT_SECRET;
export const CLIENT_ID = process.env.CLIENT_ID;

// Mercado Pago Redirect URI
export const MP_REDIRECT_URI = process.env.MP_REDIRECT_URI; 
// Webhook URL
export const MP_WEBHOOK_URL = process.env.MP_WEBHOOK_URL;

