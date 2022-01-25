import express from "express";
import { ApolloServer } from "apollo-server-express";
import { BookResolver } from "./resolvers/book.resolver";
import { buildSchema } from "type-graphql";
import { AuthorResolver } from "./resolvers/author.resolver";
import { AuthResolver } from "./resolvers/auth.resolver";
import { UserResolver } from "./resolvers/user.resolver";

export const startServer = async () => {
    // Inicializamos el servidor http
    const app = express();

    // Creamos el endpoint con apollo para que se encargue de la API de GraphQL
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [
                BookResolver,
                AuthorResolver,
                AuthResolver,
                UserResolver,
            ],
        }),
        context: ({ req, res }) => ({ req, res }),
    });

    await apolloServer.start();

    // Configuramos nuestro servidor Apollo
    apolloServer.applyMiddleware({ app, path: "/graphql" });

    return app;
};
