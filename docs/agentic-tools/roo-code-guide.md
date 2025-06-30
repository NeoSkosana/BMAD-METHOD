# BMAD Method Guide for Roo Code

This guide covers Roo Code-specific setup and usage with BMAD Method. For the complete workflow, see the [BMAD Workflow Guide](../bmad-workflow-guide.md).

## Installation

When running `npx bmad-method install`, select **Roo Code** as your IDE. This creates:

- `.bmad-core/` folder with all agents
- `.roomodes` file in project root with custom modes

## Using BMAD Agents in Roo Code

Select mode from the mode selector (usually in status bar):

- `bmad-bmad-master` - 🧙 Universal task executor
- `bmad-sm` - 🏃 Scrum Master
- `bmad-dev` - 💻 Full-stack developer
- `bmad-architect` - 🏗️ Solution architect
- `bmad-pm` - 📋 Product manager
- `bmad-analyst` - 📊 Business analyst
- `bmad-qa` - 🧪 QA specialist
- `bmad-po` - 🎯 Product owner
- `bmad-ux-expert` - 🎨 UX specialist

## Roo Code-Specific Features

- **Mode file**: `.roomodes` in project root
- **Mode switching**: Use mode selector instead of starting new chats
- **Context preservation**: Maintains context across mode switches
- **File permissions**: Each agent has specific file access:

### File Permission Summary

- **Documentation agents** (analyst, pm, po, sm): `.md`, `.txt` only
- **bmad-architect**: `.md`, `.txt`, `.yml`, `.yaml`, `.json`
- **bmad-qa**: Test files (`.test.*`, `.spec.*`) and `.md`
- **bmad-ux-expert**: `.md`, `.css`, `.scss`, `.html`, `.jsx`, `.tsx`
- **Full access**: `bmad-dev`, `bmad-bmad-master`, `bmad-orchestrator`

## Tips for Roo Code Users

- Switch modes instead of starting new chats
- Each mode supports `*help` to see available commands
- Agents respect file permission boundaries
- Context persists across mode switches
