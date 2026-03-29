import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, lastAssistantMessageIsCompleteWithToolCalls } from 'ai';
import { useCallback } from 'react';

export function useDiagnosisChat() {
    const { messages, status, error, sendMessage, addToolOutput, stop, setMessages } = useChat({
        transport: new DefaultChatTransport({
            api: '/api/chat'
        }),
        sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
        async onToolCall({ toolCall }) {
            if (toolCall.dynamic) {
                return;
            }
        }
    });

    const sendUserMessage = useCallback(
        (content: string) => {
            sendMessage({ text: content });
        },
        [sendMessage]
    );

    const confirmToolCall = useCallback(
        (toolCallId: string, toolName: string, output: unknown) => {
            addToolOutput({ tool: toolName, toolCallId, output });
        },
        [addToolOutput]
    );

    const clearChat = useCallback(() => {
        stop();
        setMessages([]);
    }, [stop, setMessages]);

    return {
        messages,
        status,
        error,
        sendMessage: sendUserMessage,
        confirmToolCall,
        clearChat
    };
}
