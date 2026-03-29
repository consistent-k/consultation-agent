import { UserOutlined, RobotOutlined, BulbOutlined, MedicineBoxOutlined } from '@ant-design/icons';
import { Bubble, Think } from '@ant-design/x';
import XMarkdown from '@ant-design/x-markdown';
import type { UIMessage } from 'ai';
import { Alert, Avatar, Spin, Typography } from 'antd';
import { useRef, useEffect, useMemo, memo } from 'react';
import { ToolCallConfirmation } from '../ToolCallConfirmation';
import useStyles from './styles';

const { Text } = Typography;

const TOOL_LABELS: Record<string, string> = {
    collectAge: '年龄',
    collectGender: '性别',
    collectSymptoms: '症状',
    collectDuration: '持续时间',
    collectMedicalHistory: '既往病史',
    collectAllergies: '过敏史',
    generateReport: '报告'
};

interface ChatWindowProps {
    messages: UIMessage[];
    status?: 'submitted' | 'streaming' | 'ready' | 'error';
    error?: Error;
    onConfirmToolCall?: (toolCallId: string, toolName: string, output: unknown) => void;
}

const WelcomeScreen = memo(function WelcomeScreen() {
    const { styles, cx } = useStyles();

    return (
        <div className={cx('chat-window-welcomeScreen', styles.toString())}>
            <div className={'chat-window-welcomeAvatarWrap'}>
                <Avatar size={72} shape="square" className={'chat-window-welcomeAvatar'} icon={<MedicineBoxOutlined />} />
            </div>
            <Text strong className={'chat-window-welcomeTitle'}>
                AI 预问诊助手
            </Text>
            <Text className={'chat-window-welcomeDesc'}>您好！我是您的智能健康助手，将协助您完成预问诊信息收集，帮助医生更好地了解您的情况。</Text>
            <div className={'chat-window-welcomeCards'}>
                {[
                    { icon: <BulbOutlined />, label: '描述症状', desc: '告诉我您哪里不舒服' },
                    { icon: <MedicineBoxOutlined />, label: '信息收集', desc: '系统自动记录关键信息' },
                    { icon: <RobotOutlined />, label: '生成报告', desc: '为您整理预问诊摘要' }
                ].map((item, i) => (
                    <div key={i} className={'chat-window-welcomeCard'}>
                        <Avatar size={40} shape="circle" className={'chat-window-welcomeCardIcon'} icon={item.icon} />
                        <Text strong className={'chat-window-welcomeCardLabel'}>
                            {item.label}
                        </Text>
                        <Text className={'chat-window-welcomeCardDesc'}>{item.desc}</Text>
                    </div>
                ))}
            </div>
        </div>
    );
});

