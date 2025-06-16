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

  async getAgentDependencies(agentId) {
    // Use DependencyResolver to dynamically parse agent dependencies
    const DependencyResolver = require('../../lib/dependency-resolver');
    const resolver = new DependencyResolver(path.join(__dirname, '..', '..', '..'));
    
    try {
      const agentDeps = await resolver.resolveAgentDependencies(agentId);
      
      // Convert to flat list of file paths
      const depPaths = [];
      
      // Add core files
      const config = await this.load();
      const coreFiles = config['agent-dependencies']?.['core-files'] || [];
      depPaths.push(...coreFiles);
      
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
    // Get the path to .bmad-core relative to the installer (now under tools)
    return path.join(__dirname, '..', '..', '..', '.bmad-core');
  }

  getAgentPath(agentId) {
    return path.join(this.getBmadCorePath(), 'agents', `${agentId}.md`);
  }
}

module.exports = new ConfigLoader();