import { Mutation, Resolver, Arg, InputType, Field, Query } from "type-graphql";
import { Author } from "../entity/author.entity";
import { getRepository, Repository } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { Length, IsString } from "class-validator";

@InputType()
class AuthorInput {
    @Field()
    @Length(3, 64)
    @IsString()
    fullName!: string;
}

@InputType()
class AuthorIdInput {
    @Field(() => Number)
    id!: number;
}

@InputType()
class AuthorUpdateInput {
    @Field()
    @Length(3, 64)
    fullName?: string;

    @Field(() => Number)
    id!: number;
}

@Resolver()
export class AuthorResolver {
    authorRepository: Repository<Author>;

    constructor() {
        this.authorRepository = getRepository(Author);
    }

    // Método para crear Autores
    // Las Mutations se encargan de guardar o generar datos en nuestra DB
    @Mutation(() => Author)
    async createAuthor(
        @Arg("input", () => AuthorInput) input: AuthorInput
    ): Promise<Author | undefined> {
        try {
            const createdAuthor = await this.authorRepository.insert({
                fullName: input.fullName,
            });
            const result = await this.authorRepository.findOne(
                createdAuthor.identifiers[0].id
            );
            return result;
        } catch (error) {
            console.error(error);
        }
    }

    @Query(() => [Author])
    async getAllAuthors(): Promise<Author[]> {
        return await this.authorRepository.find({ relations: ["books"] });
    }

    @Query(() => Author)
    async getOneAuthor(
        @Arg("input", () => AuthorIdInput) input: AuthorIdInput
    ): Promise<Author | undefined> {
        try {
            const author = await this.authorRepository.findOne(input.id);
            if (!author) {
                const error = new Error();
                error.message = "Author doesn't exist.";
                throw error;
            }
            return author;
        } catch (error: any) {
            throw new Error(error);
        }
    }

    @Mutation(() => Author)
    async updateOneAuthor(
        @Arg("input", () => AuthorUpdateInput) input: AuthorUpdateInput
    ): Promise<Author | undefined> {
        const authorExists = await this.authorRepository.findOne(input.id);

        // en caso de que no exista, termina la ejecución
        if (!authorExists) {
            throw new Error("Author doesn't exists");
        }

        // en caso de encontrarlo, lo actualiza
        const updatedAuthor = await this.authorRepository.save({
            id: input.id,
            fullName: input.fullName,
        });

        return await this.authorRepository.findOne(updatedAuthor.id);
    }

    @Mutation(() => Boolean)
    async deleteOneAuthor(
        @Arg("input", () => AuthorIdInput) input: AuthorIdInput
    ): Promise<Boolean> {
        await this.authorRepository.delete(input.id);
        return true;
    }
}
