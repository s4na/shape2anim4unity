export default {
  testEnvironment: 'jsdom',
  transform: {},
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'js/**/*.js',
    '!js/main.js',
    '!js/ui/**/*.js',
  ],
  testMatch: [
    '**/tests/**/*.test.js',
  ],
};
