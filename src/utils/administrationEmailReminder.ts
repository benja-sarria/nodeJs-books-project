import { getRepository } from "typeorm";
import { environment } from "../config/environment";
import { LoanedBook } from "../entity/loanedBook.entity";
import { User } from "../entity/user.entity";
import { loansAdministrativeReport } from "../mailTemplates/loansAdministrativeReport";
import { transporter } from "./emailScheduler";

export const administrationEmailReminder = async () => {
    const loanedBooksRepository = await getRepository(LoanedBook);
    const userRepository = await getRepository(User);

    const allLoanedBooks = await loanedBooksRepository.find();
    const allUsers = await userRepository.find();

    if (allLoanedBooks.length === 0) {
        return;
    }

    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: "Book Administration <planetbooksproject@gmail.com>", // sender address
        to: environment.MAILTRAP_AUTH_USER, // list of receivers
        subject: "Planet Books - Loaned Books Reminder", // Subject line
        html: loansAdministrativeReport(allLoanedBooks, allUsers),
    });
    console.log("Administrative email has been sent");
};
