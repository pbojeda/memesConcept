module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src', '<rootDir>/tests'],
    testMatch: ['**/*.test.ts'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    moduleNameMapper: {
        '^@memes/shared$': '<rootDir>/../shared/src/index.ts',
    },
    setupFiles: ['<rootDir>/tests/setupEnv.ts'],
};
