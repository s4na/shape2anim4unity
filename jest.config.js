export default {
  testEnvironment: 'jsdom',
  transform: {},
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  testMatch: [
    '**/__tests__/**/*.test.js'
  ],
  collectCoverageFrom: [
    'js/**/*.js',
    '!js/main.js',
    '!js/config.js'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html']
};
