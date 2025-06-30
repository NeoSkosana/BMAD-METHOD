# BMAD Method Guide for Windsurf

This guide covers Windsurf-specific setup and usage with BMAD Method. For the complete workflow, see the [BMAD Workflow Guide](../bmad-workflow-guide.md).

## Installation

When running `npx bmad-method install`, select **Windsurf** as your IDE. This creates:

- `.bmad-core/` folder with all agents
- `.windsurf/rules/` folder with agent rule files (`.md`)

## Using BMAD Agents in Windsurf

Type `@agent-name` in chat to activate an agent:

- `@bmad-master` - Universal task executor
- `@sm` - Scrum Master
- `@dev` - Full-stack developer
- `@architect` - Solution architect
- `@pm` - Product manager
- `@analyst` - Business analyst
- `@qa` - QA specialist
- `@po` - Product owner
- `@ux-expert` - UX specialist

## Windsurf-Specific Features

- **Rule files**: Stored in `.windsurf/rules/` as `.md` files
- **Activation**: Use `@` prefix to mention agents
- **Collaborative features**: Works well with BMAD's agent-switching pattern
- **Project context**: Agents have access to your full project context

## Tips for Windsurf Users

- Start new chats when switching agents
- Each agent supports `*help` to see available commands
- Leverage Windsurf's collaboration features for team reviews
