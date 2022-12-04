import Fastify from "fastify";
import jwt from "@fastify/jwt";
import cors from '@fastify/cors'
import { poolRoutes } from "./routes/pool";
import { userRoutes } from "./routes/user";
import { authRoutes } from "./routes/auth";
import { gameRoutes } from "./routes/game";
import { guessRoutes } from "./routes/guess";

async function bootstrap() {

    const fastify = Fastify({
        logger: true,
    })

    await fastify.register(cors, {
        origin: true,
    })

    //Em produção essa chave precisa ser criada em uma variável de ambiente
    await fastify.register(jwt, {
        secret: 'teste123',
    })

    await fastify.register(poolRoutes)
    await fastify.register(userRoutes)
    await fastify.register(guessRoutes)
    await fastify.register(gameRoutes)
    await fastify.register(authRoutes)

    await fastify.listen({ port: 3333, host: '0.0.0.0' })
}

bootstrap() 