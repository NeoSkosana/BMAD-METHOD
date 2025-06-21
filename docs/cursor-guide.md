# BMAD Method Guide for Cursor

This guide walks you through the complete BMAD workflow using Cursor as your AI-powered IDE.

## Step 1: Install BMAD in Your Project

1. Navigate to your project directory
2. Run the BMAD installer:

   ```bash
   npx bmad-method install
   ```

3. When prompted:
   - **Installation Type**: Choose "Complete installation (recommended)"
   - **IDE**: Select "Cursor"

This creates a `.bmad-core` folder with all agents and a `.cursor/rules` folder with agent rules.

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

## Step 3: Back to Cursor - Document Sharding

Once you have your PRD and architecture documents in the `docs/` folder:

1. **Start a new chat in Cursor**
2. **Load the bmad-master agent**: Type `@bmad-master`
3. **Shard the PRD**: Type `*shard-doc docs/prd.md prd`
4. **Shard the architecture**: Type `*shard-doc docs/architecture.md architecture`

This creates organized folders:

- `docs/prd/` - Contains broken down PRD sections
- `docs/architecture/` - Contains broken down architecture sections

## Step 4: Story Development Cycle

Now begin the iterative development cycle:

### Create Stories (Scrum Master)

1. **Start a new chat**
2. **Load SM agent**: Type `@sm`
3. **Create story**: Type `*create` (this runs the create-next-story task)
4. **Review the generated story**
5. **If approved**: Set story status to "Approved" in the story file

### Implement Stories (Developer)

1. **Start a new chat**
2. **Load Dev agent**: Type `@dev`
3. **The agent will ask which story to implement**
4. **Follow the development tasks** the agent provides
5. **When story is complete**: Mark status as "Done"

### Repeat the Cycle

1. **Start a new chat with SM agent** (`@sm`)
2. **Create next story**: Type `*create`
3. **Review and approve**
4. **Start new chat with Dev agent** (`@dev`)
5. **Implement the story**
6. **Repeat until project complete**

## Available Agent Rules in Cursor

All BMAD agents are available as Cursor rules (use `@` prefix):

- `@bmad-master` - Universal task executor
- `@sm` - Scrum Master for story creation
- `@dev` - Full-stack developer for implementation
- `@architect` - Solution architect for design
- `@pm` - Product manager for planning
- `@analyst` - Business analyst for requirements
- `@qa` - QA specialist for testing
- `@po` - Product owner for prioritization
- `@ux-expert` - UX specialist for design

Alternatively, and more performance - you can copy the contents of an agent file into a custom mode - see the cursor docs on how to use custom agents.

## Cursor-Specific Features

- **Agent rules are stored in**: `.cursor/rules/` as `.mdc` files
- **Auto-completion**: Cursor will suggest `@agent-name` as you type
- **Rule activation**: Rules activate automatically when you mention `@agent-name`
- **Context awareness**: Agents have access to your current file context

## Key Workflow Principles

1. **Always start new chats** when switching agents to avoid context confusion
2. **Use Gemini for initial planning** and ideation with the team-fullstack bundle
3. **Use bmad-master for document management** (sharding, templates, etc.)
4. **Follow the SM → Dev cycle** for consistent story development
5. **Review and approve stories** before implementation begins

## Tips for Success

- **Keep chats focused**: Each chat should have one agent and one primary task
- **Use \*help command**: Every agent supports `*help` to see available commands
- **Review generated content**: Always review and approve stories before marking them ready
- **Maintain status updates**: Keep story statuses current (Draft → Approved → InProgress → Done)
- **Leverage Cursor's context**: Agents can see your current file selection for better assistance

This workflow ensures systematic, AI-assisted development following agile principles with clear handoffs between planning, story creation, and implementation phases.
