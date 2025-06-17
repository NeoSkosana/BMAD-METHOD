#!/usr/bin/env node

const { program } = require('commander');

// Dynamic imports for ES modules
let chalk, inquirer;

// Initialize ES modules
async function initializeModules() {
  if (!chalk) {
    chalk = (await import('chalk')).default;
    inquirer = (await import('inquirer')).default;
  }
}

// Handle both execution contexts (from root via npx or from installer directory)
let version;
let installer;
try {
  // Try installer context first (when run from tools/installer/)
  version = require('../package.json').version;
  installer = require('../lib/installer');
} catch (e) {
  // Fall back to root context (when run via npx from GitHub)
  console.log(`Installer context not found (${e.message}), trying root context...`);
  try {
    version = require('../../../package.json').version;
    installer = require('../../../tools/installer/lib/installer');
  } catch (e2) {
    console.error('Error: Could not load required modules. Please ensure you are running from the correct directory.');
    console.error('Debug info:', {
      __dirname,
      cwd: process.cwd(),
      error: e2.message
    });
    process.exit(1);
  }
}

program
  .version(version)
  .description('BMAD Method installer - AI-powered Agile development framework');

program
  .command('install')
  .description('Install BMAD Method agents and tools')
  .option('-f, --full', 'Install complete .bmad-core folder')
  .option('-a, --agent <agent>', 'Install specific agent with dependencies')
  .option('-t, --team <team>', 'Install specific team with required agents and dependencies')
  .option('-x, --expansion-only', 'Install only expansion packs (no bmad-core)')
  .option('-d, --directory <path>', 'Installation directory (default: .bmad-core)')
  .option('-i, --ide <ide...>', 'Configure for specific IDE(s) - can specify multiple (cursor, claude-code, windsurf, roo, other)')
  .option('-e, --expansion-packs <packs...>', 'Install specific expansion packs (can specify multiple)')
  .action(async (options) => {
    try {
      await initializeModules();
      if (!options.full && !options.agent && !options.team && !options.expansionOnly) {
        // Interactive mode
        const answers = await promptInstallation();
        await installer.install(answers);
      } else {
        // Direct mode
        let installType = 'full';
        if (options.agent) installType = 'single-agent';
        else if (options.team) installType = 'team';
        else if (options.expansionOnly) installType = 'expansion-only';
        
        const config = {
          installType,
          agent: options.agent,
          team: options.team,
          directory: options.directory || '.bmad-core',
          ides: (options.ide || []).filter(ide => ide !== 'other'),
          expansionPacks: options.expansionPacks || []
        };
        await installer.install(config);
      }
    } catch (error) {
      if (!chalk) await initializeModules();
      console.error(chalk.red('Installation failed:'), error.message);
      process.exit(1);
    }
  });

program
  .command('update')
  .description('Update existing BMAD installation')
  .option('--force', 'Force update, overwriting modified files')
  .option('--dry-run', 'Show what would be updated without making changes')
  .action(async () => {
    try {
      await installer.update();
    } catch (error) {
      if (!chalk) await initializeModules();
      console.error(chalk.red('Update failed:'), error.message);
      process.exit(1);
    }
  });

