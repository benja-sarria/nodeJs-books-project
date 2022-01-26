import { getRepository } from "typeorm";
import { LoanedBook } from "../entity/loanedBook.entity";
import { User } from "../entity/user.entity";
import { loanedBookReminderTemplate } from "../mailTemplates/loanedBookReminder";
import { transporter } from "./emailScheduler";

export const userEmailReminder = async () => {
    const loanedBooksRepository = await getRepository(LoanedBook);
    const userRespository = await getRepository(User);

    const allUsers = await userRespository.find();
    const allLoanedBooks = await loanedBooksRepository.find();

    allUsers.forEach(async (user) => {
        const userHasLoanedBooks = allLoanedBooks.some(
            (book) => book.userId === user.id
        );

        if (!userHasLoanedBooks) {
            return;
        }

        const userLoanedBooks = allLoanedBooks.filter(
            (book) => book.userId === user.id
        );

        const expireDatesArray = userLoanedBooks.map((book) => {
            return parseInt(book.loanExpireDate);
        });

        const pastDueDateBooks = expireDatesArray.filter((date) => {
            const currentDate = new Date(Date.now());
            const dueDate = new Date(date);

            return currentDate > dueDate;
        });

        const fine = 500 * pastDueDateBooks.length;

        // send mail with defined transport object
        const info = await transporter.sendMail({
            from: "Book Administration <planetbooksproject@gmail.com>", // sender address
            to: user.email, // list of receivers
            subject: "Planet Books - Loaned Books Reminder", // Subject line
            html: loanedBookReminderTemplate(fine, userLoanedBooks),
        });
    });
    console.log("Reminder emails sended correctly");
};
