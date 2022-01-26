import {
    Mutation,
    Resolver,
    Arg,
    InputType,
    Field,
    Query,
    UseMiddleware,
} from "type-graphql";
import { Author } from "../entity/author.entity";
import { getRepository, Repository } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { Length, IsString } from "class-validator";
import { IContext, isAuth } from "../middlewares/auth.middleware";
import { Book } from "../entity/book.entity";

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
class AuthorNameInput {
    @Field(() => String)
    fullName!: string;
}

@InputType()
class AuthorUpdateInput {
    @Field()
    @Length(3, 64)
    fullName?: string;

    @Field(() => Number)
    id!: number;
}

// Para poder mostrar fechas de devolución y en que fue prestado, y cumplir con la consigna de que el usuario solo puede ver los libros disponibles, cree este flag(input), que permite en la query determinar si deben o no mostrarse los libros prestados. Por defecto está en false
@InputType()
export class ShowLoanedBooks {
    @Field(() => Boolean)
    showLoanedBooks?: boolean = false;
}

@Resolver()
export class AuthorResolver {
    authorRepository: Repository<Author>;
    bookRepository: Repository<Book>;

    constructor() {
        this.authorRepository = getRepository(Author);
        this.bookRepository = getRepository(Book);
    }

    // Método para crear Autores
    // Las Mutations se encargan de guardar o generar datos en nuestra DB
    @Mutation(() => Author)
    @UseMiddleware(isAuth)
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
    @UseMiddleware(isAuth)
    async getAllAuthors(
        @Arg("showLoanedBooks", () => ShowLoanedBooks)
        showLoanedBooks: ShowLoanedBooks
    ): Promise<Author[] | undefined> {
        try {
            const allAuthors = await this.authorRepository.find({
                relations: ["books"],
            });

            const allBooks = await this.bookRepository.find({
                relations: ["author", "author.books"],
            });

            if (showLoanedBooks.showLoanedBooks) {
                return allAuthors;
            }

            const authorsWithFilteredBooks = allAuthors.map((author) => {
                return {
                    ...author,
                    books: allBooks.filter(
                        (book) =>
                            author.fullName === book.author.fullName &&
                            !book.isLoaned
                    ),
                };
            });

            return authorsWithFilteredBooks;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    @Query(() => Author)
    @UseMiddleware(isAuth)
    async getOneAuthorById(
        @Arg("input", () => AuthorIdInput) input: AuthorIdInput,
        @Arg("showLoanedBooks", () => ShowLoanedBooks)
        showLoanedBooks: ShowLoanedBooks
    ): Promise<Author | undefined> {
        try {
            const author = await this.authorRepository.findOne(input.id, {
                relations: ["books"],
            });

            const allBooks = await this.bookRepository.find({
                relations: ["author", "author.books"],
            });

            if (!author) {
                const error = new Error();
                error.message = "Author doesn't exist.";
                throw error;
            }

            if (showLoanedBooks.showLoanedBooks) {
                return author;
            }

            const authorWithFilteredBooks = {
                ...author,
                books: allBooks.filter(
                    (book) =>
                        author.fullName === book.author.fullName &&
                        !book.isLoaned
                ),
            };

            return authorWithFilteredBooks;
        } catch (error: any) {
            throw new Error(error);
        }
    }

    @Query(() => [Author])
    @UseMiddleware(isAuth)
    async getAuthorsByName(
        @Arg("input", () => AuthorNameInput) input: AuthorNameInput,
        @Arg("showLoanedBooks", () => ShowLoanedBooks)
        showLoanedBooks: ShowLoanedBooks
    ): Promise<Author[] | undefined> {
        try {
            const allAuthors = await this.authorRepository.find({
                relations: ["books"],
            });

            const allBooks = await this.bookRepository.find({
                relations: ["author", "author.books"],
            });

            const filteredAuthors = allAuthors.filter((author) => {
                return author.fullName
                    .toLowerCase()
                    .includes(input.fullName.toLowerCase());
            });

            if (filteredAuthors.length === 0) {
                const error = new Error();
                error.message = "We couldn't find any actors by that name";
                throw error;
            }

            if (showLoanedBooks.showLoanedBooks) {
                return filteredAuthors;
            }

            const filteredAuthorsWithFilteredBooks = filteredAuthors.map(
                (author) => {
                    return {
                        ...author,
                        id: author.id,
                        books: allBooks.filter(
                            (book) =>
                                author.fullName === book.author.fullName &&
                                !book.isLoaned
                        ),
                    };
                }
            );

            return filteredAuthorsWithFilteredBooks;
        } catch (error: any) {
            throw new Error(error);
        }
    }

    @Mutation(() => Author)
    @UseMiddleware(isAuth)
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
    @UseMiddleware(isAuth)
    async deleteOneAuthor(
        @Arg("input", () => AuthorIdInput) input: AuthorIdInput
    ): Promise<Boolean> {
        try {
            const isInDatabase = Boolean(
                await this.authorRepository.findOne(input.id)
            );

            if (!isInDatabase) {
                const error = new Error();
                error.message =
                    "The author you're trying to delete wasn't found on our DB.";
                throw error;
            }

            await this.authorRepository.delete(input.id);

            return true;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}
