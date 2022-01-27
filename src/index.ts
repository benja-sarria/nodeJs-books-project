import "reflect-metadata";
import { startServer } from "./server";
import { connect } from "./config/typeorm";
import { emailScheduler } from "./utils/emailScheduler";
import { userEmailReminder } from "./utils/userEmailReminder";
import { administrationEmailReminder } from "./utils/administrationEmailReminder";

// Configuramos nuestro servidor - El puerto debería incluirse en variables de entorno
const main = async () => {
    // Ejecutamos nuestra conexión con la DB
    connect();

    // emailScheduler(`0 */1 * * * *`, userEmailReminder, "Loan due dates");
    // emailScheduler(
    //     `0 */1 * * * *`,
    //     administrationEmailReminder,
    //     "Administrative report"
    // );

    const port: number = 4000;
    const app = await startServer();
    app.listen(port);
    console.log(`App running on port ${port}`);
};

// Inicializamos nuestro servidor
main();
