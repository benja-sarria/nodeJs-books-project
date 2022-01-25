import "reflect-metadata";
import { startServer } from "./server";
import { connect } from "./config/typeorm";

// Configuramos nuestro servidor - El puerto debería incluirse en variables de entorno
const main = async () => {
    // Ejecutamos nuestra conexión con la DB
    connect();

    const port: number = 4000;
    const app = await startServer();
    app.listen(port);
    console.log(`App running on port ${port}`);
};

// Inicializamos nuestro servidor
main();
