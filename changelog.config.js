module.exports = {
  types: [
    { type: 'feat', section: '✨ Features' },
    { type: 'fix', section: '🐛 Bug Fixes' },
    { type: 'docs', section: '📝 Documentation' },
    { type: 'chore', section: '🔧 Chores' },
    { type: 'refactor', section: '♻️ Refactoring' },
    { type: 'perf', section: '⚡ Performance' },
    { type: 'test', section: '✅ Tests' },
    { type: 'style', section: '🎨 Style' },
  ],
  commitUrlFormat: 'https://github.com/declare-cloud/website/commit/{{hash}}',
  compareUrlFormat:
    'https://github.com/declare-cloud/website/compare/{{previousTag}}...{{currentTag}}',
  issueUrlFormat: 'https://github.com/declare-cloud/website/issues/{{id}}',
  userUrlFormat: 'https://github.com/{{user}}',
};
