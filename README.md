# Consultation Agent

AI 智能预问诊系统，通过多轮对话收集患者信息，利用 LLM 工具调用实现结构化数据采集。

## 技术栈

### 前端

- React 19
- Vite 8
- Ant Design 6 + Ant Design X
- antd-style (CSS-in-JS)
- Zustand (状态管理)
- AI SDK React (聊天交互)

### 后端

- Node.js 22
- Fastify 5
- AI SDK (流式响应)
- Zod (数据验证)

## 项目结构

```
consultation-agent/
├── apps/
│   ├── frontend/          # React + Vite 前端应用
│   │   └── src/
│   │       ├── components/
│   │       │   ├── ChatWindow/        # 聊天窗口组件
│   │       │   ├── ChatInput/         # 聊天输入组件
│   │       │   └── ToolCallConfirmation/ # 工具调用确认组件
│   │       ├── hooks/                 # 自定义 Hooks
│   │       └── styles.ts              # 全局样式
│   └── backend/           # Node.js + Fastify 后端服务
│       └── src/
│           ├── ai/                    # AI 相关逻辑
│           ├── routes/                # API 路由
│           └── index.ts               # 服务入口
├── packages/
│   └── shared/            # 共享类型和工具（预留）
└── package.json
```

## 快速开始

### 环境要求

- Node.js >= 22
- pnpm >= 10.32.1

### 安装依赖

```bash
pnpm install
```

### 配置环境变量

在 `apps/backend/` 目录下创建 `.env` 文件：

```env
LLM_API_KEY=your-api-key
LLM_BASE_URL=https://api.openai.com/v1    # 可选，默认为 OpenAI
LLM_MODEL=gpt-4o-mini                      # 可选
PORT=3001                                   # 可选
```

### 启动开发服务器

```bash
# 同时启动前端和后端
pnpm dev

# 或分别启动
pnpm dev:frontend    # 前端 (http://localhost:8080)
pnpm dev:backend     # 后端 (http://localhost:3001)
```

## 开发命令

```bash
# 开发
pnpm dev                    # 启动所有服务
pnpm dev:frontend           # 仅前端
pnpm dev:backend            # 仅后端

# 构建
pnpm build                  # 构建所有应用
pnpm build:frontend         # 仅构建前端
pnpm build:backend          # 仅构建后端

# 代码质量
pnpm lint                   # ESLint 检查
pnpm lint:fix               # ESLint 自动修复
pnpm typecheck              # TypeScript 类型检查
pnpm format                 # Prettier 格式化
pnpm format:check           # 检查格式

# Git 提交
pnpm commit                 # 使用 commitizen 交互式提交
```

## 主要功能

- **多轮对话**：通过自然语言交互收集患者症状信息
- **工具调用**：LLM 通过工具调用结构化采集医疗数据
- **实时流式响应**：基于 AI SDK 的流式文本生成
- **确认机制**：前端可确认或修改工具调用结果
- **响应式设计**：适配多种设备屏幕

## Git 工作流

- **提交信息**：遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范
- **提交钩子**：Husky + lint-staged 自动运行 ESLint 和 Prettier
- 使用 `pnpm commit` 进行交互式提交

## 许可证

Private
