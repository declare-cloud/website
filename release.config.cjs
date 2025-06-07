// Detect if --dry-run is passed in the process arguments
const isDryRun = process.argv.includes('--dry-run');
const currentBranch =
  process.env.GITHUB_REF_NAME ||
  process.env.BRANCH_NAME ||
  require('child_process').execSync('git rev-parse --abbrev-ref HEAD').toString().trim();

const branches = isDryRun ? [currentBranch] : ['main'];

console.log('isDryRun:', isDryRun);
console.log('branches:', branches);

const plugins = [
  [
    '@semantic-release/release-notes-generator',
    {
      config: './changelog.config.js',
      writerOpts: {
        mainTemplate: require('fs').readFileSync('./release-notes-template.hbs', 'utf8'),
      },
    },
  ],
  [
    '@semantic-release/changelog',
    {
      changelogFile: 'CHANGELOG.md',
    },
  ],
];

if (process.env.CI && process.env.GITHUB_TOKEN) {
  plugins.push('@semantic-release/git');
  plugins.push('@semantic-release/npm');
  plugins.push('@semantic-release/github');
}

module.exports = {
  branches,
  plugins,
};
