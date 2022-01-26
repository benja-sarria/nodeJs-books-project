import {
    Mutation,
    Resolver,
    Arg,
    InputType,
    Field,
    Query,
    UseMiddleware,
    Ctx,
} from "type-graphql";
import { getRepository, Repository } from "typeorm";
import { Book } from "../entity/book.entity";
import { Author } from "../entity/author.entity";
import { Length } from "class-validator";
import { IContext, isAuth } from "../middlewares/auth.middleware";
import { ShowLoanedBooks } from "./author.resolver";

@InputType()
class BookInput {
    @Field()
    @Length(3, 64)
    title!: string;

    @Field()
    author!: number;
}

@InputType()
class BookUpdateInput {
    @Field(() => String, { nullable: true })
    @Length(3, 64)
    title?: string;

    @Field(() => Number, { nullable: true })
    author?: number;
}

@InputType()
class BookUpdateParsedInput {
    @Field(() => String, { nullable: true })
    @Length(3, 64)
    title?: string;

    @Field(() => Author, { nullable: true })
    author?: Author;
}

@InputType()
class BookIdInput {
    @Field(() => Number)
    id!: number;
}
@InputType()
class BookTitleInput {
    @Field(() => String)
    title!: string;
}
@InputType()
class BookAuthorInput {
    @Field(() => String)
    fullName!: string;
}

// @Resolver() es un decorador experimental
@Resolver()
export class BookResolver {
    bookRepository: Repository<Book>;
    authorRepository: Repository<Author>;

    constructor() {
        this.bookRepository = getRepository(Book);
        this.authorRepository = getRepository(Author);
    }

    @Mutation(() => Book)
    @UseMiddleware(isAuth)
    async createBook(
        @Arg("input", () => BookInput) input: BookInput,
        @Ctx() context: IContext
    ) {
        try {
            console.log(context.payload);

            const author: Author | undefined =
                await this.authorRepository.findOne(input.author);
            if (!author) {
                const error: any = new Error();
                error.message =
                    "The author for this book doesn't exist, please double check.";
                throw error;
            }

            const book = await this.bookRepository.insert({
                title: input.title,
                author: author,
            });

            return await this.bookRepository.findOne(book.identifiers[0].id, {
                relations: ["author", "author.books"],
            });
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    @Query(() => [Book])
    @UseMiddleware(isAuth)
    async getAllBooks(
        @Arg("showLoanedBooks", () => ShowLoanedBooks)
        showLoanedBooks: ShowLoanedBooks
    ): Promise<Book[]> {
        try {
            const allBooks = await this.bookRepository.find({
                relations: ["author", "author.books"],
            });

            if (showLoanedBooks.showLoanedBooks) {
                return allBooks;
            }

            const filteredBooks = allBooks.filter((book) => !book.isLoaned);

            return filteredBooks;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    @Query(() => Book)
    @UseMiddleware(isAuth)
    async getBookById(
        @Arg("input", () => BookIdInput) input: BookIdInput,
        @Arg("showLoanedBooks", () => ShowLoanedBooks)
        showLoanedBooks: ShowLoanedBooks
    ): Promise<Book | undefined> {
        try {
            const book = await this.bookRepository.findOne(input.id, {
                relations: ["author", "author.books"],
            });
            if (!book) {
                const error = new Error();
                error.message = "Book not found.";
                throw error;
            }

            if (showLoanedBooks.showLoanedBooks) {
                return book;
            }

            if (book.isLoaned) {
                const error = new Error();
                error.message = "Book is already loaned";
                throw error;
            }

            return book;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    @Query(() => [Book])
    @UseMiddleware(isAuth)
    async getBookByTitle(
        @Arg("input", () => BookTitleInput) input: BookTitleInput,
        @Arg("showLoanedBooks", () => ShowLoanedBooks)
        showLoanedBooks: ShowLoanedBooks
    ): Promise<Book[] | undefined> {
        try {
            const allBooks = await this.bookRepository.find({
                relations: ["author", "author.books"],
            });

            if (showLoanedBooks.showLoanedBooks) {
                const filteredBooks = allBooks.filter((book) => {
                    return book.title
                        .toLowerCase()
                        .includes(input.title.toLowerCase());
                });
                return filteredBooks;
            }

            const filteredBooks = allBooks.filter((book) => {
                return (
                    book.title
                        .toLowerCase()
                        .includes(input.title.toLowerCase()) && !book.isLoaned
                );
            });

            if (filteredBooks.length === 0) {
                const error = new Error();
                error.message =
                    "We couldn't find any available books with that name";
                throw error;
            }

            return filteredBooks;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    @Query(() => [Book])
    @UseMiddleware(isAuth)
    async getBookByAuthor(
        @Arg("input", () => BookAuthorInput) input: BookAuthorInput,
        @Arg("showLoanedBooks", () => ShowLoanedBooks)
        showLoanedBooks: ShowLoanedBooks
    ): Promise<Book[] | undefined> {
        try {
            const allBooks = await this.bookRepository.find({
                relations: ["author", "author.books"],
            });

            if (showLoanedBooks.showLoanedBooks) {
                const filteredBooks = allBooks.filter((book) => {
                    return book.author.fullName
                        .toLowerCase()
                        .includes(input.fullName.toLowerCase());
                });
                return filteredBooks;
            }

            const filteredBooks = allBooks.filter((book) => {
                return (
                    book.author.fullName
                        .toLowerCase()
                        .includes(input.fullName.toLowerCase()) &&
                    !book.isLoaned
                );
            });

            if (filteredBooks.length === 0) {
                const error = new Error();
                error.message =
                    "We couldn't find any available books for that Author";
                throw error;
            }

            return filteredBooks;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async updateBookById(
        @Arg("bookId", () => BookIdInput) bookId: BookIdInput,
        @Arg("input", () => BookUpdateInput) input: BookUpdateInput
    ): Promise<Boolean> {
        try {
            await this.bookRepository.update(
                bookId.id,
                await this.parseInput(input)
            );
            return true;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async deleteBook(
        @Arg("bookId", () => BookIdInput) bookId: BookIdInput
    ): Promise<Boolean> {
        try {
            const isInDatabase = Boolean(
                await this.bookRepository.findOne(bookId.id)
            );

            console.log(isInDatabase);

            if (!isInDatabase) {
                const error = new Error();
                error.message =
                    "The book you're trying to delete wasn't found on our DB.";
                throw error;
            }

            await this.bookRepository.delete(bookId.id);

            return true;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    private async parseInput(input: BookUpdateInput) {
        try {
            const _input: BookUpdateParsedInput = {};

            if (input.title) {
                _input["title"] = input.title;
            }
            if (input.author) {
                const author = await this.authorRepository.findOne(
                    input.author
                );
                if (!author) {
                    throw new Error("This author doesn't exist.");
                }
                _input["author"] = await this.authorRepository.findOne(
                    input.author
                );
            }
            return _input;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}
