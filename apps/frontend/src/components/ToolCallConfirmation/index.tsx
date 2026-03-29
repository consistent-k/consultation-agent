import { MedicineBoxOutlined } from '@ant-design/icons';
import type { UIMessagePart, UIDataTypes, UITools } from 'ai';
import { Button, Typography, Tag, Input, Radio, InputNumber, Card } from 'antd';
import { useState, useEffect, memo } from 'react';
import useStyles from './styles';

const { Text } = Typography;

interface ToolCallConfirmationProps {
    toolPart: UIMessagePart<UIDataTypes, UITools>;
    onConfirm: (toolCallId: string, toolName: string, output: unknown) => void;
}

interface ToolPartData {
    type: string;
    toolCallId: string;
    state: string;
    input?: Record<string, unknown>;
}

const TOOL_LABELS: Record<string, string> = {
    collectAge: '年龄',
    collectGender: '性别',
    collectSymptoms: '症状',
    collectDuration: '持续时间',
    collectMedicalHistory: '既往病史',
    collectAllergies: '过敏史',
    generateReport: '生成报告'
};

function initStateFromArgs(toolName: string, args: Record<string, unknown>): unknown {
    const a = args ?? {};
    switch (toolName) {
        case 'collectAge':
            return { age: a.age };
        case 'collectGender':
            return { gender: a.gender };
        case 'collectSymptoms':
            return { symptoms: a.symptoms ? String(a.symptoms) : '' };
        case 'collectDuration':
            return { duration: a.duration ? String(a.duration) : '' };
        case 'collectMedicalHistory':
            return { conditions: (a.conditions as string[] | undefined) ?? [] };
        case 'collectAllergies':
            return { allergies: (a.allergies as string[] | undefined) ?? [] };
        case 'generateReport':
            return { report: a.report };
        default:
            return {};
    }
}

function isValueFilled(toolName: string, value: unknown): boolean {
    if (!value) return false;
    const v = value as Record<string, unknown>;
    switch (toolName) {
        case 'collectAge':
            return v.age !== undefined && v.age !== null;
        case 'collectGender':
            return v.gender !== undefined && v.gender !== '';
        case 'collectSymptoms':
            return !!v.symptoms && String(v.symptoms).trim().length > 0;
        case 'collectDuration':
            return !!v.duration && String(v.duration).trim().length > 0;
        case 'collectMedicalHistory':
        case 'collectAllergies':
            return true;
        case 'generateReport':
            return true;
        default:
            return false;
    }
}

const TOOL_DEFAULTS: Record<string, unknown> = {
    collectAge: { age: undefined },
    collectGender: { gender: undefined },
    collectSymptoms: { symptoms: '' },
    collectDuration: { duration: '' },
    collectMedicalHistory: { conditions: [] },
    collectAllergies: { allergies: [] },
    generateReport: { report: undefined }
};

