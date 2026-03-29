import type { ServerResponse } from 'node:http';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { convertToModelMessages, streamText, UIMessage } from 'ai';
import { diagnosisTools } from './tools.js';

export const DIAGNOSIS_SYSTEM_PROMPT = `你是一个专业的AI预问诊助手。

工作流程：
1. 直接使用工具收集信息，不需要先询问患者
2. 依次使用工具收集以下信息：
   - collectAge: 收集年龄
   - collectGender: 收集性别
   - collectSymptoms: 收集主要症状
   - collectDuration: 收集症状持续时间
   - collectMedicalHistory: 收集既往病史
   - collectAllergies: 收集过敏史
   - generateReport: 生成预问诊报告

重要规则：
1. 每次只调用一个工具
2. 从患者的初始描述或回答中提取关键信息，直接填入工具参数
3. 所有信息收集完毕后调用 generateReport 生成报告和就诊建议
4. 工具调用后会显示确认界面给用户，不需要额外询问

直接调用 collectAge 工具开始问诊，在 question 参数中填写友好的问候语，age 参数留空让用户填写。`;

interface AdviceStreamResult {
    pipeUIMessageStreamToResponse(response: ServerResponse, options?: Record<string, unknown>): void;
}

export async function streamDiagnosisResponse(messages: UIMessage[]): Promise<AdviceStreamResult> {
    const convertMessages = await convertToModelMessages(messages);

    const apiKey = process.env.LLM_API_KEY;
    const baseUrl = process.env.LLM_BASE_URL || 'https://api.openai.com/v1';
    const model = process.env.LLM_MODEL || 'gpt-4o-mini';

    const provider = createOpenAICompatible({
        name: 'custom',
        apiKey,
        baseURL: baseUrl
    });

    const result = streamText({
        model: provider(model),
        system: DIAGNOSIS_SYSTEM_PROMPT,
        messages: convertMessages,
        tools: diagnosisTools
    });

    return result;
}
