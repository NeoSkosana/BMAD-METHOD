# BMAD Method Guide for Cline (VS Code)

This guide covers Cline-specific setup and usage with BMAD Method. For the complete workflow, see the [BMAD Workflow Guide](../bmad-workflow-guide.md).

## Installation

When running `npx bmad-method install`, select **Cline** as your IDE. This creates:

- `.clinerules/` directory with numbered agent rule files (`.md`)
- Agents ordered by priority (bmad-master first)

## Using BMAD Agents in Cline

1. **Open Cline panel** in VS Code
2. **Type `@agent-name`** in the chat (e.g., `@dev`, `@sm`, `@architect`)
3. The agent adopts that persona for the conversation

## Available Agents

All agents use `@` prefix:

- `@bmad-master` - Universal task executor
- `@sm` - Scrum Master
- `@dev` - Full-stack developer
- `@architect` - Solution architect
- `@pm` - Product manager
- `@analyst` - Business analyst
- `@qa` - QA specialist
- `@po` - Product owner
- `@ux-expert` - UX specialist

## Cline-Specific Features

- **Rule files**: Stored as numbered files in `.clinerules/` (e.g., `01-bmad-master.md`)
- **Agent ordering**: Prioritized list with core agents first
- **VS Code integration**: Works within VS Code's Cline extension panel

## Tips for Cline Users

- Cline maintains conversation context well
- Use `@agent-name` at the start of your message for best results
- Agent rules are loaded automatically when mentioned
