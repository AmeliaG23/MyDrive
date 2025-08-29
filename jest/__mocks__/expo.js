// __mocks__/expo.js

// Mock Expo Location
const locationMock = {
    requestForegroundPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
    getCurrentPositionAsync: jest.fn().mockResolvedValue({
        coords: { latitude: 0, longitude: 0, altitude: 0, accuracy: 0 },
    }),
    watchPositionAsync: jest.fn().mockResolvedValue({
        remove: jest.fn(),
    }),
};

// Mock Expo Sensors
const sensorsMock = {
    Accelerometer: {
        addListener: jest.fn(),
        removeAllListeners: jest.fn(),
    },
    Gyroscope: {
        addListener: jest.fn(),
        removeAllListeners: jest.fn(),
    },
};

// Mock Expo Task Manager
const taskManagerMock = {
    defineTask: jest.fn(),
    unregisterTaskAsync: jest.fn().mockResolvedValue(),
    isTaskRegisteredAsync: jest.fn().mockResolvedValue(false),
};

// Export all together
module.exports = {
    ...locationMock,
    ...sensorsMock,
    ...taskManagerMock,
};
