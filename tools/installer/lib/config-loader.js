const fs = require('fs-extra');
const path = require('path');
const yaml = require('js-yaml');

class ConfigLoader {
  constructor() {
    this.configPath = path.join(__dirname, '..', 'config', 'install.config.yml');
    this.config = null;
  }

  async load() {
    if (this.config) return this.config;
    
    try {
      const configContent = await fs.readFile(this.configPath, 'utf8');
      this.config = yaml.load(configContent);
      return this.config;
    } catch (error) {
      throw new Error(`Failed to load configuration: ${error.message}`);
    }
  }

  async getInstallationOptions() {
    const config = await this.load();
    return config['installation-options'] || {};
  }

  async getAvailableAgents() {
    const config = await this.load();
    return config['available-agents'] || [];
  }

  async getAvailableExpansionPacks() {
    const expansionPacksDir = path.join(this.getBmadCorePath(), '..', 'expansion-packs');
    
    try {
      const entries = await fs.readdir(expansionPacksDir, { withFileTypes: true });
      const expansionPacks = [];
      
      for (const entry of entries) {
        if (entry.isDirectory()) {
          const manifestPath = path.join(expansionPacksDir, entry.name, 'manifest.yml');
          
          try {
            const manifestContent = await fs.readFile(manifestPath, 'utf8');
            const manifest = yaml.load(manifestContent);
            
            expansionPacks.push({
              id: entry.name,
              name: manifest.name || entry.name,
              description: manifest.description || 'No description available',
              version: manifest.version || '1.0.0',
              author: manifest.author || 'Unknown',
              manifestPath: manifestPath,
              dependencies: manifest.dependencies || []
            });
          } catch (error) {
            console.warn(`Failed to read manifest for expansion pack ${entry.name}: ${error.message}`);
          }
        }
      }
      
      return expansionPacks;
    } catch (error) {
      console.warn(`Failed to read expansion packs directory: ${error.message}`);
      return [];
    }
  }

  async getAgentDependencies(agentId) {
    // Use DependencyResolver to dynamically parse agent dependencies
    const DependencyResolver = require('../../lib/dependency-resolver');
    const resolver = new DependencyResolver(path.join(__dirname, '..', '..', '..'));
    
    try {
      const agentDeps = await resolver.resolveAgentDependencies(agentId);
      
      // Convert to flat list of file paths
      const depPaths = [];
      
      // Core files and utilities are included automatically by DependencyResolver
      
      // Add agent file itself is already handled by installer
      
      // Add all resolved resources
      for (const resource of agentDeps.resources) {
        const filePath = `.bmad-core/${resource.type}/${resource.id}.md`;
        if (!depPaths.includes(filePath)) {
          depPaths.push(filePath);
        }
      }
      
      return depPaths;
    } catch (error) {
      console.warn(`Failed to dynamically resolve dependencies for ${agentId}: ${error.message}`);
      
      // Fall back to static config
      const config = await this.load();
      const dependencies = config['agent-dependencies'] || {};
      const coreFiles = dependencies['core-files'] || [];
      const agentDeps = dependencies[agentId] || [];
      
      return [...coreFiles, ...agentDeps];
    }
  }

  async getIdeConfiguration(ide) {
    const config = await this.load();
    const ideConfigs = config['ide-configurations'] || {};
    return ideConfigs[ide] || null;
  }

  getBmadCorePath() {
    // Get the path to bmad-core relative to the installer (now under tools)
    return path.join(__dirname, '..', '..', '..', 'bmad-core');
  }

  getDistPath() {
    // Get the path to dist directory relative to the installer
    return path.join(__dirname, '..', '..', '..', 'dist');
  }

  getAgentPath(agentId) {
    return path.join(this.getBmadCorePath(), 'agents', `${agentId}.md`);
  }

  async getAvailableTeams() {
    const teamsDir = path.join(this.getBmadCorePath(), 'agent-teams');
    
    try {
      const entries = await fs.readdir(teamsDir, { withFileTypes: true });
      const teams = [];
      
      for (const entry of entries) {
        if (entry.isFile() && entry.name.endsWith('.yml')) {
          const teamPath = path.join(teamsDir, entry.name);
          
          try {
            const teamContent = await fs.readFile(teamPath, 'utf8');
            const teamConfig = yaml.load(teamContent);
            
            if (teamConfig.bundle) {
              teams.push({
                id: path.basename(entry.name, '.yml'),
                name: teamConfig.bundle.name || entry.name,
                description: teamConfig.bundle.description || 'Team configuration',
                icon: teamConfig.bundle.icon || '📋'
              });
            }
          } catch (error) {
            console.warn(`Warning: Could not load team config ${entry.name}: ${error.message}`);
          }
        }
      }
      
      return teams;
    } catch (error) {
      console.warn(`Warning: Could not scan teams directory: ${error.message}`);
      return [];
    }
  }

  getTeamPath(teamId) {
    return path.join(this.getBmadCorePath(), 'agent-teams', `${teamId}.yml`);
  }

  async getTeamDependencies(teamId) {
    // Use DependencyResolver to dynamically parse team dependencies
    const DependencyResolver = require('../../lib/dependency-resolver');
    const resolver = new DependencyResolver(path.join(__dirname, '..', '..', '..'));
    
    try {
      const teamDeps = await resolver.resolveTeamDependencies(teamId);
      
      // Convert to flat list of file paths
      const depPaths = [];
      
      // Add team config file
      depPaths.push(`.bmad-core/agent-teams/${teamId}.yml`);
      
      // Add all agents
      for (const agent of teamDeps.agents) {
        const filePath = `.bmad-core/agents/${agent.id}.md`;
        if (!depPaths.includes(filePath)) {
          depPaths.push(filePath);
        }
      }
      
      // Add all resolved resources
      for (const resource of teamDeps.resources) {
        const filePath = `.bmad-core/${resource.type}/${resource.id}.${resource.type === 'workflows' ? 'yml' : 'md'}`;
        if (!depPaths.includes(filePath)) {
          depPaths.push(filePath);
        }
      }
      
      return depPaths;
    } catch (error) {
      throw new Error(`Failed to resolve team dependencies for ${teamId}: ${error.message}`);
    }
  }
}

module.exports = new ConfigLoader();