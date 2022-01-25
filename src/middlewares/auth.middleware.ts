import { MiddlewareFn } from "type-graphql";
import { verify } from "jsonwebtoken";
import { Response, Request } from "express";
import { environment } from "../config/environment";
import { User } from "../entity/user.entity";

// Por convención agregamos la I delante del nombre de una interface
export interface IContext {
    req: Request;
    res: Response;
    payload: { userId: string };
}

export const isAuth: MiddlewareFn<IContext> = ({ context }, next) => {
    try {
        const bearerToken = context.req.headers["authorization"];

        if (!bearerToken) {
            const error = new Error();
            error.message = "Unauthorized";
            throw error;
        }

        // La estructura del token: Bearer aasdasdasgjokfngjnsdfkjn - Divido al primer espacio que haya
        const jwt = bearerToken.split(" ")[1];
        const payload = verify(jwt, environment.JWT_SECRET);

        // Agregamos el payload a nuestro contexto
        context.payload = payload as any;
    } catch (error: any) {
        throw new Error(error.message);
    }
    return next();
};
