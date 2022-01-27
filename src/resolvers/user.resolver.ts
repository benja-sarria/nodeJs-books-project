import {
    Arg,
    Ctx,
    Field,
    InputType,
    Mutation,
    ObjectType,
    Resolver,
    UseMiddleware,
} from "type-graphql";
import { getRepository, Repository } from "typeorm";
import { User } from "../entity/user.entity";
import { Length, IsEmail } from "class-validator";
import { hash } from "bcryptjs";
import nodemailer from "nodemailer";
import { environment } from "../config/environment";
import * as crypto from "crypto";
import { randomBytes } from "crypto";
import { emailTemplate } from "../mailTemplates/passwordRecovery";
import { IContext, isAuth } from "../middlewares/auth.middleware";

@InputType()
class changePasswordInput {
    @Field()
    @IsEmail()
    email!: string;

    @Field()
    @Length(8, 254)
    newPassword!: string;
}

@ObjectType()
class RecoverResponse {
    @Field()
    userId!: number;

    @Field()
    passwordReset!: boolean;
}

@Resolver()
export class UserResolver {
    userRepository: Repository<User>;

    constructor() {
        this.userRepository = getRepository(User);
    }

    @Mutation(() => Boolean)
    async recoverPasswordMailer(@Arg("email") email: string) {
        try {
            const userFound = await this.userRepository.findOne({
                where: { email },
            });

            if (!userFound) {
                const error = new Error();
                error.message = "Invalid credentials";
                throw error;
            }

            // Configuramos el transporter de nodemailer
            const transporter = nodemailer.createTransport({
                host: environment.MAILTRAP_HOST,
                port: 465,
                auth: {
                    user: environment.MAILTRAP_AUTH_USER,
                    pass: environment.MAILTRAP_AUTH_PASS,
                },
            });

            // Generamos una clave aleatoria de recuperación
            const recoveryPassword = randomBytes(8).toString("hex");

            // Enviamos el correo
            await transporter.sendMail({
                from: "Book Administration <planetbooksproject@gmail.com>",
                to: email,
                subject: "Planet Books - Password Recovery",
                html: emailTemplate(recoveryPassword),
            });

            // Hasheamos la nueva password
            const hashedPassword = await hash(recoveryPassword, 10);

            await this.userRepository.save({
                id: userFound.id,
                fullName: userFound.fullName,
                email: email,
                password: hashedPassword,
                createdAt: userFound.createdAt,
            });

            return true;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    @Mutation(() => RecoverResponse)
    @UseMiddleware(isAuth)
    async changePassword(
        @Arg("input", () => changePasswordInput) input: changePasswordInput
    ) {
        try {
            const { email, newPassword } = input;

            const userFound = await this.userRepository.findOne({
                where: { email },
            });

            if (!userFound) {
                const error = new Error();
                error.message = "Invalid Credentials.";
                throw error;
            }

            // Hasheamos la nueva password
            const hashedPassword = await hash(newPassword, 10);

            await this.userRepository.save({
                id: userFound.id,
                fullName: userFound.fullName,
                email: email,
                password: hashedPassword,
                createdAt: userFound.createdAt,
            });

            return {
                userId: userFound.id,
                passwordReset: true,
            };
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    @Mutation(() => Boolean)
    async payFinePenalty(@Arg("userEmail") userEmail: string) {
        try {
            const currentUser = await this.userRepository.findOne({
                where: {
                    email: userEmail,
                },
            });

            if (!currentUser?.isPenalized) {
                const error = new Error();
                error.message = "The user has no penalty to be lifted";
                throw error;
            }

            await this.userRepository.save({
                id: currentUser.id,
                isPenalized: false,
            });

            return true;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}
