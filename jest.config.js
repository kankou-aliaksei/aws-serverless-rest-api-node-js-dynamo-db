const tsPreset = require('ts-jest/jest-preset');

module.exports = {
    ...tsPreset,
    testEnvironment: 'node',
    testPathIgnorePatterns: ['dist', 'int-tests', 'tests/src/data/*.ts', 'tests/src/services/*.ts'], 
    reporters: [
        'default',
        [
            'jest-junit',
            {
                outputDirectory: 'junit',
                outputName: 'report.xml',
            },
        ],
    ],
    setupFiles: [
        './env.jest.js'
    ],
    testTimeout: 10000
};
