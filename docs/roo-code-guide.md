# BMAD Method Guide for Roo Code

This guide walks you through the complete BMAD workflow using Roo Code as your AI-powered IDE.

## Step 1: Install BMAD in Your Project

1. Navigate to your project directory
2. Run the BMAD installer:

   ```bash
   npx bmad-method install
   ```

3. When prompted:
   - **Installation Type**: Choose "Complete installation (recommended)"
   - **IDE**: Select "Roo Code"

This creates a `.bmad-core` folder with all agents and a `.roomodes` file (in the project root) with custom modes.

## Step 2: Set Up Team Fullstack in Gemini

For ideation and planning, use Google's Gemini Custom Gem with the team-fullstack configuration:

1. Open [Google gems](https://gemini.google.com/gems/view)
2. Create a new Gem - give it a title and description
3. Copy the contents of `.<install location>/<web-bundles>/teams/team-fullstack.txt` (location can vary if you chose a non default installation location for the bundles) - or just use the bundle premade from the repo dist folder.
4. Paste this content into Gemini to set up the team

### Gemini Planning Phase

In Gemini, ask the BMAD team to help you:

- **Ideate** your project concept
- **Brainstorm** features and requirements
- **Create a PRD** (Product Requirements Document)
- **Design the architecture**

Ask questions like:

- "Help me brainstorm a [type of application] that does [core functionality]"
- "Create a comprehensive PRD for this concept"
- "Design the technical architecture for this system"

Copy the PRD and architecture documents that Gemini creates into your project's `docs/` folder:

- `docs/prd.md`
- `docs/architecture.md`

## Step 3: Back to Roo Code - Document Sharding

Once you have your PRD and architecture documents in the `docs/` folder:

1. **Open your project in Roo Code**
2. **Select the bmad-master mode** from the mode selector (usually in status bar)
3. **Shard the PRD**: Type `*shard-doc docs/prd.md prd`
4. **Shard the architecture**: Type `*shard-doc docs/architecture.md architecture`

This creates organized folders:

- `docs/prd/` - Contains broken down PRD sections
- `docs/architecture/` - Contains broken down architecture sections

## Step 4: Story Development Cycle

Now begin the iterative development cycle:

### Create Stories (Scrum Master)

1. **Start a new chat or conversation**
2. **Switch to SM mode**: Select `bmad-sm` from the mode selector
3. **Create story**: Type `*create` (this runs the create-next-story task)
4. **Review the generated story**
5. **If approved**: Set story status to "Approved" in the story file

### Implement Stories (Developer)

1. **Start a new conversation**
2. **Switch to Dev mode**: Select `bmad-dev` from the mode selector
3. **The agent will ask which story to implement**
4. **Follow the development tasks** the agent provides
5. **When story is complete**: Mark status as "Done"

### Repeat the Cycle

1. **Switch to SM mode** (`bmad-sm`)
2. **Create next story**: Type `*create`
3. **Review and approve**
4. **Switch to Dev mode** (`bmad-dev`)
5. **Implement the story**
6. **Repeat until project complete**

## Available Custom Modes in Roo Code

All BMAD agents are available as custom modes:

- `bmad-bmad-master` - 🧙 Universal task executor
- `bmad-sm` - 🏃 Scrum Master for story creation
- `bmad-dev` - 💻 Full-stack developer for implementation
- `bmad-architect` - 🏗️ Solution architect for design
- `bmad-pm` - 📋 Product manager for planning
- `bmad-analyst` - 📊 Business analyst for requirements
- `bmad-qa` - 🧪 QA specialist for testing
- `bmad-po` - 🎯 Product owner for prioritization
- `bmad-ux-expert` - 🎨 UX specialist for design

## Roo Code-Specific Features

- **Custom modes are stored in**: `.roomodes` file (in the project root)
- **Mode switching**: Use the mode selector in Roo Code's interface
- **File permissions**: Each agent has specific file access permissions
  - **Documentation agents** (SM, PM, PO, Analyst): Limited to `.md` and `.txt` files
  - **Technical agents** (Dev, Architect, Master): Full file access
  - **QA agents**: Access to test files and documentation
  - **UX agents**: Access to design-related files
- **Context preservation**: Modes maintain context within conversations

## Key Workflow Principles

1. **Switch modes instead of starting new chats** - Roo Code handles context better with mode switching
2. **Use Gemini for initial planning** and ideation with the team-fullstack bundle
3. **Use bmad-master mode for document management** (sharding, templates, etc.)
4. **Follow the SM → Dev mode cycle** for consistent story development
5. **Review and approve stories** before implementation begins

## Tips for Success

- **Use mode selector effectively**: Switch modes as needed for different tasks
- **Respect file permissions**: Agents can only edit files they have permission for
- **Use \*help command**: Every mode supports `*help` to see available commands
- **Review generated content**: Always review and approve stories before marking them ready
- **Maintain status updates**: Keep story statuses current (Draft → Approved → InProgress → Done)
- **Leverage Roo's context**: Modes can maintain context across the conversation

## File Permission Summary

- **bmad-analyst, bmad-pm, bmad-po, bmad-sm**: `.md`, `.txt` files only
- **bmad-architect**: `.md`, `.txt`, `.yml`, `.yaml`, `.json` files
- **bmad-qa**: Test files (`.test.js`, `.spec.ts`, etc.) and `.md` files
- **bmad-ux-expert**: `.md`, `.css`, `.scss`, `.html`, `.jsx`, `.tsx` files
- **bmad-dev, bmad-bmad-master, bmad-orchestrator**: Full file access

This workflow ensures systematic, AI-assisted development following agile principles with clear handoffs between planning, story creation, and implementation phases.
