const path = require("node:path");
const fileManager = require("./file-manager");
const configLoader = require("./config-loader");
const ideSetup = require("./ide-setup");

// Dynamic imports for ES modules
let chalk, ora, inquirer;

// Initialize ES modules
async function initializeModules() {
  if (!chalk) {
    chalk = (await import("chalk")).default;
    ora = (await import("ora")).default;
    inquirer = (await import("inquirer")).default;
  }
}

class Installer {
  async install(config) {
    // Initialize ES modules
    await initializeModules();
    
    const spinner = ora("Analyzing installation directory...").start();

    try {
      // Store the original CWD where npx was executed
      const originalCwd = process.env.INIT_CWD || process.env.PWD || process.cwd();
      
      // Resolve installation directory relative to where the user ran the command
      let installDir = path.isAbsolute(config.directory) 
        ? config.directory 
        : path.resolve(originalCwd, config.directory);
        
      if (path.basename(installDir) === '.bmad-core') {
        // If user points directly to .bmad-core, treat its parent as the project root
        installDir = path.dirname(installDir);
      }
      
      // Log resolved path for clarity
      if (!path.isAbsolute(config.directory)) {
        spinner.text = `Resolving "${config.directory}" to: ${installDir}`;
      }

      // Check if directory exists and handle non-existent directories
      if (!(await fileManager.pathExists(installDir))) {
        spinner.stop();
        console.log(chalk.yellow(`\nThe directory ${chalk.bold(installDir)} does not exist.`));
        
        const { action } = await inquirer.prompt([
          {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
              {
                name: 'Create the directory and continue',
                value: 'create'
              },
              {
                name: 'Choose a different directory',
                value: 'change'
              },
              {
                name: 'Cancel installation',
                value: 'cancel'
              }
            ]
          }
        ]);

        if (action === 'cancel') {
          console.log(chalk.red('Installation cancelled.'));
          process.exit(0);
        } else if (action === 'change') {
          const { newDirectory } = await inquirer.prompt([
            {
              type: 'input',
              name: 'newDirectory',
              message: 'Enter the new directory path:',
              validate: (input) => {
                if (!input.trim()) {
                  return 'Please enter a valid directory path';
                }
                return true;
              }
            }
          ]);
          // Preserve the original CWD for the recursive call
          config.directory = newDirectory;
          return await this.install(config); // Recursive call with new directory
        } else if (action === 'create') {
          try {
            await fileManager.ensureDirectory(installDir);
            console.log(chalk.green(`✓ Created directory: ${installDir}`));
          } catch (error) {
            console.error(chalk.red(`Failed to create directory: ${error.message}`));
            console.error(chalk.yellow('You may need to check permissions or use a different path.'));
            process.exit(1);
          }
        }
        
        spinner.start("Analyzing installation directory...");
      }

      // If this is an update request from early detection, handle it directly
      if (config.installType === 'update') {
        const state = await this.detectInstallationState(installDir);
        if (state.type === 'v4_existing') {
          return await this.performUpdate(config, installDir, state.manifest, spinner);
        } else {
          spinner.fail('No existing v4 installation found to update');
          throw new Error('No existing v4 installation found');
        }
      }

      // Detect current state
      const state = await this.detectInstallationState(installDir);

      // Handle different states
      switch (state.type) {
        case "clean":
          return await this.performFreshInstall(config, installDir, spinner);

        case "v4_existing":
          return await this.handleExistingV4Installation(
            config,
            installDir,
            state,
            spinner
          );

        case "v3_existing":
          return await this.handleV3Installation(
            config,
            installDir,
            state,
            spinner
          );

        case "unknown_existing":
          return await this.handleUnknownInstallation(
            config,
            installDir,
            state,
            spinner
          );
      }
    } catch (error) {
      spinner.fail("Installation failed");
      throw error;
    }
  }

  async detectInstallationState(installDir) {
    // Ensure modules are initialized
    await initializeModules();
    const state = {
      type: "clean",
      hasV4Manifest: false,
      hasV3Structure: false,
      hasBmadCore: false,
      hasOtherFiles: false,
      manifest: null,
    };

    // Check if directory exists
    if (!(await fileManager.pathExists(installDir))) {
      return state; // clean install
    }

    // Check for V4 installation (has .bmad-core with manifest)
    const bmadCorePath = path.join(installDir, ".bmad-core");
    const manifestPath = path.join(bmadCorePath, "install-manifest.yml");

    if (await fileManager.pathExists(manifestPath)) {
      state.type = "v4_existing";
      state.hasV4Manifest = true;
      state.hasBmadCore = true;
      state.manifest = await fileManager.readManifest(installDir);
      return state;
    }

    // Check for V3 installation (has bmad-agent directory)
    const bmadAgentPath = path.join(installDir, "bmad-agent");
    if (await fileManager.pathExists(bmadAgentPath)) {
      state.type = "v3_existing";
      state.hasV3Structure = true;
      return state;
    }

    // Check for .bmad-core without manifest (broken V4 or manual copy)
    if (await fileManager.pathExists(bmadCorePath)) {
      state.type = "unknown_existing";
      state.hasBmadCore = true;
      return state;
    }

    // Check if directory has other files
    const glob = require("glob");
    const files = glob.sync("**/*", {
      cwd: installDir,
      nodir: true,
      ignore: ["**/.git/**", "**/node_modules/**"],
    });

    if (files.length > 0) {
      // Directory has other files, but no BMAD installation.
      // Treat as clean install but record that it isn't empty.
      state.hasOtherFiles = true;
    }

    return state; // clean install
  }

  async performFreshInstall(config, installDir, spinner) {
    // Ensure modules are initialized
    await initializeModules();
    spinner.text = "Installing BMAD Method...";

    let files = [];

    if (config.installType === "full") {
      // Full installation - copy entire .bmad-core folder as a subdirectory
      spinner.text = "Copying complete .bmad-core folder...";
      const sourceDir = configLoader.getBmadCorePath();
      const bmadCoreDestDir = path.join(installDir, ".bmad-core");
      await fileManager.copyDirectory(sourceDir, bmadCoreDestDir);

      // Get list of all files for manifest
      const glob = require("glob");
      files = glob
        .sync("**/*", {
          cwd: bmadCoreDestDir,
          nodir: true,
          ignore: ["**/.git/**", "**/node_modules/**"],
        })
        .map((file) => path.join(".bmad-core", file));
    } else if (config.installType === "single-agent") {
      // Single agent installation
      spinner.text = `Installing ${config.agent} agent...`;

      // Copy agent file
      const agentPath = configLoader.getAgentPath(config.agent);
      const destAgentPath = path.join(
        installDir,
        ".bmad-core",
        "agents",
        `${config.agent}.md`
      );
      await fileManager.copyFile(agentPath, destAgentPath);
      files.push(`.bmad-core/agents/${config.agent}.md`);

      // Copy dependencies
      const dependencies = await configLoader.getAgentDependencies(
        config.agent
      );
      const sourceBase = configLoader.getBmadCorePath();

      for (const dep of dependencies) {
        spinner.text = `Copying dependency: ${dep}`;

        if (dep.includes("*")) {
          // Handle glob patterns
          const copiedFiles = await fileManager.copyGlobPattern(
            dep.replace(".bmad-core/", ""),
            sourceBase,
            path.join(installDir, ".bmad-core")
          );
          files.push(...copiedFiles.map(f => `.bmad-core/${f}`));
        } else {
          // Handle single files
          const sourcePath = path.join(
            sourceBase,
            dep.replace(".bmad-core/", "")
          );
          const destPath = path.join(
            installDir,
            dep
          );

          if (await fileManager.copyFile(sourcePath, destPath)) {
            files.push(dep);
          }
        }
      }
    } else if (config.installType === "team") {
      // Team installation
      spinner.text = `Installing ${config.team} team...`;
      
      // Get team dependencies
      const teamDependencies = await configLoader.getTeamDependencies(config.team);
      const sourceBase = configLoader.getBmadCorePath();
      
      // Install all team dependencies
      for (const dep of teamDependencies) {
        spinner.text = `Copying team dependency: ${dep}`;
        
        if (dep.includes("*")) {
          // Handle glob patterns
          const copiedFiles = await fileManager.copyGlobPattern(
            dep.replace(".bmad-core/", ""),
            sourceBase,
            path.join(installDir, ".bmad-core")
          );
          files.push(...copiedFiles.map(f => `.bmad-core/${f}`));
        } else {
          // Handle single files
          const sourcePath = path.join(sourceBase, dep.replace(".bmad-core/", ""));
          const destPath = path.join(installDir, dep);
          
          if (await fileManager.copyFile(sourcePath, destPath)) {
            files.push(dep);
          }
        }
      }
    } else if (config.installType === "expansion-only") {
      // Expansion-only installation - create minimal .bmad-core structure
      spinner.text = "Creating minimal .bmad-core structure for expansion packs...";
      
      const bmadCoreDestDir = path.join(installDir, ".bmad-core");
      await fileManager.ensureDirectory(bmadCoreDestDir);
      
      // Create basic directory structure
      const dirs = ['agents', 'agent-teams', 'templates', 'tasks', 'checklists', 'workflows', 'data', 'utils', 'schemas'];
      for (const dir of dirs) {
        await fileManager.ensureDirectory(path.join(bmadCoreDestDir, dir));
      }
      
      // Copy minimal required files (schemas, utils, etc.)
      const sourceBase = configLoader.getBmadCorePath();
      const essentialFiles = [
        'schemas/**/*',
        'utils/**/*'
      ];
      
      for (const pattern of essentialFiles) {
        const copiedFiles = await fileManager.copyGlobPattern(
          pattern,
          sourceBase,
          bmadCoreDestDir
        );
        files.push(...copiedFiles.map(f => `.bmad-core/${f}`));
      }
    }

    // Install expansion packs if requested
    const expansionFiles = await this.installExpansionPacks(installDir, config.expansionPacks, spinner);
    files.push(...expansionFiles);

    // Install web bundles if requested
    if (config.includeWebBundles && config.webBundlesDirectory) {
      spinner.text = "Installing web bundles...";
      // Resolve web bundles directory using the same logic as the main installation directory
      const originalCwd = process.env.INIT_CWD || process.env.PWD || process.cwd();
      let resolvedWebBundlesDir = path.isAbsolute(config.webBundlesDirectory) 
        ? config.webBundlesDirectory 
        : path.resolve(originalCwd, config.webBundlesDirectory);
      await this.installWebBundles(resolvedWebBundlesDir, config, spinner);
    }

    // Set up IDE integration if requested
    const ides = config.ides || (config.ide ? [config.ide] : []);
    if (ides.length > 0) {
      for (const ide of ides) {
        spinner.text = `Setting up ${ide} integration...`;
        await ideSetup.setup(ide, installDir, config.agent);
      }
    }

    // Create manifest
    spinner.text = "Creating installation manifest...";
    await fileManager.createManifest(installDir, config, files);

    spinner.succeed("Installation complete!");
    this.showSuccessMessage(config, installDir);
  }

  async handleExistingV4Installation(config, installDir, state, spinner) {
    // Ensure modules are initialized
    await initializeModules();
    spinner.stop();

    console.log(chalk.yellow("\n🔍 Found existing BMAD v4 installation"));
    console.log(`   Directory: ${installDir}`);
    console.log(`   Version: ${state.manifest.version}`);
    console.log(
      `   Installed: ${new Date(
        state.manifest.installed_at
      ).toLocaleDateString()}`
    );

    const { action } = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: [
          { name: "Update existing installation", value: "update" },
          { name: "Reinstall (overwrite)", value: "reinstall" },
          { name: "Cancel", value: "cancel" },
        ],
      },
    ]);

    switch (action) {
      case "update":
        return await this.performUpdate(config, installDir, state.manifest, spinner);
      case "reinstall":
        return await this.performReinstall(config, installDir, spinner);
      case "cancel":
        console.log("Installation cancelled.");
        return;
    }
  }

  async handleV3Installation(config, installDir, state, spinner) {
    // Ensure modules are initialized
    await initializeModules();
    spinner.stop();

    console.log(
      chalk.yellow("\n🔍 Found BMAD v3 installation (bmad-agent/ directory)")
    );
    console.log(`   Directory: ${installDir}`);

    const { action } = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: [
          { name: "Upgrade from v3 to v4 (recommended)", value: "upgrade" },
          { name: "Install v4 alongside v3", value: "alongside" },
          { name: "Cancel", value: "cancel" },
        ],
      },
    ]);

    switch (action) {
      case "upgrade": {
        console.log(chalk.cyan("\n📦 Starting v3 to v4 upgrade process..."));
        const V3ToV4Upgrader = require("../../upgraders/v3-to-v4-upgrader");
        const upgrader = new V3ToV4Upgrader();
        return await upgrader.upgrade({ 
          projectPath: installDir,
          ides: config.ides || [] // Pass IDE selections from initial config
        });
      }
      case "alongside":
        return await this.performFreshInstall(config, installDir, spinner);
      case "cancel":
        console.log("Installation cancelled.");
        return;
    }
  }

  async handleUnknownInstallation(config, installDir, state, spinner) {
    // Ensure modules are initialized
    await initializeModules();
    spinner.stop();

    console.log(chalk.yellow("\n⚠️  Directory contains existing files"));
    console.log(`   Directory: ${installDir}`);

    if (state.hasBmadCore) {
      console.log("   Found: .bmad-core directory (but no manifest)");
    }
    if (state.hasOtherFiles) {
      console.log("   Found: Other files in directory");
    }

    const { action } = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: [
          { name: "Install anyway (may overwrite files)", value: "force" },
          { name: "Choose different directory", value: "different" },
          { name: "Cancel", value: "cancel" },
        ],
      },
    ]);

    switch (action) {
      case "force":
        return await this.performFreshInstall(config, installDir, spinner);
      case "different": {
        const { newDir } = await inquirer.prompt([
          {
            type: "input",
            name: "newDir",
            message: "Enter new installation directory:",
            default: path.join(path.dirname(installDir), "bmad-project"),
          },
        ]);
        config.directory = newDir;
        return await this.install(config);
      }
      case "cancel":
        console.log("Installation cancelled.");
        return;
    }
  }

  async performUpdate(newConfig, installDir, manifest, spinner) {
    spinner.start("Checking for updates...");

    try {
      // Check for modified files
      spinner.text = "Checking for modified files...";
      const modifiedFiles = await fileManager.checkModifiedFiles(
        installDir,
        manifest
      );

      if (modifiedFiles.length > 0) {
        spinner.warn("Found modified files");
        console.log(chalk.yellow("\nThe following files have been modified:"));
        for (const file of modifiedFiles) {
          console.log(`  - ${file}`);
        }

        const { action } = await inquirer.prompt([
          {
            type: "list",
            name: "action",
            message: "How would you like to proceed?",
            choices: [
              { name: "Backup and overwrite modified files", value: "backup" },
              { name: "Skip modified files", value: "skip" },
              { name: "Cancel update", value: "cancel" },
            ],
          },
        ]);

        if (action === "cancel") {
          console.log("Update cancelled.");
          return;
        }

        if (action === "backup") {
          spinner.start("Backing up modified files...");
          for (const file of modifiedFiles) {
            const filePath = path.join(installDir, file);
            const backupPath = await fileManager.backupFile(filePath);
            console.log(
              chalk.dim(`  Backed up: ${file} → ${path.basename(backupPath)}`)
            );
          }
        }
      }

      // Perform update by re-running installation
      spinner.text = "Updating files...";
      const config = {
        installType: manifest.install_type,
        agent: manifest.agent,
        directory: installDir,
        ide: newConfig?.ide || manifest.ide_setup, // Use new IDE choice if provided
        ides: newConfig?.ides || manifest.ides_setup || [],
      };

      await this.performFreshInstall(config, installDir, spinner);
    } catch (error) {
      spinner.fail("Update failed");
      throw error;
    }
  }

  async performReinstall(config, installDir, spinner) {
    spinner.start("Reinstalling BMAD Method...");

    // Remove existing .bmad-core
    const bmadCorePath = path.join(installDir, ".bmad-core");
    if (await fileManager.pathExists(bmadCorePath)) {
      await fileManager.removeDirectory(bmadCorePath);
    }

    return await this.performFreshInstall(config, installDir, spinner);
  }

  showSuccessMessage(config, installDir) {
    console.log(chalk.green("\n✓ BMAD Method installed successfully!\n"));

    const ides = config.ides || (config.ide ? [config.ide] : []);
    if (ides.length > 0) {
      for (const ide of ides) {
        const ideConfig = configLoader.getIdeConfiguration(ide);
        if (ideConfig?.instructions) {
          console.log(
            chalk.bold(`To use BMAD agents in ${ideConfig.name}:`)
          );
          console.log(ideConfig.instructions);
        }
      }
    } else {
      console.log(chalk.yellow("No IDE configuration was set up."));
      console.log(
        "You can manually configure your IDE using the agent files in:",
        installDir
      );
    }

    // Information about installation components
    console.log(chalk.bold("\n🎯 Installation Summary:"));
    console.log(chalk.green("✓ .bmad-core framework installed with all agents and workflows"));
    
    if (config.expansionPacks && config.expansionPacks.length > 0) {
      const packNames = config.expansionPacks.join(", ");
      console.log(chalk.green(`✓ Expansion packs installed: ${packNames}`));
    }
    
    if (config.includeWebBundles && config.webBundlesDirectory) {
      const bundleInfo = this.getWebBundleInfo(config);
      // Resolve the web bundles directory for display
      const originalCwd = process.env.INIT_CWD || process.env.PWD || process.cwd();
      const resolvedWebBundlesDir = path.isAbsolute(config.webBundlesDirectory) 
        ? config.webBundlesDirectory 
        : path.resolve(originalCwd, config.webBundlesDirectory);
      console.log(chalk.green(`✓ Web bundles (${bundleInfo}) installed to: ${resolvedWebBundlesDir}`));
    }
    
    if (ides.length > 0) {
      const ideNames = ides.map(ide => {
        const ideConfig = configLoader.getIdeConfiguration(ide);
        return ideConfig?.name || ide;
      }).join(", ");
      console.log(chalk.green(`✓ IDE rules and configurations set up for: ${ideNames}`));
    }

    // Information about web bundles
    if (!config.includeWebBundles) {
      console.log(chalk.bold("\n📦 Web Bundles Available:"));
      console.log("Pre-built web bundles are available and can be added later:");
      console.log(chalk.cyan("  Run the installer again to add them to your project"));
      console.log("These bundles work independently and can be shared, moved, or used");
      console.log("in other projects as standalone files.");
    }

    if (config.installType === "single-agent") {
      console.log(
        chalk.dim(
          "\nNeed other agents? Run: npx bmad-method install --agent=<name>"
        )
      );
      console.log(
        chalk.dim("Need everything? Run: npx bmad-method install --full")
      );
    }
  }

  // Legacy method for backward compatibility
  async update() {
    // Initialize ES modules
    await initializeModules();
    console.log(chalk.yellow('The "update" command is deprecated.'));
    console.log(
      'Please use "install" instead - it will detect and offer to update existing installations.'
    );

    const installDir = await this.findInstallation();
    if (installDir) {
      const config = {
        installType: "full",
        directory: path.dirname(installDir),
        ide: null,
      };
      return await this.install(config);
    }
    console.log(chalk.red("No BMAD installation found."));
  }

  async listAgents() {
    // Initialize ES modules
    await initializeModules();
    const agents = await configLoader.getAvailableAgents();

    console.log(chalk.bold("\nAvailable BMAD Agents:\n"));

    for (const agent of agents) {
      console.log(chalk.cyan(`  ${agent.id.padEnd(20)}`), agent.description);
    }

    console.log(
      chalk.dim("\nInstall with: npx bmad-method install --agent=<id>\n")
    );
  }

  async listExpansionPacks() {
    // Initialize ES modules
    await initializeModules();
    const expansionPacks = await this.getAvailableExpansionPacks();

    console.log(chalk.bold("\nAvailable BMAD Expansion Packs:\n"));

    if (expansionPacks.length === 0) {
      console.log(chalk.yellow("No expansion packs found."));
      return;
    }

    for (const pack of expansionPacks) {
      console.log(chalk.cyan(`  ${pack.id.padEnd(20)}`), 
                  `${pack.name} v${pack.version}`);
      console.log(chalk.dim(`  ${' '.repeat(22)}${pack.description}`));
      if (pack.author && pack.author !== 'Unknown') {
        console.log(chalk.dim(`  ${' '.repeat(22)}by ${pack.author}`));
      }
      console.log();
    }

    console.log(
      chalk.dim("Install with: npx bmad-method install --full --expansion-packs <id>\n")
    );
  }

  async showStatus() {
    // Initialize ES modules
    await initializeModules();
    const installDir = await this.findInstallation();

    if (!installDir) {
      console.log(
        chalk.yellow("No BMAD installation found in current directory tree")
      );
      return;
    }

    const manifest = await fileManager.readManifest(installDir);

    if (!manifest) {
      console.log(chalk.red("Invalid installation - manifest not found"));
      return;
    }

    console.log(chalk.bold("\nBMAD Installation Status:\n"));
    console.log(`  Directory:      ${installDir}`);
    console.log(`  Version:        ${manifest.version}`);
    console.log(
      `  Installed:      ${new Date(
        manifest.installed_at
      ).toLocaleDateString()}`
    );
    console.log(`  Type:           ${manifest.install_type}`);

    if (manifest.agent) {
      console.log(`  Agent:          ${manifest.agent}`);
    }

    if (manifest.ide_setup) {
      console.log(`  IDE Setup:      ${manifest.ide_setup}`);
    }

    console.log(`  Total Files:    ${manifest.files.length}`);

    // Check for modifications
    const modifiedFiles = await fileManager.checkModifiedFiles(
      installDir,
      manifest
    );
    if (modifiedFiles.length > 0) {
      console.log(chalk.yellow(`  Modified Files: ${modifiedFiles.length}`));
    }

    console.log("");
  }

  async getAvailableAgents() {
    return configLoader.getAvailableAgents();
  }

  async getAvailableExpansionPacks() {
    return configLoader.getAvailableExpansionPacks();
  }

  async getAvailableTeams() {
    return configLoader.getAvailableTeams();
  }

  async installExpansionPacks(installDir, selectedPacks, spinner) {
    if (!selectedPacks || selectedPacks.length === 0) {
      return [];
    }

    const installedFiles = [];
    const glob = require('glob');

    for (const packId of selectedPacks) {
      spinner.text = `Installing expansion pack: ${packId}...`;
      
      try {
        const expansionPacks = await this.getAvailableExpansionPacks();
        const pack = expansionPacks.find(p => p.id === packId);
        
        if (!pack) {
          console.warn(`Expansion pack ${packId} not found, skipping...`);
          continue;
        }

        const expansionPackDir = path.dirname(pack.manifestPath);
        
        // Define the folders to copy from expansion packs to .bmad-core
        const foldersToSync = [
          'agents',
          'agent-teams',
          'templates',
          'tasks',
          'checklists',
          'workflows',
          'data',
          'utils',
          'schemas'
        ];

        // Copy each folder if it exists
        for (const folder of foldersToSync) {
          const sourceFolder = path.join(expansionPackDir, folder);
          
          // Check if folder exists in expansion pack
          if (await fileManager.pathExists(sourceFolder)) {
            // Get all files in this folder
            const files = glob.sync('**/*', {
              cwd: sourceFolder,
              nodir: true
            });

            // Copy each file to the destination
            for (const file of files) {
              const sourcePath = path.join(sourceFolder, file);
              const destPath = path.join(installDir, '.bmad-core', folder, file);
              
              if (await fileManager.copyFile(sourcePath, destPath)) {
                installedFiles.push(path.join('.bmad-core', folder, file));
              }
            }
          }
        }

        // Web bundles are now available in the dist/ directory and don't need to be copied

        console.log(chalk.green(`✓ Installed expansion pack: ${pack.name}`));
      } catch (error) {
        console.error(chalk.red(`Failed to install expansion pack ${packId}: ${error.message}`));
      }
    }

    return installedFiles;
  }

  getWebBundleInfo(config) {
    const webBundleType = config.webBundleType || 'all';
    
    switch (webBundleType) {
      case 'all':
        return 'all bundles';
      case 'agents':
        return 'individual agents only';
      case 'teams':
        return config.selectedWebBundleTeams ? 
          `teams: ${config.selectedWebBundleTeams.join(', ')}` : 
          'selected teams';
      case 'custom':
        const parts = [];
        if (config.selectedWebBundleTeams && config.selectedWebBundleTeams.length > 0) {
          parts.push(`teams: ${config.selectedWebBundleTeams.join(', ')}`);
        }
        if (config.includeIndividualAgents) {
          parts.push('individual agents');
        }
        return parts.length > 0 ? parts.join(' + ') : 'custom selection';
      default:
        return 'selected bundles';
    }
  }

  async installWebBundles(webBundlesDirectory, config, spinner) {
    // Ensure modules are initialized
    await initializeModules();
    
    try {
      // Find the dist directory in the BMAD installation
      const distDir = configLoader.getDistPath();
      
      if (!(await fileManager.pathExists(distDir))) {
        console.warn(chalk.yellow('Web bundles not found. Run "npm run build" to generate them.'));
        return;
      }

      // Ensure web bundles directory exists
      await fileManager.ensureDirectory(webBundlesDirectory);
      
      const webBundleType = config.webBundleType || 'all';
      
      if (webBundleType === 'all') {
        // Copy the entire dist directory structure
        await fileManager.copyDirectory(distDir, webBundlesDirectory);
        console.log(chalk.green(`✓ Installed all web bundles to: ${webBundlesDirectory}`));
      } else {
        let copiedCount = 0;
        
        // Copy specific selections based on type
        if (webBundleType === 'agents' || (webBundleType === 'custom' && config.includeIndividualAgents)) {
          const agentsSource = path.join(distDir, 'agents');
          const agentsTarget = path.join(webBundlesDirectory, 'agents');
          if (await fileManager.pathExists(agentsSource)) {
            await fileManager.copyDirectory(agentsSource, agentsTarget);
            console.log(chalk.green(`✓ Copied individual agent bundles`));
            copiedCount += 10; // Approximate count for agents
          }
        }
        
        if (webBundleType === 'teams' || webBundleType === 'custom') {
          if (config.selectedWebBundleTeams && config.selectedWebBundleTeams.length > 0) {
            const teamsSource = path.join(distDir, 'teams');
            const teamsTarget = path.join(webBundlesDirectory, 'teams');
            await fileManager.ensureDirectory(teamsTarget);
            
            for (const teamId of config.selectedWebBundleTeams) {
              const teamFile = `${teamId}.txt`;
              const sourcePath = path.join(teamsSource, teamFile);
              const targetPath = path.join(teamsTarget, teamFile);
              
              if (await fileManager.pathExists(sourcePath)) {
                await fileManager.copyFile(sourcePath, targetPath);
                copiedCount++;
                console.log(chalk.green(`✓ Copied team bundle: ${teamId}`));
              }
            }
          }
        }
        
        // Always copy expansion packs if they exist
        const expansionSource = path.join(distDir, 'expansion-packs');
        const expansionTarget = path.join(webBundlesDirectory, 'expansion-packs');
        if (await fileManager.pathExists(expansionSource)) {
          await fileManager.copyDirectory(expansionSource, expansionTarget);
          console.log(chalk.green(`✓ Copied expansion pack bundles`));
        }
        
        console.log(chalk.green(`✓ Installed ${copiedCount} selected web bundles to: ${webBundlesDirectory}`));
      }
    } catch (error) {
      console.error(chalk.red(`Failed to install web bundles: ${error.message}`));
    }
  }

  async findInstallation() {
    // Look for .bmad-core in current directory or parent directories
    let currentDir = process.cwd();

    while (currentDir !== path.dirname(currentDir)) {
      const bmadDir = path.join(currentDir, ".bmad-core");
      const manifestPath = path.join(bmadDir, "install-manifest.yml");

      if (await fileManager.pathExists(manifestPath)) {
        return bmadDir;
      }

      currentDir = path.dirname(currentDir);
    }

    // Also check if we're inside a .bmad-core directory
    if (path.basename(process.cwd()) === ".bmad-core") {
      const manifestPath = path.join(process.cwd(), "install-manifest.yml");
      if (await fileManager.pathExists(manifestPath)) {
        return process.cwd();
      }
    }

    return null;
  }
}

module.exports = new Installer();
