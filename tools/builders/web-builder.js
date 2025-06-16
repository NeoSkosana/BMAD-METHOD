const fs = require('node:fs').promises;
const path = require('node:path');
const DependencyResolver = require('../lib/dependency-resolver');

class WebBuilder {
  constructor(options = {}) {
    this.rootDir = options.rootDir || process.cwd();
    this.outputDirs = options.outputDirs || [
      path.join(this.rootDir, 'dist'),
      path.join(this.rootDir, '.bmad-core', 'web-bundles')
    ];
    this.resolver = new DependencyResolver(this.rootDir);
    this.templatePath = path.join(this.rootDir, '.bmad-core', 'templates', 'web-agent-startup-instructions-template.md');
  }

  async cleanOutputDirs() {
    for (const dir of this.outputDirs) {
      try {
        await fs.rm(dir, { recursive: true, force: true });
        console.log(`Cleaned: ${path.relative(this.rootDir, dir)}`);
      } catch (error) {
        console.debug(`Failed to clean directory ${dir}:`, error.message);
        // Directory might not exist, that's fine
      }
    }
  }

  async buildAgents() {
    const agents = await this.resolver.listAgents();

    for (const agentId of agents) {
      console.log(`  Building agent: ${agentId}`);
      const bundle = await this.buildAgentBundle(agentId);

      // Write to all output directories
      for (const outputDir of this.outputDirs) {
        const outputPath = path.join(outputDir, 'agents');
        await fs.mkdir(outputPath, { recursive: true });
        const outputFile = path.join(outputPath, `${agentId}.txt`);
        await fs.writeFile(outputFile, bundle, 'utf8');
      }
    }

    console.log(`Built ${agents.length} agent bundles in ${this.outputDirs.length} locations`);
  }

  async buildTeams() {
    const teams = await this.resolver.listTeams();

    for (const teamId of teams) {
      console.log(`  Building team: ${teamId}`);
      const bundle = await this.buildTeamBundle(teamId);

      // Write to all output directories
      for (const outputDir of this.outputDirs) {
        const outputPath = path.join(outputDir, 'teams');
        await fs.mkdir(outputPath, { recursive: true });
        const outputFile = path.join(outputPath, `${teamId}.txt`);
        await fs.writeFile(outputFile, bundle, 'utf8');
      }
    }

    console.log(`Built ${teams.length} team bundles in ${this.outputDirs.length} locations`);
  }

  async buildAgentBundle(agentId) {
    const dependencies = await this.resolver.resolveAgentDependencies(agentId);
    const template = await fs.readFile(this.templatePath, 'utf8');

    const sections = [template];

    // Add agent configuration
    sections.push(this.formatSection(dependencies.agent.path, dependencies.agent.content));

    // Add all dependencies
    for (const resource of dependencies.resources) {
      sections.push(this.formatSection(resource.path, resource.content));
    }

    return sections.join('\n');
  }

  async buildTeamBundle(teamId) {
    const dependencies = await this.resolver.resolveTeamDependencies(teamId);
    const template = await fs.readFile(this.templatePath, 'utf8');

    const sections = [template];

    // Add team configuration
    sections.push(this.formatSection(dependencies.team.path, dependencies.team.content));

    // Add all agents
    for (const agent of dependencies.agents) {
      sections.push(this.formatSection(agent.path, agent.content));
    }

    // Add all deduplicated resources
    for (const resource of dependencies.resources) {
      sections.push(this.formatSection(resource.path, resource.content));
    }

    return sections.join('\n');
  }

  formatSection(path, content) {
    const separator = '====================';
    return [
      `${separator} START: ${path} ${separator}`,
      content.trim(),
      `${separator} END: ${path} ${separator}`,
      ''
    ].join('\n');
  }

  async validate() {
    console.log('Validating agent configurations...');
    const agents = await this.resolver.listAgents();
    for (const agentId of agents) {
      try {
        await this.resolver.resolveAgentDependencies(agentId);
        console.log(`  ✓ ${agentId}`);
      } catch (error) {
        console.log(`  ✗ ${agentId}: ${error.message}`);
        throw error;
      }
    }

    console.log('\nValidating team configurations...');
    const teams = await this.resolver.listTeams();
    for (const teamId of teams) {
      try {
        await this.resolver.resolveTeamDependencies(teamId);
        console.log(`  ✓ ${teamId}`);
      } catch (error) {
        console.log(`  ✗ ${teamId}: ${error.message}`);
        throw error;
      }
    }
  }

  listAgents() {
    return this.resolver.listAgents();
  }
}

module.exports = WebBuilder;