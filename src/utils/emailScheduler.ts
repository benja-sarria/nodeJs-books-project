import cron from "node-cron";
import nodemailer from "nodemailer";
import { getRepository } from "typeorm";
import { environment } from "../config/environment";
import { LoanedBook } from "../entity/loanedBook.entity";
import { User } from "../entity/user.entity";
import { loanedBookReminderTemplate } from "../mailTemplates/loanedBookReminder";

export const transporter = nodemailer.createTransport({
    host: environment.MAILTRAP_HOST,
    port: 465,
    auth: {
        user: environment.MAILTRAP_AUTH_USER,
        pass: environment.MAILTRAP_AUTH_PASS,
    },
});

export const emailScheduler = async (
    periodicity: string,
    callback: Function,
    reason: string
) => {
    console.log(`Scheduler reminder service started - Basis: ${reason}`);

    cron.schedule(periodicity, async () => {
        callback();
    });
};
