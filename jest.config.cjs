module.exports = {
    preset: 'jest-expo',
    testEnvironment: 'node',
    setupFiles: ['./jest/setup.js'],
    transformIgnorePatterns: [
        'node_modules/(?!(jest-)?react-native' +
        '|@react-native' +
        '|@react-native-community' +
        '|@react-navigation' +
        '|@react-native-async-storage' +
        '|@expo' +
        '|expo(nent)?' +
        '|react-native-svg' +
        '|victory-native)',
    ],
    moduleNameMapper: {
        '^@react-navigation/native$': '<rootDir>/jest/__mocks__/react-navigation-native.js', // added line
    },
};
