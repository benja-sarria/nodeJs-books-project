import { environment } from "../config/environment";
import nodemailer from "nodemailer";
import { accountVerificationTemplate } from "../mailTemplates/accountVerificationTemplate";

export async function sendVerificationEmail(email: string, url: string) {
    const transporter = nodemailer.createTransport({
        host: environment.MAILTRAP_HOST,
        port: 465,
        auth: {
            user: environment.MAILTRAP_AUTH_USER,
            pass: environment.MAILTRAP_AUTH_PASS,
        },
    });

    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: "Book Administration <planetbooksproject@gmail.com>", // sender address
        to: email, // list of receivers
        subject: "Planet Books - Account Verification", // Subject line
        html: accountVerificationTemplate(url),
    });
}
