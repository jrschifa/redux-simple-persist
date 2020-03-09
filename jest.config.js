module.exports = {
  verbose: true,
  rootDir: '..',
  roots: ['<rootDir>/src', '<rootDir>/server'],
  testMatch: ['<rootDir>/@(src|server)/**/*.(spec|test).[jt]s?(x)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/build/'],
  modulePaths: ['<rootDir>/src'],
  snapshotSerializers: [
    'enzyme-to-json/serializer'
  ],
  setupFilesAfterEnv: [
    '<rootDir>/src/setupTests.js',
    '@testing-library/jest-dom/extend-expect'
  ],
  testEnvironment: 'jsdom',
  testURL: 'http://localhost',
  transform: {
    '^.+\\.(js|jsx|ts|tsx|mjs)$': 'babel-jest'
  },
  collectCoverage: false,
  coverageDirectory: '<rootDir>/coverage',
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{js,jsx,ts,tsx,mjs}',
    '!src/**/index.(j|t)sx?',
    '!src/models/**'
  ],
  coverageReporters: ['json', 'lcov', 'text']
};
