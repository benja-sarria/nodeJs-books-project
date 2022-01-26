import { v4 } from "uuid";
import { getRepository } from "typeorm";
import { User } from "../entity/user.entity";

export const createConfirmationUrl = async (userId: number | undefined) => {
    try {
        const userRepository = await getRepository(User);
        const user = await userRepository.findOne({ where: { id: userId } });

        if (!user?.verificationUrl) {
            const token = v4();

            await userRepository.save({
                id: user?.id,
                verificationUrl: token,
            });

            return `http://localhost:4000/user/confirm/${token}`;
        } else {
            const token = user.verificationUrl;

            return `http://localhost:4000/user/confirm/${token}`;
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
};
