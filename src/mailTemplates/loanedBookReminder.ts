import { LoanedBook } from "../entity/loanedBook.entity";

export const loanedBookReminderTemplate = (
    fine: number,
    loanedBooks: LoanedBook[]
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
                    Dear user, we'd like to remind you that you have the following
                    books on loan:
                </div>
                <br />
                <div>
                    <table class="books-table">
                        ${loanedBooks.map((book) => {
                            const bookDueDate = new Date(
                                parseInt(book.loanExpireDate)
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
                            </tr>`;
                        })}
                    </table>
                </div>
                <br />
                <hr />
                <br />
                <div
                    style="
                        margin-top: 0.5em;
                        color: rgb(187, 0, 0);
                        padding: 0em 0.5em;
                    "
                >
                    <p>
                        Please remember that if you exceed your return due date,
                        you'll have to pay a fine.
                    </p>
                </div>
                <br />
                <hr />
                <br />
                <div
                    style="
                        margin-top: 0.5em;
                        color: rgb(187, 0, 0);
                        padding: 0em 0.5em;
                    "
                >
                    <p>Your current fine amount sums up:</p>
                    <p style="font-size: 1.25em">$ <b>${fine}</b></p>
                </div>
            </main>
    
            <footer style="min-width: 15vw; margin-top: 5em; padding: 0em 2em"">
                <p>Best regards!</p>
                <p>Planet Books Team</p>
            </footer>
        </body>
    </html>`;

    return message;
};
