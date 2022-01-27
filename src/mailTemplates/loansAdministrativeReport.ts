import { LoanedBook } from "../entity/loanedBook.entity";
import { User } from "../entity/user.entity";

export const loansAdministrativeReport = (
    loanedBooks: LoanedBook[],
    allUsers: User[]
) => {
    const message = `<!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <style>
                body {
                    font-family: "Lucida Sans", "Lucida Sans Regular",
                        "Lucida Grande", "Lucida Sans Unicode", Geneva, Verdana,
                        sans-serif;
                }
            </style>
            <title>Document</title>
        </head>
        <body
            style="
                display: grid;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                border: 1px solid black;
                border-radius: 1.15em;
                min-width: 50em;
                max-width: 50em;
                margin: 2em auto;
            "
        >
            <header
                style="
                    border: 2px solid rgba(128, 128, 128, 0.288);
                    padding: 2em;
                    border-radius: 1em;
                    color: rgba(128, 128, 128, 0.616);
                    display: flex;
                    align-items: center;
                "
            >
                <h1 style="text-align: center">Loaned Books Reminder</h1>
            </header>
    
            <main style="margin-top: 1.5em; padding: 0em 0.5em">
                <div>
                <p>For Administrative purposes, we'd like to attach a list of every book that has been loaned. </p>
                    <p>Below you'll find detailed: Title, Book Id, Book loan date, Book due date and the Id of the user that has it. </p>
                </div>
                <br />
                <div>
                    <table class="books-table">
                        ${loanedBooks.map((book) => {
                            const currentUser = allUsers.filter((user) => {
                                return user.id === book.userId;
                            });

                            console.log(currentUser);

                            const bookDueDate = new Date(
                                parseInt(book.loanExpireDate)
                            );
                            const bookLoanDate = new Date(
                                parseInt(book.loanDate)
                            );
                            const currenDate = new Date(Date.now());

                            return `<tr>
                            <td style="color: ${
                                bookDueDate < currenDate ? "red" : "black"
                            }; padding: 0em 0.5em; border-right: 1px solid black">Title: <b>${
                                book.title
                            }</b></td>
                            <td style="color: ${
                                bookDueDate < currenDate ? "red" : "black"
                            }; padding: 0em 0.5em; border-right: 1px solid black">Book ID: <b>${
                                book.bookId
                            }</b></td>
                            <td style="color: ${
                                bookDueDate < currenDate ? "red" : "black"
                            }; padding: 0em 0.5em; border-right: 1px solid black">Loan date: <b>${bookLoanDate.toLocaleDateString(
                                "en-ar",
                                {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                }
                            )}</b></td>
                            <td style="color: ${
                                bookDueDate < currenDate ? "red" : "black"
                            }; padding: 0em 0.5em; border-right: 1px solid black">Loan expire date: <b>${bookDueDate.toLocaleDateString(
                                "en-ar",
                                {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                }
                            )}</b></td>
                            <td style="color: ${
                                bookDueDate < currenDate ? "red" : "black"
                            }; padding: 0em 0.5em">User ID for the Loan: <b>${
                                book.userId
                            }</b></td>
                            <td style="color: ${
                                bookDueDate < currenDate ? "red" : "black"
                            }; padding: 0em 0.5em">User ID for the Loan: <b>${
                                currentUser[0].email
                            }</b></td>
                            </tr>`;
                        })}
                    </table>
                </div>
                <br />
                <hr />
                <br />
                <p>
                The color RED signifies books that have been loaned beyond its due Date. For these cases a $500 fine is billed to the user.
                </p>
            </main>
    
            <footer style="min-width: 15vw; margin-top: 5em; padding: 0em 2em"">
                <p>Best regards!</p>
                <p>Planet Books Team</p>
            </footer>
        </body>
    </html>`;

    return message;
};
