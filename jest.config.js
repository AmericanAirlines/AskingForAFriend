module.exports = {
  preset: 'ts-jest',
  moduleFileExtensions: ['js', 'json', 'ts'],
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'json', 'ts'],
  testMatch: ['**/*.test.ts'],
  clearMocks: true,
  testPathIgnorePatterns: ['/node_modules/'],
  collectCoverageFrom: [
    './src/**/*.ts',
    '!./src/tests/**',
    '!./src/logger.ts',
    '!./src/index.ts',
    '!./src/app.ts',
    '!./src/env.ts',
  ],
  coverageDirectory: './coverage',
  coverageThreshold: {
    global: {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100,
    },
  },
};
