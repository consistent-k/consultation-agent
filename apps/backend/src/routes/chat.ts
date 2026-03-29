import { UIMessage } from 'ai';
import { type FastifyPluginAsync } from 'fastify';
import { streamDiagnosisResponse } from '../ai/index.js';

interface ChatBody {
    messages: UIMessage[];
}

export const chatRoute: FastifyPluginAsync = async (fastify) => {
    fastify.options('/api/chat', async (_request, reply) => {
        reply
            .header('Access-Control-Allow-Origin', '*')
            .header('Access-Control-Allow-Methods', 'POST, OPTIONS')
            .header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
            .status(204)
            .send();
    });

    fastify.post<{ Body: ChatBody }>('/api/chat', async (request, reply) => {
        try {
            reply.raw.setHeader('Access-Control-Allow-Origin', '*');
            reply.raw.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
            reply.raw.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

            const result = await streamDiagnosisResponse(request.body.messages);

            result.pipeUIMessageStreamToResponse(reply.raw, {
                sendReasoning: true,
                onError: (error: unknown) => {
                    fastify.log.error(error);
                    return error instanceof Error ? error.message : '请求失败';
                }
            });

            return reply;
        } catch (error) {
            fastify.log.error(error);
            reply.status(500).send({ message: '内部服务器错误' });
        }
    });
};
