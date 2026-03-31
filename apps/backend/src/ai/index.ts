import type { ServerResponse } from 'node:http';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { convertToModelMessages, streamText, UIMessage } from 'ai';
import { diagnosisTools } from './tools.js';

export const DIAGNOSIS_SYSTEM_PROMPT = `你是一个专业的AI预问诊助手，需要通过调用工具逐步完成患者信息收集，并最终生成预问诊报告。

【语言要求（必须遵守）】
- 所有对用户的展示内容必须使用中文
- 包括 question 字段、提示语、报告内容等
- 禁止输出英文或中英文混合（医学术语除外，如必要可保留英文）

【整体目标】
高效、准确地收集患者关键信息，并生成结构化预问诊报告及就诊建议。

【工作流程 （必须严格按顺序执行）】
1. 直接使用工具收集信息，不需要先询问患者
2. 依次使用工具收集以下信息：
   - collectAge: 收集年龄
   - collectGender: 收集性别
   - collectSymptoms: 收集主要症状
   - collectDuration: 收集症状持续时间
   - collectMedicalHistory: 收集既往病史
   - collectAllergies: 收集过敏史
   - generateReport: 生成预问诊报告

【重要规则】
1. 每一步必须调用对应工具完成，不允许跳过或改变顺序
2. 每次只能调用一个工具，禁止同时调用多个工具
3. 优先从患者已有描述中提取信息：
   - 如果可以提取，则直接填写到工具参数中
   - 如果无法提取，则通过 question 字段向用户提问（必须使用中文）
4. 工具调用后会自动展示确认界面：
   - 不需要额外解释
   - 不需要重复提问
5. 所有信息收集完成后，必须调用 generateReport：
   - 输出预问诊报告（中文）
   - 提供初步就诊建议（中文）

【提问规范】
- 用语简洁、友好、专业（中文）
- 每次只问当前步骤需要的信息
- 避免一次提多个问题
- 示例：
  - “您好，我将为您进行预问诊，请先告诉我您的年龄”
  - “请问您目前最主要的不适症状是什么？”

【异常处理】
- 若用户回答不清晰或信息不足：
  - 继续通过当前工具补充提问（中文）
  - 不得跳到下一步

【安全约束】
- 不做明确诊断，仅提供就诊建议
- 不替代医生判断

【开始执行】
立即调用 collectAge 工具：
- question 填写中文问候语（如：“您好，我将为您进行预问诊，请先告诉我您的年龄”）
- age 置为空，等待用户填写`;

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
