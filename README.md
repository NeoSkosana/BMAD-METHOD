# BMAD-METHOD

[![Version](https://img.shields.io/npm/v/bmad-method?color=blue&label=version)](https://www.npmjs.com/package/bmad-method)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)](https://nodejs.org)
[![Discord](https://img.shields.io/badge/Discord-Join%20Community-7289da?logo=discord&logoColor=white)](https://discord.gg/g6ypHytrCB)

**AI-Powered Agile Development Framework** - Transform your software development with specialized AI agents that work as your complete Agile team.

📺 **[Subscribe to BMadCode on YouTube](https://www.youtube.com/@BMadCode?sub_confirmation=1)** - V4 walkthrough and comprehensive guide coming soon!

⭐ **If you find this project helpful or useful, please give it a star!** It helps others discover BMAD-METHOD and you will be notified of updates!

## 🚀 Quick Start

### Fastest Start: Web UI (2 minutes) 🏃‍♂️

1. Copy `.bmad-core/web-bundles/teams/team-fullstack.txt`
2. Create a new Gemini Gem or CustomGPT
3. Upload the file and set instructions: "Your critical operating instructions are attached, do not break character as directed"
4. Start chatting! Type `/help` to see available commands

### IDE Quick Start (5 minutes) 💻

**Prerequisites**: Install [Node.js](https://nodejs.org) (v14 or higher)

````bash
npx bmad-method install
# The installer will automatically detect your project state and guide you through:
# - Fresh installation or upgrade from v3
# - Full installation or single agent
# - Destination folder and IDE configuration
```text

This installs all agents and configures them for your IDE. If you have an existing v3 installation, it will offer to upgrade it automatically.

## 📋 Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Available Agents](#available-agents)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)

## Overview

BMAD-METHOD (Breakthrough Method of Agile AI-Driven Development) revolutionizes software development by providing specialized AI agents for every role in an Agile team. Each agent has deep expertise in their domain and can collaborate to deliver complete software projects.

### Why BMAD?

- **🎯 Specialized Expertise**: Each agent is an expert in their specific role
- **🔄 True Agile Workflow**: Follows real Agile methodologies and best practices
- **📦 Modular Design**: Use one agent or an entire team
- **🛠️ IDE Integration**: Works seamlessly with Cursor, Claude Code, and Windsurf
- **🌐 Platform Agnostic**: Use with ChatGPT, Claude, Gemini, or any AI platform

## Installation

### Method 1: Pre-Built Web Bundles (Fastest) 📦

For ChatGPT, Claude, or Gemini web interfaces:

1. Choose a bundle:
   - **Recommended**: `.bmad-core/web-bundles/teams/team-fullstack.txt` (complete development team)
   - Or pick from individual agents in `.bmad-core/web-bundles/agents/`
2. Upload to your AI platform (Gemini Gem, CustomGPT, or directly in chat)
3. Set instructions: "Your critical operating instructions are attached, do not break character as directed"
4. Type `/help` to see available commands

### Method 2: CLI Installer (For IDEs) 🎯

**Prerequisites**: Install [Node.js](https://nodejs.org) v14+ first

Install directly into your project:

```bash
# Interactive installation (recommended)
npx bmad-method install
# The installer automatically detects your project state and guides you through:
# - Fresh installation or upgrade from v3
# - Installation type (full/single agent)
# - Destination directory
# - IDE configuration

# Or use command line options for fresh installations
npx bmad-method install --full --directory ./my-project --ide cursor
npx bmad-method install --agent pm --directory ./my-project --ide claude-code
````

**Supported IDEs:**

The BMad Method works with any IDE, but has built-in integration for:

- `cursor` - Cursor IDE with @agent commands
- `claude-code` - Claude Code with /agent commands
- `windsurf` - Windsurf with @agent commands
- `roo` - Roo Code with custom modes (see `.roomodes`)
- More coming soon - BUT ITS easy to use with ANY IDE!

## Available Agents

### Core Development Team

| Agent       | Role               | Specialty                                     |
| ----------- | ------------------ | --------------------------------------------- |
| `analyst`   | Business Analyst   | market analysis, brainstorming, project brief |
| `pm`        | Product Manager    | Product strategy, roadmaps, PRDs              |
| `architect` | Solution Architect | System design, technical architecture         |
| `dev`       | Developer          | Code implementation across all technologies   |
| `qa`        | QA Specialist      | Testing strategies, quality assurance         |
| `ux-expert` | UX Designer        | User experience, UI design, prototypes        |
| `po`        | Product Owner      | Backlog management, story validation          |
| `sm`        | Scrum Master       | Sprint planning, story creation               |

### Meta Agents

| Agent               | Role             | Specialty                                                           |
| ------------------- | ---------------- | ------------------------------------------------------------------- |
| `bmad-orchestrator` | Team Coordinator | Multi-agent workflows, role switching, is part of every team bundle |
| `bmad-master`       | Universal Expert | All capabilities without switching                                  |

## Usage

### With IDE Integration

After installation with `--ide` flag:

````bash
# In Cursor
@pm Create a PRD for a task management app

# In Claude Code
/architect Design a microservices architecture

# In Windsurf
@dev Implement story 1.3
```text

### With Web UI (ChatGPT/Claude/Gemini)

After uploading a bundle you can ask /help of the agent to learn what it can do

### CLI Commands

```bash
# List all available agents
npx bmad-method list

# Install or update (automatically detects existing installations)
npx bmad-method install

# Check installation status
npx bmad-method status
````

### Upgrading from V3 to V4

If you have an existing BMAD-METHOD V3 project, simply run the installer in your project directory:

````bash
npx bmad-method install
# The installer will automatically detect your V3 installation and offer to upgrade
```text

The upgrade process will:

1. Create a backup of your V3 files in `.bmad-v3-backup/`
2. Install the new V4 `.bmad-core/` structure
3. Migrate your documents (PRD, Architecture, Stories, Epics)
4. Set up IDE integration for all V4 agents
5. Create an install manifest for future updates

After upgrading:

1. Review your documents in the `docs/` folder
2. Use `@bmad-master` agent to run the `doc-migration-task` to align your documents with V4 templates
3. If you have separate front-end and backend architecture docs, the migration task will help merge them into a unified `full-stack-architecture.md`

**Note**: The agents in `.bmad-core/` fully replace the items in `bmad-agent/`.

## Teams & Workflows

### Pre-Configured Teams

Save context by using specialized teams:

- **Team All**: Complete Agile team with all 10 agents
- **Team Fullstack**: Frontend + Backend development focus
- **Team No-UI**: Backend/API development without UX

### Workflows

Structured approaches for different scenarios:

- **Greenfield**: Starting new projects (fullstack/service/UI)
- **Brownfield**: Enhancing existing projects
- **Simple**: Quick prototypes and MVPs
- **Complex**: Enterprise and large-scale projects

## Project Structure

```plaintext
.bmad-core/
├── agents/          # Individual agent definitions
├── agent-teams/     # Team configurations
├── workflows/       # Development workflows
├── templates/       # Document templates (PRD, Architecture, etc.)
├── tasks/           # Reusable task definitions
├── checklists/      # Quality checklists
├── data/            # Knowledge base
└── web-bundles/     # Pre-built bundles

tools/
├── cli.js           # Build tool
├── installer/       # NPX installer
└── lib/             # Build utilities

expansion-packs/     # Optional add-ons (DevOps, Mobile, etc.)
````

## Advanced Features

### Dynamic Dependencies

Each agent only loads the resources it needs, keeping context windows lean.

### Template System

Rich templates for all document types:

- Product Requirements (PRD)
- Architecture Documents
- User Stories
- Test Plans
- And more...

### Slash Star Commands

Ask the agent you are using for help with /help (in the web) or \*help in the ide to see what commands are available!

## Contributing

We welcome contributions!

- 🆕 **New to GitHub?** Start with our [Pull Request Guide](docs/how-to-contribute-with-pull-requests.md)
- See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines

### Development Setup

```bash
git clone https://github.com/bmadcode/bmad-method.git
cd bmad-method
npm install
```

## Documentation & Guides

### Architecture & Technical

- 🏗️ [Core Architecture](docs/core-architecture.md) - Complete technical architecture and system design
- 📖 [User Guide](docs/user-guide.md) - Comprehensive guide to using BMAD-METHOD effectively

### Workflow Guides

- 📚 [Universal BMAD Workflow Guide](docs/bmad-workflow-guide.md) - Core workflow that applies to all IDEs
- 🎯 [Cursor Guide](docs/cursor-guide.md) - Complete workflow for Cursor users
- 🤖 [Claude Code Guide](docs/claude-code-guide.md) - Complete workflow for Claude Code users
- 🌊 [Windsurf Guide](docs/windsurf-guide.md) - Complete workflow for Windsurf users
- 🦘 [Roo Code Guide](docs/roo-code-guide.md) - Complete workflow for Roo Code users

## Support

- 💬 [Discord Community](https://discord.gg/g6ypHytrCB)
- 📖 [Documentation](docs/)
- 🐛 [Issue Tracker](https://github.com/bmadcode/bmad-method/issues)
- 💬 [Discussions](https://github.com/bmadcode/bmad-method/discussions)

## License

MIT License - see [LICENSE](LICENSE) for details.

## Version History

- **Current**: [v4](https://github.com/bmadcode/bmad-method) - Complete framework rewrite with CLI installer, dynamic dependencies, and expansion packs
- **Previous Versions**:
  - [Version 3](https://github.com/bmadcode/BMAD-METHOD/tree/V3) - Introduced the unified BMAD Agent and Gemini optimization
  - [Version 2](https://github.com/bmadcode/BMAD-METHOD/tree/V2) - Added web agents and template separation
  - [Version 1](https://github.com/bmadcode/BMAD-METHOD/tree/V1) - Original 7-file proof of concept

See [versions.md](docs/versions.md) for detailed version history and migration guides.

## Author

Created by Brian (BMad) Madison

---

[![Contributors](https://contrib.rocks/image?repo=bmadcode/bmad-method)](https://github.com/bmadcode/bmad-method/graphs/contributors)

<sub>Built with ❤️ for the AI-assisted development community</sub>
