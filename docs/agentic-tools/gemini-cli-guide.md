# BMAD Method Guide for Gemini CLI

This guide covers Gemini CLI-specific setup and usage with BMAD Method. For the complete workflow, see the [BMAD Workflow Guide](../bmad-workflow-guide.md).

## Installation

When running `npx bmad-method install`, select **Gemini CLI** as your IDE. This creates:

- `.gemini/agents/` directory with all agent context files
- `.gemini/settings.json` configured to load all agents automatically

## Using BMAD Agents with Gemini CLI

Simply mention the agent in your prompt:

- "As @dev, implement the login feature"
- "Acting as @architect, review this system design"
- "@sm, create the next story for our project"

The Gemini CLI automatically loads the appropriate agent context.

## Available Agents

All agents are referenced with `@` in prompts:

- `@bmad-master` - Universal task executor
- `@sm` - Scrum Master
- `@dev` - Full-stack developer
- `@architect` - Solution architect
- `@pm` - Product manager
- `@analyst` - Business analyst
- `@qa` - QA specialist
- `@po` - Product owner
- `@ux-expert` - UX specialist

## Gemini CLI-Specific Features

- **Context files**: All agents loaded as context in `.gemini/agents/`
- **Automatic loading**: Settings.json ensures agents are always available
- **Natural language**: No special syntax needed, just mention the agent

## Tips for Gemini CLI Users

- Be explicit about which agent you're addressing
- You can switch agents mid-conversation by mentioning a different one
- The CLI maintains context across your session
