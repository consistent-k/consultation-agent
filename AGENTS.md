# Consultation Agent - Agent Guidelines

## Project Overview

AI-powered pre-consultation system that collects patient information via multi-turn conversations using LLM tool calls. React + Vite (frontend) + Node.js/Fastify (backend) in a pnpm workspaces monorepo.

## Project Structure

```
consultation-agent/
├── apps/
│   ├── frontend/          # React 19 + Vite + Ant Design 6
│   │   └── src/
│   │       ├── components/
│   │       │   ├── ChatWindow/            # Chat display component
│   │       │   ├── ChatInput/             # Message input component
│   │       │   └── ToolCallConfirmation/  # Tool call confirmation UI
│   │       ├── hooks/                     # useDiagnosisChat
│   │       ├── styles.ts                  # App-level styles
│   │       └── index.css                  # Global styles only
│   ├── backend/           # Node.js 22 + Fastify 5
│   │   └── src/
│   │       ├── ai/                        # Streaming + tool definitions
│   │       ├── routes/                    # API routes
│   │       └── index.ts
│   └── ...
├── packages/
│   └── shared/            # @consultation-agent/shared (reserved)
└── package.json
```

## Commands

```bash
pnpm install                  # Install dependencies
pnpm dev                      # Run frontend + backend
pnpm dev:frontend             # Frontend only (port 8080)
pnpm dev:backend              # Backend only (port 3001)
pnpm build                    # Build all apps
pnpm lint                     # ESLint check
pnpm lint:fix                 # ESLint auto-fix
pnpm typecheck                # TypeScript type-check
pnpm format                   # Prettier format
pnpm format:check             # Check formatting

# Per-app (via pnpm filters)
pnpm --filter @consultation-agent/frontend typecheck
pnpm --filter @consultation-agent/backend build
```

**No test framework configured.** Ask the user before adding tests.

## Git Workflow

- **Pre-commit**: Husky runs `lint-staged` (ESLint + Prettier)
- **Commits**: Conventional Commits (`feat:`, `fix:`, `chore:`, etc.) enforced by commitlint
- Use `pnpm commit` for interactive commits

## Code Style

### Prettier

Single quotes, no trailing commas, 200 char width, 4-space tabs, LF line endings.

### TypeScript

- Strict mode, ES2022 target, ESNext modules with `bundler` resolution
- Explicit return types for exported functions
- Use `type` for unions/primitives, `interface` for object shapes
- Avoid `any`; prefer `unknown` + narrowing

### Imports

```typescript
import { SendOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';
import type { UIMessage } from 'ai';
import { useState } from 'react';

import { ChatWindow } from './components/ChatWindow';
```

- External → internal groups, alphabetized within each group
- Use `import type` for type-only imports
- No `.js` suffix for imports; use `import type` for `.d.ts` type imports

### Naming

| Element          | Convention  | Example                              |
| ---------------- | ----------- | ------------------------------------ |
| Component dirs   | PascalCase  | `ChatWindow/`, `ChatInput/`          |
| Component files  | camelCase   | `index.tsx`, `styles.ts`             |
| Hooks            | camelCase   | `useDiagnosisChat.ts` (prefix `use`) |
| Components       | PascalCase  | `export function ChatInput()`        |
| Functions/vars   | camelCase   | `sendMessage`, `handleClick`         |
| Constants        | UPPER_SNAKE | `DIAGNOSIS_SYSTEM_PROMPT`            |
| Types/Interfaces | PascalCase  | `ChatInputProps`, `DiagnosisReport`  |

### Styling (antd-style)

Every component has `styles.ts` alongside `index.tsx`:

```typescript
import { createStyles, keyframes } from 'antd-style';

const fadeIn = keyframes`
    from { opacity: 0; }
    to { opacity: 1; }
`;

const useStyles = createStyles(({ css, token }) => {
    return css({
        '&.component-name': {
            display: 'flex',
            animation: `${fadeIn} 200ms ease`,
            '.component-name-child': { fontSize: 14, color: token.colorText }
        }
    });
});
export default useStyles;
```

Usage: `className={cx('component-name', styles.toString())}` on root, plain strings on children. Use `keyframes` from `antd-style`, not CSS `@keyframes`.

### React

- Functional components with hooks only
- Props via explicit `interface`
- Custom hooks: prefix `use`, return objects (not arrays)
- Memoize with `memo()` when appropriate
- Wrap callbacks in `useCallback` when passed as props

### Error Handling

- Backend: try-catch in routes, `fastify.log.error()`, proper HTTP codes
- Frontend: `error` state from `useChat` → antd `Alert`

## AI SDK (v6)

- **Tools**: `tool()` from `ai` with `zod` schemas. No `execute` — confirmed on frontend.
- **Streaming**: `streamText` + `convertToModelMessages`
- **Frontend**: `useChat` with `DefaultChatTransport`, `addToolOutput` for confirmation
- **Do NOT** modify AI SDK versions

## Environment

**Requirements**: Node.js >= 22, pnpm >= 10.32.1

Create `.env` in `apps/backend/`:

```
LLM_API_KEY=your-api-key
LLM_BASE_URL=https://api.openai.com/v1
LLM_MODEL=gpt-4o-mini
PORT=3001
```

## Common Pitfalls

- **ESM imports**: Backend local imports need `.js` extension
- **Ports**: Frontend 8080, Backend 3001. Vite proxies `/api` → backend
- **Shared package**: Currently unused; don't import from it yet
- **Lint errors**: Run `pnpm lint:fix` before committing
