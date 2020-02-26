module.exports = {
    preset: 'ts-jest',
    transform: {
        '^.+\\.ts?$': 'babel-jest',
    },
    testEnvironment: 'node',
    testRegex: '/src/.*\\.(test|spec)?\\.(ts|tsx)$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node']
};