export const ToolCallConfirmation = memo(function ToolCallConfirmation({ toolPart, onConfirm }: ToolCallConfirmationProps) {
    const part = toolPart as ToolPartData;
    const { styles, cx } = useStyles();

    const [value, setValue] = useState<unknown>(() => {
        if (part.state !== 'input-available' || !part.input) {
            const toolName = part.type.replace('tool-', '');
            return (TOOL_DEFAULTS[toolName] as Record<string, unknown>) || {};
        }
        const toolName = part.type.replace('tool-', '');
        return initStateFromArgs(toolName, part.input);
    });

    const inputKey = part.toolCallId;

    useEffect(() => {
        if (part.state === 'input-available' && part.input) {
            const toolName = part.type.replace('tool-', '');
            setValue(initStateFromArgs(toolName, part.input));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputKey, part.state]);

    if (part.state !== 'input-available' || !part.input) {
        return null;
    }

    const toolName = part.type.replace('tool-', '');
    const { toolCallId, input: args } = part;

    const handleConfirm = () => {
        if (toolName === 'generateReport') {
            onConfirm(toolCallId, toolName, { confirmed: true, report: args.report });
            return;
        }
        const output = { confirmed: true, ...(value as Record<string, unknown>) };
        onConfirm(toolCallId, toolName, output);
    };

    const filled = isValueFilled(toolName, value);

    const renderInput = () => {
        const v = value as Record<string, unknown>;

        switch (toolName) {
            case 'collectAge':
                return (
                    <div className={'tool-call-confirmation-inputSection'}>
                        <Text className={'tool-call-confirmation-inputLabel'}>{args.age !== undefined ? '识别到的年龄' : '请输入年龄'}</Text>
                        <InputNumber
                            value={v.age as number | undefined}
                            onChange={(val) => setValue({ age: val })}
                            placeholder="请输入年龄"
                            min={0}
                            max={150}
                            size="large"
                            style={{ width: 160 }}
                            addonAfter="岁"
                        />
                    </div>
                );

            case 'collectGender':
                return (
                    <div className={'tool-call-confirmation-inputSection'}>
                        <Text className={'tool-call-confirmation-inputLabel'}>{args.gender !== undefined ? '识别到的性别' : '请选择性别'}</Text>
                        <Radio.Group value={v.gender as string | undefined} onChange={(e) => setValue({ gender: e.target.value })} optionType="button" buttonStyle="solid">
                            <Radio.Button value="男">男</Radio.Button>
                            <Radio.Button value="女">女</Radio.Button>
                        </Radio.Group>
                    </div>
                );

            case 'collectSymptoms':
                return (
                    <div className={'tool-call-confirmation-inputSection'}>
                        <Text className={'tool-call-confirmation-inputLabel'}>{args.symptoms ? '识别到的症状' : '请描述您的症状'}</Text>
                        <Input.TextArea value={v.symptoms as string} onChange={(e) => setValue({ symptoms: e.target.value })} placeholder="请描述您的症状" rows={3} showCount maxLength={500} />
                    </div>
                );

            case 'collectDuration':
                return (
                    <div className={'tool-call-confirmation-inputSection'}>
                        <Text className={'tool-call-confirmation-inputLabel'}>{args.duration ? '识别到的持续时间' : '请输入症状持续时间'}</Text>
                        <Input
                            value={v.duration as string}
                            onChange={(e) => setValue({ duration: e.target.value })}
                            placeholder="例如：3天、一周"
                            size="large"
                            className={'tool-call-confirmation-durationInput'}
                        />
                    </div>
                );

            case 'collectMedicalHistory': {
                const conditions = (v?.conditions as string[] | undefined) ?? [];
                return (
                    <div className={'tool-call-confirmation-inputSection'}>
                        <Text className={'tool-call-confirmation-inputLabel'}>{conditions.length > 0 ? '识别到的既往病史' : '请填写既往病史'}</Text>
                        <Input.TextArea
                            value={conditions.join(', ')}
                            onChange={(e) =>
                                setValue({
                                    conditions: e.target.value
                                        .split(',')
                                        .map((s) => s.trim())
                                        .filter(Boolean)
                                })
                            }
                            placeholder="如有既往病史，请用逗号分隔填写（如：高血压、糖尿病）"
                            rows={2}
                        />
                        {conditions.length > 0 && (
                            <div className={'tool-call-confirmation-tags'}>
                                {conditions.map((c, i) => (
                                    <Tag key={i} color="cyan" className={'tool-call-confirmation-tag'}>
                                        {c}
                                    </Tag>
                                ))}
                            </div>
                        )}
                    </div>
                );
            }

            case 'collectAllergies': {
                const allergies = (v?.allergies as string[] | undefined) ?? [];
                return (
                    <div className={'tool-call-confirmation-inputSection'}>
                        <Text className={'tool-call-confirmation-inputLabel'}>{allergies.length > 0 ? '识别到的过敏史' : '请填写过敏史'}</Text>
                        <Input.TextArea
                            value={allergies.join(', ')}
                            onChange={(e) =>
                                setValue({
                                    allergies: e.target.value
                                        .split(',')
                                        .map((s) => s.trim())
                                        .filter(Boolean)
                                })
                            }
                            placeholder="如有过敏史，请用逗号分隔填写（如：青霉素、海鲜）"
                            rows={2}
                        />
                        {allergies.length > 0 && (
                            <div className={'tool-call-confirmation-tags'}>
                                {allergies.map((a, i) => (
                                    <Tag key={i} color="orange" className={'tool-call-confirmation-tag'}>
                                        {a}
                                    </Tag>
                                ))}
                            </div>
                        )}
                    </div>
                );
            }

            case 'generateReport': {
                const report = args.report as Record<string, unknown> | undefined;
                if (!report) return null;
                const items = [
                    { label: '年龄', value: report.age != null ? `${report.age} 岁` : undefined },
                    { label: '性别', value: report.gender as string | undefined },
                    { label: '症状', value: report.symptoms as string | undefined },
                    { label: '持续时间', value: report.duration as string | undefined },
                    {
                        label: '既往病史',
                        value: Array.isArray(report.medicalHistory) && report.medicalHistory.length > 0 ? (report.medicalHistory as string[]).join('、') : '无'
                    },
                    {
                        label: '过敏史',
                        value: Array.isArray(report.allergies) && report.allergies.length > 0 ? (report.allergies as string[]).join('、') : '无'
                    }
                ];
                return (
                    <div className={'tool-call-confirmation-inputSection'}>
                        <Text className={'tool-call-confirmation-reportLabelFull'}>请核对以下收集到的信息</Text>
                        <div className={'tool-call-confirmation-reportCard'}>
                            {items.map((item) => (
                                <div key={item.label} className={'tool-call-confirmation-reportItem'}>
                                    <Text className={'tool-call-confirmation-reportLabel'}>{item.label}</Text>
                                    <Text strong className={'tool-call-confirmation-reportValue'}>
                                        {item.value || '—'}
                                    </Text>
                                </div>
                            ))}
                            {typeof report.summary === 'string' && report.summary.length > 0 && (
                                <div className={'tool-call-confirmation-reportDivider'}>
                                    <Text className={'tool-call-confirmation-reportSummaryLabel'}>摘要</Text>
                                    <Text className={'tool-call-confirmation-reportSummaryText'}>{report.summary}</Text>
                                </div>
                            )}
                        </div>
                    </div>
                );
            }

            default:
                return null;
        }
    };

    return (
        <Card size="small" className={cx('tool-call-confirmation', styles.toString())}>
            <div className={'tool-call-confirmation-header'}>
                <div className={'tool-call-confirmation-iconWrapper'}>
                    <MedicineBoxOutlined />
                </div>
                <Tag color="cyan" className={'tool-call-confirmation-headerTag'}>
                    {TOOL_LABELS[toolName] || toolName}
                </Tag>
            </div>

            <div className={'tool-call-confirmation-question'}>{args.question ? String(args.question) : '请确认以下信息'}</div>

            {renderInput()}

            <div className={'tool-call-confirmation-confirmActions'}>
                <Button color="primary" variant="solid" onClick={handleConfirm} disabled={toolName !== 'generateReport' && !filled} className={cx(filled && 'tool-call-confirmation-confirmBtnActive')}>
                    确认
                </Button>
            </div>
        </Card>
    );
});
