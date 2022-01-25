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
import { hash } from "bcryptjs";

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

    /*   @Mutation()
    async recoverPassword() {} */

    @Mutation(() => RecoverResponse)
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
}
