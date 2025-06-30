# BMAD Method Guide for Cursor

This guide covers Cursor-specific setup and usage with BMAD Method. For the complete workflow, see the [BMAD Workflow Guide](../bmad-workflow-guide.md).

## Installation

When running `npx bmad-method install`, select **Cursor** as your IDE. This creates:

- `.bmad-core/` folder with all agents
- `.cursor/rules/` folder with agent rule files (`.mdc`)

## Using BMAD Agents in Cursor

Type `@agent-name` in chat (Ctrl+L / Cmd+L) to activate an agent:

- `@bmad-master` - Universal task executor
- `@sm` - Scrum Master
- `@dev` - Full-stack developer
- `@architect` - Solution architect
- `@pm` - Product manager
- `@analyst` - Business analyst
- `@qa` - QA specialist
- `@po` - Product owner
- `@ux-expert` - UX specialist

## Cursor-Specific Features

- **Rule files**: Stored in `.cursor/rules/` as `.mdc` files
- **Auto-completion**: Cursor suggests agents as you type `@`
- **Context awareness**: Agents can see your current file selection
- **Custom agents**: For better performance, copy agent content into Cursor's custom modes

## Tips for Cursor Users

- Start new chats when switching agents
- Each agent supports `*help` to see available commands
- Leverage Cursor's file context for more accurate assistance
