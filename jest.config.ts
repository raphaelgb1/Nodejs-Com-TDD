export default {
  roots: ['<rootDir>/src'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
  '!<rootDir>/src/main/**',
  '!<rootDir>/src/**/*protocols.ts',
  '!<rootDir>/src/domain/**',
  '!<rootDir>/src/data/protocols/**',
  '!<rootDir>/src/presentation/protocols/**',
  '!<rootDir>/src/validation/protocols/**'
  ],
  coverageDirectory: 'coverage',
  testEnvironment: "node",
  preset: '@shelf/jest-mongodb',
  transform: {
    '.+\\.ts$': 'ts-jest'
  },
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1'
  }
};
