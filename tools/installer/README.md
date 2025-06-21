# BMAD Method Installer

This directory contains the BMAD Method installer implementation.

## Structure

```text
installer/
├── bin/              # CLI entry points
│   └── bmad.js      # Main CLI executable
├── lib/             # Core implementation
│   ├── installer.js # Main installation logic
│   ├── updater.js   # Update management
│   ├── config-loader.js # YAML config parsing
│   ├── file-manager.js  # File operations
│   ├── ide-setup.js     # IDE-specific setup
│   └── prompts.js       # Interactive CLI prompts
├── config/          # Configuration files
│   └── install.config.yml # Installation profiles
├── templates/       # IDE template files
│   ├── cursor-rules.md     # Cursor template
│   ├── claude-commands.md  # Claude Code template
│   └── windsurf-rules.md   # Windsurf template
└── package.json     # NPM package configuration
```

## Installation Profiles

- **minimal**: IDE agents only (best for beginners)
- **core**: IDE + Web agents
- **teams**: Full team workflows
- **developer**: Everything including creation tools

## Usage

```bash
# Interactive installation
npx bmad-method install

# Direct profile installation
npx bmad-method install --profile=minimal

# Update existing installation
npx bmad-method update
```

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Lint code
npm run lint
```
