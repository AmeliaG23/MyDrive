/**
 * setup.js
 * ----------------
 * Created: 01-09-2025
 * Author: Amelia Goldsby
 * Project : A Dual-Focus Redesign of MyDrive: Enhancing Interfaces and Scoring Architecture
 * Course : Major Project, Level 6, QA
 *
 * Purpose:
 *    Set up file for global mocks for all tests
 *    Defines global mocks for React Native, Expo, and navigation modules 
 *    Reduces noise from warnings and simulates native APIs
 *
 * (Rani et al., 2021)
 */

import { jest } from '@jest/globals';
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
import { LogBox } from 'react-native';

// Use fake timers globally
jest.useFakeTimers();

// --------------------
// Mock AsyncStorage
// --------------------
jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

// --------------------
// Silence warnings
// --------------------
LogBox.ignoreLogs([
    'An update to Icon inside a test was not wrapped in act(...)',
]);

process.removeAllListeners('warning');

// --------------------
// Mock react-native-svg
// --------------------
jest.mock('react-native-svg', () => {
    const React = require('react');
    const { View } = require('react-native');

    const Mock = (props) => React.createElement(View, props, props.children);

    return {
        __esModule: true,
        default: Mock,
        Svg: Mock,
        G: Mock,
        Circle: Mock,
        Path: Mock,
        Rect: Mock,
        Line: Mock,
        Polygon: Mock,
    };
});

// --------------------
// Mock React Navigation
// --------------------
jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({
        setOptions: jest.fn(),
        navigate: jest.fn(),
        goBack: jest.fn(),
        reset: jest.fn(),
    }),
    useRoute: () => ({ params: {} }),
}));

jest.mock('@react-navigation/material-top-tabs', () => ({
    createMaterialTopTabNavigator: () => ({
        Navigator: ({ children }) => <>{children}</>,
        Screen: ({ children }) => <>{children}</>,
    }),
}));

// --------------------
// Mock Expo modules
// --------------------
jest.mock('expo', () => ({}));

jest.mock('expo-location', () => ({
    Accuracy: { Highest: 0 },
    requestForegroundPermissionsAsync: jest.fn(),
    requestBackgroundPermissionsAsync: jest.fn(),
    startLocationUpdatesAsync: jest.fn(),
    stopLocationUpdatesAsync: jest.fn(),
}));

jest.mock('expo-task-manager', () => ({
    defineTask: jest.fn(),
}));

jest.mock('expo-sensors', () => ({
    Accelerometer: {
        setUpdateInterval: jest.fn(),
        addListener: jest.fn(() => ({ remove: jest.fn() })),
        removeAllListeners: jest.fn(),
    },
    Gyroscope: {
        setUpdateInterval: jest.fn(),
        addListener: jest.fn(() => ({ remove: jest.fn() })),
        removeAllListeners: jest.fn(),
    },
}));

// --------------------
// Mock other native modules if needed
// --------------------
jest.mock('react-native-call-detection', () => {
    return jest.fn().mockImplementation(() => ({
        startListener: jest.fn(),
        stopListener: jest.fn(),
        dispose: jest.fn(),
    }));
});

//(Badwaik, 2024)
