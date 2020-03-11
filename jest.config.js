module.exports = {
  verbose: true,
  rootDir: '.',
  testMatch: ['<rootDir>/@(test)/**/*.(spec|test).[jt]s?(x)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/build/'],
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