export const ChatWindow = memo(function ChatWindow({ messages, status, error, onConfirmToolCall }: ChatWindowProps) {
    const { styles, cx } = useStyles();
    const listRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, [messages]);

    const isLoading = useMemo(() => status === 'submitted' || status === 'streaming', [status]);

    const getTextContent = (msg: UIMessage): string => {
        return msg.parts
            .filter((part) => part.type === 'text')
            .map((part) => (part as { type: 'text'; text: string }).text)
            .join('');
    };

    const getToolParts = (msg: UIMessage) => {
        return msg.parts.filter((part) => part.type.startsWith('tool-'));
    };

    const getReasoningText = (msg: UIMessage): string => {
        return msg.parts
            .filter((part) => part.type === 'reasoning')
            .map((part) => (part as { type: 'reasoning'; text: string }).text)
            .join('');
    };

    return (
        <div ref={listRef} className={cx('chat-window', styles.toString())}>
            {messages.length === 0 && <WelcomeScreen />}

            {error && <Alert type="error" showIcon title="请求失败" description={error.message} className={'chat-window-errorAlert'} />}

            {messages.map((msg, msgIndex) => {
                const textContent = msg.role === 'assistant' ? getTextContent(msg) : '';
                const reasoningText = msg.role === 'assistant' ? getReasoningText(msg) : '';
                const toolParts = msg.role === 'assistant' ? getToolParts(msg) : [];
                const isLastMessage = msgIndex === messages.length - 1;

                if (msg.role === 'user') {
                    const userText = msg.parts
                        .filter((part) => part.type === 'text')
                        .map((part) => (part as { type: 'text'; text: string }).text)
                        .join('');

                    return (
                        <div key={msg.id} className={cx('chat-window-bubbleEnter', 'chat-window-bubbleRow', 'chat-window-bubbleUser')}>
                            <Bubble content={userText} placement="end" avatar={<Avatar size={34} icon={<UserOutlined />} className={'chat-window-userAvatar'} />} />
                        </div>
                    );
                }

                return (
                    <div key={msg.id} className={cx('chat-window-bubbleEnter', 'chat-window-bubbleRow')}>
                        <Avatar size={34} icon={<RobotOutlined />} className={'chat-window-assistantAvatar'} />
                        <div className={'chat-window-bubbleContent'}>
                            {reasoningText && <Think title={'思考过程'}>{reasoningText}</Think>}

                            {toolParts.map((part) => {
                                const partData = part as { type: string; toolCallId: string; state: string; input?: Record<string, unknown>; output?: unknown };
                                if (partData.state === 'input-available') {
                                    return <ToolCallConfirmation key={partData.toolCallId} toolPart={part} onConfirm={onConfirmToolCall || (() => {})} />;
                                }
                                if (partData.state === 'output-available' && partData.output) {
                                    const toolName = partData.type.replace('tool-', '');
                                    const output = partData.output as Record<string, unknown>;
                                    let displayValue: string = '';
                                    if (output.confirmed) {
                                        if (toolName === 'collectAge' && output.age !== undefined) {
                                            displayValue = `${output.age} 岁`;
                                        } else if (toolName === 'collectGender' && output.gender) {
                                            displayValue = output.gender as string;
                                        } else if (toolName === 'collectSymptoms' && output.symptoms) {
                                            displayValue = output.symptoms as string;
                                        } else if (toolName === 'collectDuration' && output.duration) {
                                            displayValue = output.duration as string;
                                        } else if ((toolName === 'collectMedicalHistory' || toolName === 'collectAllergies') && Array.isArray(output.conditions || output.allergies)) {
                                            const arr = (output.conditions || output.allergies) as string[];
                                            displayValue = arr.length > 0 ? arr.join('、') : '无';
                                        } else if (toolName === 'generateReport' && output.report) {
                                            const report = output.report as Record<string, unknown>;
                                            const items = [
                                                report.age ? `年龄: ${report.age} 岁` : '',
                                                report.gender ? `性别: ${report.gender}` : '',
                                                report.symptoms ? `症状: ${report.symptoms}` : '',
                                                report.duration ? `持续时间: ${report.duration}` : '',
                                                report.medicalHistory ? `既往病史: ${(report.medicalHistory as string[]).join('、') || '无'}` : '',
                                                report.allergies ? `过敏史: ${(report.allergies as string[]).join('、') || '无'}` : ''
                                            ].filter(Boolean);
                                            displayValue = items.join('\n');
                                            if (report.summary) {
                                                displayValue += `\n摘要: ${report.summary}`;
                                            }
                                        }
                                    }
                                    if (!displayValue) return null;
                                    return (
                                        <div key={partData.toolCallId} className={'chat-window-toolOutput'}>
                                            <Text className={'chat-window-toolOutputText'}>
                                                ✓ {TOOL_LABELS[toolName] || toolName}：{displayValue}
                                            </Text>
                                        </div>
                                    );
                                }
                                return null;
                            })}

                            {textContent || (isLoading && !toolParts.length && isLastMessage) ? (
                                <div className={'chat-window-assistantBubble'}>
                                    {textContent ? <XMarkdown content={textContent}></XMarkdown> : <Spin size="small" description="正在思考中..." className={'chat-window-loadingSpin'} />}
                                </div>
                            ) : null}
                        </div>
                    </div>
                );
            })}
        </div>
    );
});
