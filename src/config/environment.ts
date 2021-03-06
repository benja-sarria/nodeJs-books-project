import dotenv from "dotenv";

dotenv.config();

export const environment = {
    PORT: process.env.PORT,
    DB_PORT: process.env.DB_PORT,
    DB_HOST: process.env.DB_HOST,
    DB_USERNAME: process.env.DB_USERNAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_DATABASE: process.env.DB_DATABASE,
    JWT_SECRET: process.env.JWT_SECRET || "Default",
    MAILTRAP_HOST: process.env.MAILTRAP_HOST || "Localhost",
    MAILTRAP_PORT: process.env.MAILTRAP_PORT || 2525,
    MAILTRAP_AUTH_USER: process.env.MAILTRAP_AUTH_USER,
    MAILTRAP_AUTH_PASS: process.env.MAILTRAP_AUTH_PASS,
};
