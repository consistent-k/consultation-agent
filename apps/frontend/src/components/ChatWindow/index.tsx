import { UserOutlined, RobotOutlined, BulbOutlined, MedicineBoxOutlined } from '@ant-design/icons';
import { Bubble, ThoughtChain } from '@ant-design/x';
import XMarkdown from '@ant-design/x-markdown';
import type { UIMessage, UIMessagePart, UIDataTypes, UITools } from 'ai';
import { Alert, Avatar, Spin, Typography } from 'antd';
import { useRef, useMemo, memo } from 'react';
import useScrollToBottom from '../../hooks/useScrollToBottom';
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

const STEP_TITLES: Record<string, string> = {
    collectAge: '收集年龄',
    collectGender: '收集性别',
    collectSymptoms: '收集症状',
    collectDuration: '收集持续时间',
    collectMedicalHistory: '收集既往病史',
    collectAllergies: '收集过敏史',
    generateReport: '生成报告'
};

interface ToolPart {
    type: string;
    toolCallId: string;
    state: string;
    input?: Record<string, unknown>;
    output?: unknown;
}

interface Step {
    id: string;
    reasoning: string;
    toolCalls: ToolPart[];
    text: string;
}

interface StepContent {
    reasoning?: string;
    toolCalls: ToolPart[];
    text?: string;
}

interface ChatWindowProps {
    messages: UIMessage[];
    status?: 'submitted' | 'streaming' | 'ready' | 'error';
    error?: Error;
    onConfirmToolCall?: (toolCallId: string, toolName: string, output: unknown) => void;
}

function groupPartsBySteps(parts: UIMessage['parts']): Step[] {
    const steps: Step[] = [];
    let currentStep: Step = { id: '', reasoning: '', toolCalls: [], text: '' };

    for (const part of parts) {
        if (part.type === 'step-start') {
            if (currentStep.id || currentStep.reasoning || currentStep.toolCalls.length || currentStep.text) {
                steps.push(currentStep);
            }
            currentStep = { id: crypto.randomUUID(), reasoning: '', toolCalls: [], text: '' };
        } else if (part.type === 'reasoning') {
            const reasoningPart = part as { type: 'reasoning'; text: string };
            currentStep.reasoning += reasoningPart.text;
        } else if (part.type.startsWith('tool-')) {
            currentStep.toolCalls.push(part as unknown as ToolPart);
        } else if (part.type === 'text') {
            const textPart = part as { type: 'text'; text: string };
            currentStep.text += textPart.text;
        }
    }

    if (currentStep.id || currentStep.reasoning || currentStep.toolCalls.length || currentStep.text) {
        steps.push(currentStep);
    }

    return steps;
}

function getStepStatus(step: Step): 'loading' | 'success' | 'error' | undefined {
    if (step.toolCalls.length === 0) {
        return step.text ? 'success' : undefined;
    }

    const hasError = step.toolCalls.some((tc) => tc.state === 'output-error');
    const allDone = step.toolCalls.every((tc) => tc.state === 'output-available' || tc.state === 'output-error');

    if (hasError) return 'error';
    if (allDone) return 'success';
    return 'loading';
}

function getStepTitle(step: Step, index: number): string {
    if (step.toolCalls.length > 0) {
        const toolName = step.toolCalls[0].type.replace('tool-', '');
        return STEP_TITLES[toolName] || `步骤 ${index + 1}`;
    }
    return step.text ? '回复' : `步骤 ${index + 1}`;
}

function renderToolOutput(part: ToolPart, onConfirm?: ChatWindowProps['onConfirmToolCall']) {
    if (part.state === 'input-available') {
        return <ToolCallConfirmation key={part.toolCallId} toolPart={part as unknown as UIMessagePart<UIDataTypes, UITools>} onConfirm={onConfirm || (() => {})} />;
    }

    if (part.state === 'output-available' && part.output) {
        const toolName = part.type.replace('tool-', '');
        const output = part.output as Record<string, unknown>;
        let displayValue = '';

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
            <div key={part.toolCallId} className={'chat-window-toolOutput'}>
                <Text className={'chat-window-toolOutputText'}>
                    ✓ {TOOL_LABELS[toolName] || toolName}：{displayValue}
                </Text>
            </div>
        );
    }

    return null;
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
    const { scrollDomToBottom } = useScrollToBottom(listRef);

    const isLoading = useMemo(() => status === 'submitted' || status === 'streaming', [status]);

    return (
        <div className={cx('chat-window', styles.toString())}>
            <div ref={listRef} className={cx('chat-window-list', styles.toString())}>
                {messages.length === 0 && <WelcomeScreen />}
                {messages.map((msg, msgIndex) => {
                    const isLastMessage = msgIndex === messages.length - 1;

                    if (msg.role === 'user') {
                        const userText = msg.parts
                            .filter((part) => part.type === 'text')
                            .map((part) => (part as { type: 'text'; text: string }).text)
                            .join('');

                        return (
                            <Bubble
                                key={msg.id}
                                style={{
                                    maxWidth: '80%'
                                }}
                                content={userText}
                                placement="end"
                                avatar={<Avatar size={34} icon={<UserOutlined />} className={'chat-window-userAvatar'} />}
                            />
                        );
                    }

                    const allSteps = groupPartsBySteps(msg.parts);

                    if (allSteps.length === 0 && isLoading && isLastMessage) {
                        return (
                            <Bubble
                                key={msg.id}
                                style={{
                                    maxWidth: '90%'
                                }}
                                content={<Spin size="small" description="正在思考中..." className={'chat-window-loadingSpin'} />}
                                avatar={<Avatar size={34} icon={<RobotOutlined />} className={'chat-window-assistantAvatar'} />}
                            />
                        );
                    }

                    return (
                        <Bubble
                            key={msg.id}
                            style={{
                                maxWidth: '90%'
                            }}
                            content={
                                <div className={'chat-window-bubbleContent'}>
                                    {allSteps.length > 0 && (
                                        <ThoughtChain
                                            className={'chat-window-thoughtChain'}
                                            items={allSteps.map((step, stepIndex) => ({
                                                key: step.id,
                                                title: getStepTitle(step, stepIndex),
                                                status: getStepStatus(step),
                                                content: (
                                                    <div className={'chat-window-stepContent'}>
                                                        {step.reasoning && <span>{step.reasoning}</span>}
                                                        {step.text &&
                                                            (isLoading && isLastMessage ? (
                                                                <span>{step.text}</span> // 流式阶段不用 markdown
                                                            ) : (
                                                                <XMarkdown
                                                                    content={step.text}
                                                                    style={{
                                                                        background: '#fff',
                                                                        borderRadius: 16,
                                                                        padding: 16
                                                                    }}
                                                                />
                                                            ))}
                                                        {step.toolCalls.map((tc) => renderToolOutput(tc, onConfirmToolCall))}
                                                    </div>
                                                )
                                            }))}
                                        />
                                    )}
                                </div>
                            }
                            avatar={<Avatar size={34} icon={<RobotOutlined />} className={'chat-window-assistantAvatar'} />}
                        />
                    );
                })}
            </div>

            {isLoading && (
                <div className={cx('chat-window-loading', styles.toString())}>
                    <Spin size="small" />
                    <Text type="secondary" className={'chat-window-loadingText'}>
                        正在处理中...
                    </Text>
                </div>
            )}
            {error && <Alert type="error" showIcon title="请求失败" description={error.message} className={'chat-window-errorAlert'} />}
        </div>
    );
});
