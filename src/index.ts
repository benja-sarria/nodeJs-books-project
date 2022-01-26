import "reflect-metadata";
import { startServer } from "./server";
import { connect } from "./config/typeorm";
import { emailScheduler } from "./utils/emailScheduler";
import { userEmailReminder } from "./utils/userEmailReminder";

// Configuramos nuestro servidor - El puerto debería incluirse en variables de entorno
const main = async () => {
    // Ejecutamos nuestra conexión con la DB
    connect();

    emailScheduler(1, userEmailReminder, "Loan due dates");

    const port: number = 4000;
    const app = await startServer();
    app.listen(port);
    console.log(`App running on port ${port}`);
};

// Inicializamos nuestro servidor
main();
