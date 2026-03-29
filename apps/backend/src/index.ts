import cors from '@fastify/cors';
import fastifyEnv from '@fastify/env';
import Fastify from 'fastify';
import { chatRoute } from './routes/chat.js';

const schema = {
    type: 'object',
    required: ['LLM_API_KEY'],
    properties: {
        PORT: { type: 'string', default: '3001' },
        HOST: { type: 'string', default: '0.0.0.0' },
        LLM_API_KEY: { type: 'string' },
        LLM_BASE_URL: { type: 'string', default: 'https://api.openai.com/v1' },
        LLM_MODEL: { type: 'string', default: 'gpt-4o-mini' }
    }
};

const fastify = Fastify({
    logger: {
        transport: {
            targets: [
                {
                    target: 'pino-pretty',
                    options: {
                        colorize: true,
                        translateTime: 'SYS:HH:MM:ss',
                        ignore: 'pid,hostname'
                    },
                    level: 'info'
                },
                {
                    target: 'pino-roll',
                    options: {
                        file: './logs/error.log',
                        mkdir: true,
                        frequency: 'daily',
                        dateFormat: 'yyyy-MM-dd'
                    },
                    level: 'error'
                }
            ]
        }
    }
});

await fastify.register(fastifyEnv, {
    dotenv: true,
    schema
});

await fastify.register(cors, {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
});

fastify.register(chatRoute);

fastify.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
});

const start = async () => {
    try {
        const port = parseInt(process.env.PORT || '3002', 10);
        const host = process.env.HOST || '0.0.0.0';
        await fastify.listen({ port, host });
        console.log(`Server running on http://${host}:${port}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

const shutdown = async (signal: string) => {
    console.log(`\nReceived ${signal}, shutting down gracefully...`);
    await fastify.close();
    process.exit(0);
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

start();
