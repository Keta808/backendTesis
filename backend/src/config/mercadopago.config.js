import mercadopago from "mercadopago";
import { ACCESS_TOKEN, CLIENT_SECRET, CLIENT_ID } from "./configEnv.js";

// Configura el token de acceso como una propiedad
mercadopago.configurations = {
  access_token: ACCESS_TOKEN,
  client_secret: CLIENT_SECRET,
  client_id: CLIENT_ID,
};

export default mercadopago;
