const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');

// Read all template partials
const readPartial = (name) =>
  fs.readFileSync(path.join(__dirname, `.template/changelog.${name}.hbs`), 'utf8').toString();

const commitPartial = readPartial('commit');
const headerPartial = readPartial('header');
const footerPartial = readPartial('footer');
const noteGroupsPartial = readPartial('noteGroups');
const noteGroupPartial = readPartial('noteGroup');
const notePartial = readPartial('note');
const mainTemplate = readPartial('main');

// Register helpers

Handlebars.registerHelper('datetime', function (format, context) {
  let date =
    (this && this.nextRelease && this.nextRelease.date) ||
    (context &&
      context.data &&
      context.data.root &&
      context.data.root.nextRelease &&
      context.data.root.nextRelease.date) ||
    new Date().toISOString();

  if (format === 'YYYY-MM-DD') return date.slice(0, 10);
  return date;
});

// Register partials
Handlebars.registerPartial('commitPartial', commitPartial);
Handlebars.registerPartial('headerPartial', headerPartial);
Handlebars.registerPartial('footerPartial', footerPartial);
Handlebars.registerPartial('noteGroupsPartial', noteGroupsPartial);
Handlebars.registerPartial('noteGroupPartial', noteGroupPartial);
Handlebars.registerPartial('notePartial', notePartial);
Handlebars.registerPartial('mainTemplate', mainTemplate);

// ---- Types, Rules, and Parser Options ----
const hidden = true;
const types = [
  { breaking: true, release: 'major', icon: '⚠️', section: 'BREAKING CHANGES' },
  { type: 'v0feat', section: 'New Features', release: 'patch', icon: '✨' },
  { type: 'v0fix', section: 'Fixes', release: 'patch', icon: '🐛' },
  { type: 'v0breaking', section: 'BREAKING CHANGES', release: 'minor', icon: '⚠️' },
  { type: 'feat', section: 'New Features', release: 'minor', icon: '✨' },
  { type: 'fix', section: 'Fixes', release: 'patch', icon: '🐛' },
  { type: 'revert', section: 'Reverts', release: 'patch', icon: '↩️' },
  { type: 'docs', section: 'Documentation', release: false, icon: '📝' },
  { type: 'docs', scope: 'readme', release: 'patch', icon: '📝' },
  { type: 'perf', section: 'Performance Improvements', release: 'patch', icon: '⚡' },
  { type: 'tests', section: 'Tests', hidden, release: 'patch', icon: '✅' },
  { type: 'chore', section: 'Chores', hidden, release: 'patch', icon: '🔧' },
  { type: 'deps', section: 'Dependency Updates', hidden, release: 'patch', icon: '🔗' },
  { type: 'ci', section: 'CI', hidden, release: 'patch', icon: '🔄' },
  { type: 'build', section: 'Build', hidden, release: 'patch', icon: '🔨' },
  { type: 'style', section: 'Code Style', hidden, release: 'patch', icon: '🎨' },
  { type: 'refactor', section: 'Code Refactoring', hidden, release: 'patch', icon: '♻️' },
  { scope: 'no-release', release: false },
];

const releaseRules = types
  .filter((_) => _.release !== undefined)
  .map((_) => {
    const clone = {};
    for (let key of ['scope', 'type', 'breaking', 'release']) {
      if (_[key] !== undefined) clone[key] = _[key];
    }
    return clone;
  });

const presetConfig_types = types
  .filter((_) => _.section !== undefined)
  .map((_) => ({
    type: _.type,
    section: _.section,
    hidden: _.hidden,
  }));

const parserOpts = {
  noteKeywords: ['BREAKING CHANGE', 'BREAKING CHANGES'],
};

const showCommitBody = process.env.SEMANTIC_RELEASE_HIDE_COMMIT_BODY !== 'TRUE';

// Branches & Dry Run Detection
const isDryRun = process.argv.includes('--dry-run');
const currentBranch =
  process.env.GITHUB_REF_NAME ||
  process.env.BRANCH_NAME ||
  require('child_process').execSync('git rev-parse --abbrev-ref HEAD').toString().trim();

const branches = isDryRun ? [currentBranch] : ['main'];

//console.log('isDryRun:', isDryRun);
//console.log('branches:', branches);

