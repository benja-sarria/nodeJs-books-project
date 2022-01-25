import { createConnection } from "typeorm";
import path from "path";
import { environment } from "./environment";

export const connect = async () => {
    // CreateConnection nos permite configurar la conección con la base de datos
    await createConnection({
        // Le pasamos el tipo de DB que vamos a usar
        type: "postgres",
        port: Number(environment.DB_PORT),
        username: environment.DB_USERNAME,
        password: environment.DB_PASSWORD,
        database: environment.DB_DATABASE,
        // Entities es un listado de rutas locales donde van a estar las entidades que creamos - DIRNAME me da la ruta actual, pero necesito indicar un nivel anterior - Para eso usamos path
        entities: [path.join(__dirname, "../entity/**/**.ts")],
        synchronize: true,
    });
    console.log("Database is connected correctly.");
};
