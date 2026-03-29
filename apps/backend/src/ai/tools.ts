import { tool } from 'ai';
import { z } from 'zod';

export const diagnosisTools = {
    collectAge: tool({
        description: '收集患者的年龄信息',
        inputSchema: z.object({
            question: z.string().describe('向患者询问年龄的问题'),
            age: z.number().optional().describe('从患者回答中提取的年龄')
        })
    }),

    collectGender: tool({
        description: '收集患者的性别信息',
        inputSchema: z.object({
            question: z.string().describe('向患者询问性别的问题'),
            gender: z.enum(['男', '女']).optional().describe('从患者回答中提取的性别')
        })
    }),

    collectSymptoms: tool({
        description: '收集患者的主要症状',
        inputSchema: z.object({
            question: z.string().describe('向患者询问症状的问题'),
            symptoms: z.string().optional().describe('从患者回答中提取的症状描述')
        })
    }),

    collectDuration: tool({
        description: '收集症状的持续时间',
        inputSchema: z.object({
            question: z.string().describe('向患者询问持续时间的问题'),
            duration: z.string().optional().describe('从患者回答中提取的持续时间')
        })
    }),

    collectMedicalHistory: tool({
        description: '收集患者的既往病史',
        inputSchema: z.object({
            question: z.string().describe('向患者询问既往病史的问题'),
            conditions: z.array(z.string()).optional().describe('从患者回答中提取的既往疾病列表')
        })
    }),

    collectAllergies: tool({
        description: '收集患者的过敏史',
        inputSchema: z.object({
            question: z.string().describe('向患者询问过敏史的问题'),
            allergies: z.array(z.string()).optional().describe('从患者回答中提取的过敏原列表')
        })
    }),

    generateReport: tool({
        description: '生成预问诊报告',
        inputSchema: z.object({
            report: z.object({
                age: z.number(),
                gender: z.string(),
                symptoms: z.string(),
                duration: z.string(),
                medicalHistory: z.array(z.string()),
                allergies: z.array(z.string()),
                summary: z.string().describe('预问诊摘要')
            })
        })
    })
};