// Base Plugins (always included)
const basePlugins = [
  [
    '@semantic-release/commit-analyzer',
    {
      releaseRules,
      parserOpts,
    },
  ],
  [
    '@semantic-release/release-notes-generator',
    {
      parserOpts,
      preset: 'conventionalcommits',
      presetConfig: { types: presetConfig_types },
      writerOpts: {
        groupBy: 'section',
        commitsSort: (a, b) => {
          if (a.scope === null && b.scope) return -1;
          if (b.scope === null && a.scope) return 1;
          let by_date = a.committerDate - b.committerDate;
          if (a.scope === b.scope) return by_date;
          return a.scope - b.scope;
        },
        commitGroupsSort: (a, b) => {
          let types_a_index = types.findIndex((_) => _.section === a.title);
          let types_b_index = types.findIndex((_) => _.section === b.title);
          return types_a_index - types_b_index;
        },
        transform(commit, context) {
          const result = { ...commit };

          // Commit hash (long and short)
          const hash = commit.hash || (commit.commit && commit.commit.long) || '';
          result.hash = hash;
          result.shortHash =
            commit.shortHash ||
            commit.short ||
            (commit.commit && commit.commit.short) ||
            (commit.hash ? commit.hash.slice(0, 7) : '') ||
            '';

          // Commit URL
          const repoUrl =
            process.env.REPOSITORY_URL ||
            (context.repository && context.repository.url) ||
            'https://github.com/declare-cloud/website';
          result.commitUrl = hash ? `${repoUrl.replace(/\.git$/, '')}/commit/${hash}` : '';

          // Tree hash
          if (commit.tree) {
            result.treeHash = commit.tree.long;
            result.shortTreeHash = commit.tree.short;
          }

          // Author info
          if (commit.author) {
            result.authorName = commit.author.name || '';
            result.authorEmail = commit.author.email || '';
            result.authorDate = commit.author.date || '';
          }

          // Committer info
          if (commit.committer) {
            result.committerName = commit.committer.name || '';
            result.committerEmail = commit.committer.email || '';
            result.committerDate = commit.committer.date || '';
          }

          // Subject/body/header
          result.subject = commit.subject || commit.header || '';
          result.body = commit.body || '';

          // Message/tag/branch info
          result.message = commit.message || '';
          result.gitTags = commit.gitTags || '';
          result.merge = commit.merge || '';
          result.revert = commit.revert || '';
          result.footer = commit.footer || '';

          // Mentions/references/notes
          result.notes = Array.isArray(commit.notes) ? commit.notes : [];
          result.mentions = Array.isArray(commit.mentions) ? commit.mentions : [];
          result.references = Array.isArray(commit.references) ? commit.references : [];

          // PR info (if available)
          result.prNumber = '';
          result.prUrl = '';
          if (commit.references && Array.isArray(commit.references)) {
            const pr = commit.references.find(
              (ref) => ref.issue && (ref.prefix === '#' || ref.prefix === ''), // Covers typical PR ref
            );
            if (pr) {
              result.prNumber = pr.issue;
              result.prUrl = `${repoUrl.replace(/\.git$/, '')}/pull/${pr.issue}`;
            }
          }

          // (Optional) Attach the raw JSON for debugging
          //result._rawJson = JSON.stringify(commit, null, 2);
          //result._rawJson2 = JSON.stringify(result, null, 2);

          return result;
        },
        ...(showCommitBody
          ? {
              commitPartial,
              headerPartial,
              footerPartial,
              noteGroupsPartial,
              noteGroupPartial,
              notePartial,
              mainTemplate,
              finalizeContext: (context) => {
                if (context.commitGroups) {
                  context.commitGroups.forEach((g) => {
                    // Only .trim() if both are non-empty strings
                    const groupTitle = typeof g.title === 'string' ? g.title.trim() : '';
                    const foundType =
                      types.find(
                        (t) =>
                          (typeof t.section === 'string' && t.section.trim() === groupTitle) ||
                          (g.type && t.type === g.type),
                      ) || {};
                    g.icon = foundType.icon || '';
                    g.title = foundType.section || g.title;
                  });
                }
                // Attach commit body if needed (for each commit)
                for (const commitGroup of context.commitGroups || []) {
                  for (const commit of commitGroup.commits || []) {
                    if (commit.body?.includes('<!--skip-release-notes-->')) continue;
                    commit.commitBody = commit.body;
                  }
                }
                return context;
              },
            }
          : {}),
      },
    },
  ],
];

// Plugins for real releases only
const releasePlugins = [
  ...(process.env.CI && process.env.GITHUB_TOKEN
    ? [
        '@semantic-release/changelog',
        '@semantic-release/npm',
        [
          '@semantic-release/git',
          {
            assets: ['CHANGELOG.md', 'package.json'],
            message: 'chore(release): ${nextRelease.version} \n\n${nextRelease.notes}',
          },
        ],
        '@semantic-release/github',
      ]
    : []),
];

// Compose final plugin list
const plugins = [...basePlugins, ...(isDryRun ? [] : releasePlugins)];

module.exports = {
  __types: types,
  plugins,
  branches,
};
