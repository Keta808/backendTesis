// Importa el archivo 'configEnv.js' para cargar las variables de entorno
import { PORT, HOST } from "./config/configEnv.js";
// Importa el módulo 'cors' para agregar los CORS
import cors from "cors";
// Importa el módulo 'express' para crear la aplicación web
import express, { urlencoded, json } from "express";
// Importamos morgan para ver las peticiones que se hacen al servidor
import morgan from "morgan";
// Importa el módulo 'cookie-parser' para manejar las cookies
import cookieParser from "cookie-parser";
/** El enrutador principal */
import indexRoutes from "./routes/index.routes.js";
// Importa el archivo 'configDB.js' para crear la conexión a la base de datos
import { setupDB } from "./config/configDB.js";
// Importa el handler de errores
import { handleFatalError, handleError } from "./utils/errorHandler.js";
import { createState, createUsers, createRoles } from "./config/initialSetup.js";
import { startActualizarReservasJob } from "./jobs/actualizarReservas.js";
/**
 * Inicia el servidor web
 */
async function setupServer() {
  try {
    /** Instancia de la aplicación */
    const server = express();
    server.disable("x-powered-by");

    // Agregamos los CORS
    server.use(cors({ credentials: true, origin: true }));

    // Agrega el middleware para el manejo de datos en formato URL
    server.use(urlencoded({ extended: true }));

    // Agrega el middleware para el manejo de datos en formato JSON
    server.use(json());

    // Agregamos el middleware para el manejo de cookies
    server.use(cookieParser());

    // Agregamos morgan para ver las peticiones que se hacen al servidor
    server.use(morgan("dev"));

    // Agrega el enrutador principal al servidor
    server.use("/api", indexRoutes);

    // Ruta de prueba para verificar si el backend está funcionando
    server.get("/api/ping", (req, res) => {
      res.json({ message: "🏓 Pong! El servidor está funcionando." });
    });

    // Inicia el servidor en el puerto especificado
    const port = PORT || 3000;
    server.listen(port, "0.0.0.0", () => {
      console.log(`✅ Servidor corriendo en http://${HOST || "0.0.0.0"}:${port}/api`);
    });

  } catch (err) {
    handleError(err, "/server.js -> setupServer");
  }
}

/**
 * Inicia la API
 */
async function setupAPI() {
  try {
    // Inicia la conexión a la base de datos
    await setupDB();
    // Inicia el servidor web
    await setupServer();
     // Inicia el cron job para actualizar reservas vencidas
     startActualizarReservasJob();
    // Inicia la creación de los estados
    await createState();
    // Inicia la creación del usuario admin y user
    await createUsers();
    // Inicia la creación de los roles
    await createRoles();
  } catch (err) {
    handleFatalError(err, "/server.js -> setupAPI");
  }
}

// Inicia la API
setupAPI()
  .then(() => console.log("✅ API Iniciada exitosamente"))
  .catch((err) => handleFatalError(err, "/server.js -> setupAPI"));
