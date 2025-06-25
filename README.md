# BMAD-METHOD

[![Version](https://img.shields.io/npm/v/bmad-method?color=blue&label=version)](https://www.npmjs.com/package/bmad-method)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)](https://nodejs.org)
[![Discord](https://img.shields.io/badge/Discord-Join%20Community-7289da?logo=discord&logoColor=white)](https://discord.gg/g6ypHytrCB)

**AI-Powered Agile Development Framework** - Transform your software development with specialized AI agents that work as your complete Agile team.

📺 **[Subscribe to BMadCode on YouTube](https://www.youtube.com/@BMadCode?sub_confirmation=1)** - V4 walkthrough and comprehensive guide coming soon!

⭐ **If you find this project helpful or useful, please give it a star!** It helps others discover BMAD-METHOD and you will be notified of updates!

## 🔄 Important: Keeping Your BMAD Installation Updated

**Stay up-to-date effortlessly!** If you already have BMAD-METHOD installed in your project, simply run:

```bash
npx bmad-method install
```

The installer will:

- ✅ Automatically detect your existing v4 installation
- ✅ Update only the files that have changed
- ✅ Create `.bak` backup files for any custom modifications you've made
- ✅ Preserve your project-specific configurations

This makes it easy to benefit from the latest improvements, bug fixes, and new agents without losing your customizations!

## 🚀 Quick Start

### Fastest Start: Web UI (2 minutes) 🏃‍♂️

1. **Get the bundle**: Copy `dist/teams/team-fullstack.txt` (from this repository)
2. **Create AI agent**: Create a new Gemini Gem or CustomGPT
3. **Upload & configure**: Upload the file and set instructions: "Your critical operating instructions are attached, do not break character as directed"
4. **Start Ideating and Planning**: Start chatting! Type `*help` to see available commands or pick an agent like `*analyst` to start right in on creating a brief.

> 💡 **All pre-built bundles are in the `dist/` folder** - ready to copy and use immediately!

### IDE Quick Start (5 minutes) 💻

**Prerequisites**: Install [Node.js](https://nodejs.org) (v20 or higher)

Run `npx bmad-method install`

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
   - **Recommended**: `dist/teams/team-fullstack.txt` (complete development team)
   - Or pick from individual agents in `dist/agents/`
2. Upload to your AI platform (Gemini Gem, CustomGPT, or directly in chat)
3. Set instructions: "Your critical operating instructions are attached, do not break character as directed"
4. Type `/help` to see available commands

### Method 2: CLI Installer (For IDEs) 🎯

**Prerequisites**: Install [Node.js](https://nodejs.org) v20+ first

Install directly into your project: `npx bmad-method install`

**Supported IDEs:**

The BMad Method works with any IDE, but has built-in integration for:

- `cursor` - Cursor IDE with @agent commands
- `claude-code` - Claude Code with /agent commands
- `windsurf` - Windsurf with @agent commands
- `roo` - Roo Code with custom modes (see `.roomodes`)
- More coming soon - BUT ITS easy to use with ANY IDE - just copy the bmad-code folder to your project, and rename it .bmad-code.

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

```bash
# In Cursor
@pm Create a PRD for a task management app

# In Claude Code
/architect Design a microservices architecture

# In Windsurf
@dev Implement story 1.3
```

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
```

### Upgrading from V3 to V4

If you have an existing BMAD-METHOD V3 project, simply run the installer in your project directory:

```bash
npx bmad-method install
# The installer will automatically detect your V3 installation and offer to upgrade
```

The upgrade process will:

1. Create a backup of your V3 files in `.bmad-v3-backup/`
2. Install the new V4 `.bmad-core/` structure
3. Migrate your documents (PRD, Architecture, Stories, Epics)
4. Set up IDE integration for all V4 agents
5. Create an install manifest for future updates

After upgrading:

1. Review your documents in the `docs/` folder - if you had a PRD or architecture in your old project, copy it from the backup to the docs folder if they are not there.
2. Optionally run the `doc-migration-task` to align your documents with V4 templates - you can do this with your agent my saying something like: 'run {drag in task} against {drag prd or arch file from docs} to align with {drag the template from .bmad-core/templates/full-stack-architecture.md}
3. If you have separate front-end and backend architecture docs you can modify step 2 to merge both into a single full stack architecture or separate Front and Back end.

The reason #2 and 3 are optional is because now BMad V4 makes sharding optional for the SM. See [Core Configuration](#-core-configuration-new-in-v4)

**Note**: The agents in `.bmad-core/` fully replace the items in `bmad-agent/` - you can remove the backup folder versions.

### 🔧 Core Configuration (NEW in V4)

**Critical**: V4 introduces `bmad-core/core-config.yml` - a powerful configuration file that enables BMAD to work seamlessly with any project structure, whether it's V4-optimized or legacy. You can even now use non-standard PRDs and architectures!

#### What is core-config.yml?

This configuration file tells BMAD agents exactly where to find your project documents and how they're structured. It's the key to V4's flexibility and backwards compatibility.

#### Key Features

- **Version Awareness**: Agents understand if your PRD/Architecture follows V4 conventions or earlier versions
- **Flexible Document Locations**: Works whether your epics are embedded in PRD or properly sharded
- **Developer Context**: Define which files the dev agent should always load
- **Debug Support**: Built-in logging for troubleshooting story implementation

#### Why It Matters

- **Use BMAD with ANY project structure** - V3, V4, or custom layouts
- **No forced migrations** - Keep your existing document organization
- **Customize developer workflow** - Specify exactly which files provide context
- **Seamless upgrades** - Start with V3 docs and gradually adopt V4 patterns

See the [detailed core-config.yml guide](docs/user-guide.md#core-configuration-coreconfigyml) for configuration examples and best practices.

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
└── web-bundles/     # Optional can be added if you use the install command and select this folder as a destination for the build bundle files

tools/
├── cli.js           # Build tool
├── installer/       # NPX installer
└── lib/             # Build utilities

expansion-packs/     # Domain-specific add-ons (Technical & Non-Technical)

dist/                # 📦 PRE-BUILT BUNDLES (Ready to use!)
├── agents/          # Individual agent bundles (.txt files)
├── teams/           # Team bundles (.txt files)
└── expansion-packs/ # Expansion pack bundles
```

### 📦 Pre-Built Bundles (dist/ folder)

**All ready-to-use bundles are in the `dist/` directory!**

- **Teams**: `dist/teams/` - Complete team configurations

  - `team-fullstack.txt` - Full-stack development team
  - `team-ide-minimal.txt` - Minimal IDE workflow team
  - `team-no-ui.txt` - Backend-only team
  - `team-all.txt` - All agents included

- **Individual Agents**: `dist/agents/` - Single agent files

  - One `.txt` file per agent (analyst, architect, dev, etc.)

- **Expansion Packs**: `dist/expansion-packs/` - Specialized domains
  - Game development, DevOps, etc.

**For Web UI usage**: Simply copy any `.txt` file from `dist/` and upload to your AI platform!`

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

## Expansion Packs - Beyond Software Development

BMAD Method's natural language framework isn't limited to software development. Create specialized agents for ANY domain:

### Technical Expansion Packs

- 🎮 **Game Development** - Game designers, level creators, narrative writers
- 🏗️ **Infrastructure/DevOps** - Cloud architects, security specialists, SRE agents
- 📱 **Mobile Development** - iOS/Android specialists, UX designers
- 🔗 **Blockchain/Web3** - Smart contract developers, DeFi architects

### Non-Technical Expansion Packs

- 💼 **Business Strategy** - Strategic planners, market analysts, business coaches
- 💪 **Health & Wellness** - Fitness coaches, nutrition advisors, meditation guides
- 🎨 **Creative Arts** - Story writers, world builders, character developers
- 📚 **Education** - Curriculum designers, tutors, learning coaches
- 🧠 **Personal Development** - Life coaches, goal setters, habit builders
- 🏢 **Professional Services** - Legal advisors, medical protocols, research assistants

### Creating Your Own Expansion Pack

The BMAD framework can support any domain where structured AI assistance is valuable:

1. Define specialized agents with domain expertise
2. Create task procedures for common workflows
3. Build templates for domain-specific outputs
4. Package as an expansion pack for others to use

📖 **[Read the full Expansion Packs Guide](docs/expansion-packs.md)** for detailed examples and inspiration!

🛠️ **[Use the Expansion Pack Creator](expansion-packs/expansion-creator/README.md)** to build your own!

## Contributing

**We're excited about contributions and welcome your ideas, improvements, and expansion packs!** 🎉

### Before Contributing - MUST READ

To ensure your contribution aligns with the BMAD Method and gets merged smoothly:

1. 📋 **Read [CONTRIBUTING.md](CONTRIBUTING.md)** - Our contribution guidelines, PR requirements, and process
2. 🎯 **Read [GUIDING-PRINCIPLES.md](GUIDING-PRINCIPLES.md)** - Core principles that keep BMAD powerful through simplicity
3. 🆕 **New to GitHub?** Start with our [Pull Request Guide](docs/how-to-contribute-with-pull-requests.md)

### Key Points to Remember

- Keep dev agents lean (save context for coding!)
- Use small, focused files over large branching ones
- Reuse existing tasks (like `create-doc`) instead of creating duplicates
- Consider expansion packs for domain-specific features
- All contributions must follow our natural language, markdown-based approach

We're building something amazing together - let's keep it simple, powerful, and focused! 💪

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
- 🚀 [Expansion Packs Guide](docs/expansion-packs.md) - Extend BMAD to any domain beyond software development

### Workflow Guides

- 📚 [Universal BMAD Workflow Guide](docs/bmad-workflow-guide.md) - Core workflow that applies to all IDEs
- 🏗️ [Working in the Brownfield Guide](docs/working-in-the-brownfield.md) - Complete guide for enhancing existing projects
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
