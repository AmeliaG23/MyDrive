// setup.js
import { jest } from '@jest/globals'; // Add this if using ESM
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
import { LogBox } from 'react-native';

jest.useFakeTimers();

// ✅ Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

// ✅ Prevent loading `expo` native runtime
jest.mock('expo', () => ({}));

// ✅ Mock react-native-svg for charts or icons
jest.mock('react-native-svg', () => {
    const React = require('react');
    const { View } = require('react-native');

    return {
        Svg: (props) => React.createElement(View, props, props.children),
        Circle: (props) => React.createElement(View, props),
        G: (props) => React.createElement(View, props, props.children),
        // Add others if needed
    };
});

// ✅ Mock material-top-tabs navigator
jest.mock('@react-navigation/material-top-tabs', () => ({
    createMaterialTopTabNavigator: () => ({
        Navigator: ({ children }) => <>{children}</>,
        Screen: ({ children }) => <>{children}</>,
    }),
}));

// ✅ Mock navigation hooks
jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({
        setOptions: jest.fn(),
        navigate: jest.fn(),
        goBack: jest.fn(),
    }),
    useRoute: () => ({
        params: {},
    }),
}));

// ✅ Silence noisy warnings from vector-icons during test
LogBox.ignoreLogs([
    'An update to Icon inside a test was not wrapped in act(...)',
]);

// // ✅ Suppress deprecated prop-types warning (common in RN libraries)
// jest.mock('deprecated-react-native-prop-types', () => require('react-native'));

// ✅ Suppress all process warnings (e.g., punycode)
process.removeAllListeners('warning');
