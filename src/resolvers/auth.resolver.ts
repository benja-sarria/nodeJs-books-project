import {
    Arg,
    Field,
    InputType,
    Mutation,
    ObjectType,
    Resolver,
} from "type-graphql";
import { getRepository, Repository } from "typeorm";
import { User } from "../entity/user.entity";
import { Length, IsEmail } from "class-validator";
import { hash, compareSync } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { environment } from "../config/environment";

@InputType()
class UserInput {
    @Field()
    @Length(3, 64)
    fullName!: string;

    @Field()
    @IsEmail()
    email!: string;

    @Field()
    @Length(8, 254)
    password!: string;
}

@InputType()
class LoginInput {
    @Field()
    @IsEmail()
    email!: string;

    @Field()
    password!: string;
}

@ObjectType()
class LoginResponse {
    @Field()
    userId!: number;

    @Field()
    // JSON Web Token
    jwt!: string;
}

@Resolver()
export class AuthResolver {
    userRepository: Repository<User>;

    constructor() {
        this.userRepository = getRepository(User);
    }

    @Mutation(() => User)
    async register(
        @Arg("input", () => UserInput) input: UserInput
    ): Promise<User | undefined> {
        try {
            const { fullName, email, password } = input;

            const userExists = await this.userRepository.findOne({
                where: { email },
            });

            // Verificamos que el usuario no exista tomando email como identificador
            if (userExists) {
                const error = new Error();
                error.message = "Email is already registered.";
                throw error;
            }

            // Hasheamos la Password para no guardarla como tal en la DB
            const hashedPassword = await hash(password, 10);

            const newUser = await this.userRepository.insert({
                fullName,
                email,
                password: hashedPassword,
            });

            return this.userRepository.findOne(newUser.identifiers[0].id);
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    @Mutation(() => LoginResponse)
    async login(@Arg("input", () => LoginInput) input: LoginInput) {
        try {
            const { email, password } = input;

            const userFound = await this.userRepository.findOne({
                where: { email },
            });

            if (!userFound) {
                const error = new Error();
                error.message = "Invalid Credentials.";
                throw error;
            }

            // Para controlar la Password, necesitamos importar un método para deshashear la que tenemos en la DB
            const isValidPassword: Boolean = compareSync(
                password,
                userFound.password
            );

            if (!isValidPassword) {
                const error = new Error();
                error.message = "Invalid Credentials.";
                throw error;
            }

            const jwt: string = sign(
                { id: userFound.id },
                environment.JWT_SECRET
            );

            return {
                userId: userFound.id,
                jwt: jwt,
            };
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}