program
  .command('list')
  .description('List available agents')
  .action(async () => {
    try {
      await installer.listAgents();
    } catch (error) {
      if (!chalk) await initializeModules();
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

program
  .command('list:expansions')
  .description('List available expansion packs')
  .action(async () => {
    try {
      await installer.listExpansionPacks();
    } catch (error) {
      if (!chalk) await initializeModules();
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

program
  .command('status')
  .description('Show installation status')
  .action(async () => {
    try {
      await installer.showStatus();
    } catch (error) {
      if (!chalk) await initializeModules();
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

async function promptInstallation() {
  await initializeModules();
  console.log(chalk.bold.blue(`\nWelcome to BMAD Method Installer v${version}\n`));

  const answers = {};

  // Ask for installation directory
  const { directory } = await inquirer.prompt([
    {
      type: 'input',
      name: 'directory',
      message: 'Enter the full path to your project directory where BMAD should be installed:',
      validate: (input) => {
        if (!input.trim()) {
          return 'Please enter a valid project path';
        }
        return true;
      }
    }
  ]);
  answers.directory = directory;

  // Ask for installation type
  const { installType } = await inquirer.prompt([
    {
      type: 'list',
      name: 'installType',
      message: 'How would you like to install BMAD?',
      choices: [
        {
          name: 'Complete installation (recommended) - All agents and tools',
          value: 'full'
        },
        {
          name: 'Team installation - Install a specific team with required agents',
          value: 'team'
        },
        {
          name: 'Single agent - Choose one agent to install',
          value: 'single-agent'
        },
        {
          name: 'Expansion packs only - Install expansion packs without bmad-core',
          value: 'expansion-only'
        }
      ]
    }
  ]);
  answers.installType = installType;

  // If single agent, ask which one
  if (installType === 'single-agent') {
    const agents = await installer.getAvailableAgents();
    const { agent } = await inquirer.prompt([
      {
        type: 'list',
        name: 'agent',
        message: 'Select an agent to install:',
        choices: agents.map(a => ({
          name: `${a.id} - ${a.name} (${a.description})`,
          value: a.id
        }))
      }
    ]);
    answers.agent = agent;
  }

  // If team installation, ask which team
  if (installType === 'team') {
    const teams = await installer.getAvailableTeams();
    const { team } = await inquirer.prompt([
      {
        type: 'list',
        name: 'team',
        message: 'Select a team to install:',
        choices: teams.map(t => ({
          name: `${t.icon || '📋'} ${t.name}: ${t.description}`,
          value: t.id
        }))
      }
    ]);
    answers.team = team;
  }

  // Ask for expansion pack selection
  if (installType === 'full' || installType === 'team' || installType === 'expansion-only') {
    try {
      const availableExpansionPacks = await installer.getAvailableExpansionPacks();
      
      if (availableExpansionPacks.length > 0) {
        let choices;
        let message;
        
        if (installType === 'expansion-only') {
          message = 'Select expansion packs to install (required):'
          choices = availableExpansionPacks.map(pack => ({
            name: `${pack.name} - ${pack.description}`,
            value: pack.id
          }));
        } else {
          message = 'Select expansion packs to install (press Enter to skip, or check any to install):';
          choices = availableExpansionPacks.map(pack => ({
            name: `${pack.name} - ${pack.description}`,
            value: pack.id
          }));
        }
        
        const { expansionPacks } = await inquirer.prompt([
          {
            type: 'checkbox',
            name: 'expansionPacks',
            message,
            choices,
            validate: installType === 'expansion-only' ? (answer) => {
              if (answer.length < 1) {
                return 'You must select at least one expansion pack for expansion-only installation.';
              }
              return true;
            } : undefined
          }
        ]);
        
        // Use selected expansion packs directly
        answers.expansionPacks = expansionPacks;
      } else {
        answers.expansionPacks = [];
      }
    } catch (error) {
      console.warn(chalk.yellow('Warning: Could not load expansion packs. Continuing without them.'));
      answers.expansionPacks = [];
    }
  } else {
    answers.expansionPacks = [];
  }

  // Ask for IDE configuration
  const { ides } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'ides',
      message: 'Which IDE(s) are you using? (press Enter to skip IDE setup, or select any to configure):',
      choices: [
        { name: 'Cursor', value: 'cursor' },
        { name: 'Claude Code', value: 'claude-code' },
        { name: 'Windsurf', value: 'windsurf' },
        { name: 'Roo Code', value: 'roo' }
      ]
    }
  ]);
  
  // Use selected IDEs directly
  answers.ides = ides;

  return answers;
}

program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}