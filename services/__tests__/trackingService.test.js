/**
 * trackingService.test.js
 * ----------------
 * Created: 01-09-2025
 * Author: Amelia Goldsby
 * Project : A Dual-Focus Redesign of MyDrive: Enhancing Interfaces and Scoring Architecture
 * Course : Major Project, Level 6, QA
 *
 * Purpose:
 *    Functional tests for trackingService.js
 *
 * (Rani et al., 2021)
 */

import * as Location from 'expo-location';
import { Accelerometer, Gyroscope } from 'expo-sensors';
import { addJourneyAsync, calculateScore } from '../../utils';
import * as phoneUsage from '../phoneUsageService';
import * as roadTypeService from '../roadTypeService';
import {
    calculateAverageSpeed,
    getDistance,
    runBackgroundTask,
    startTracking,
    state,
    stopTracking,
} from '../trackingService';

jest.mock('expo-location');
jest.mock('expo-sensors');
jest.mock('expo-task-manager');
jest.mock('../../utils');
jest.mock('../phoneUsageService');
jest.mock('../roadTypeService');

describe('trackingService functional tests', () => {
    const mockLocations = [
        { coords: { latitude: 1, longitude: 1 }, timestamp: Date.now() },
        { coords: { latitude: 1.001, longitude: 1.001 }, timestamp: Date.now() + 1000 },
    ];

    beforeEach(() => {
        jest.clearAllMocks();

        Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'granted' });
        Location.requestBackgroundPermissionsAsync.mockResolvedValue({ status: 'granted' });
        Location.startLocationUpdatesAsync.mockResolvedValue();
        Location.stopLocationUpdatesAsync.mockResolvedValue();

        calculateScore.mockReturnValue({ safetyScore: 100 });
        addJourneyAsync.mockResolvedValue();

        phoneUsage.startCallDetection.mockImplementation((cb) => { cb(false); });
        phoneUsage.stopCallDetection.mockImplementation(() => { });

        roadTypeService.getRoadType.mockResolvedValue('city');

        Accelerometer.setUpdateInterval.mockImplementation(() => { });
        Gyroscope.setUpdateInterval.mockImplementation(() => { });
        Accelerometer.addListener.mockImplementation(() => ({ remove: jest.fn() }));
        Gyroscope.addListener.mockImplementation(() => ({ remove: jest.fn() }));
        Accelerometer.removeAllListeners.mockImplementation(() => { });
        Gyroscope.removeAllListeners.mockImplementation(() => { });

        state.currentJourney = { locations: [] };
        state.accelData = [];
        state.gyroData = [];
        state.isDriving = false;
    });

    test('startTracking requests permissions, initializes journey and starts location updates', async () => {
        const userId = 'user1';
        await startTracking(userId);

        expect(Location.requestForegroundPermissionsAsync).toHaveBeenCalled();
        expect(Location.requestBackgroundPermissionsAsync).toHaveBeenCalled();
        expect(Location.startLocationUpdatesAsync).toHaveBeenCalledWith(
            expect.any(String),
            expect.objectContaining({
                accuracy: Location.Accuracy.Highest,
                distanceInterval: 10,
            })
        );
        expect(phoneUsage.startCallDetection).toHaveBeenCalled();
    });

    test('background location task updates currentJourney locations when isDriving true', () => {
        state.currentJourney = { locations: [] };
        state.isDriving = true;

        runBackgroundTask({ data: { locations: mockLocations }, error: null });

        expect(state.currentJourney.locations.length).toBe(2);
        expect(state.currentJourney.locations[0]).toMatchObject({
            latitude: 1,
            longitude: 1,
        });
    });

    test('stopTracking stops sensors, call detection, stops location, calculates metrics and saves journey', async () => {
        const userId = 'user1';

        state.currentJourney = {
            id: 'journey_test',
            userId,
            startDate: new Date().toISOString(),
            locations: [
                { latitude: 0, longitude: 0, timestamp: Date.now() },
                { latitude: 0.001, longitude: 0.001, timestamp: Date.now() + 60000 },
            ],
            lengthMinutes: 0,
            brakingAcceleration: 0,
            cornering: 0,
            speed: 0,
            distance: 0,
            phoneUsage: false,
            phoneCallStatus: false,
            roadType: 'unknown',
        };
        state.accelData = [{ x: 0, y: 0, z: 9.8 }, { x: -1, y: 0, z: 9.7 }];
        state.gyroData = [{ x: 0.1, y: 0, z: 0 }, { x: 0.5, y: 0, z: 0 }];
        state.isDriving = true;

        await stopTracking(userId);

        expect(Accelerometer.removeAllListeners).toHaveBeenCalled();
        expect(Gyroscope.removeAllListeners).toHaveBeenCalled();
        expect(phoneUsage.stopCallDetection).toHaveBeenCalled();
        expect(Location.stopLocationUpdatesAsync).toHaveBeenCalledWith(expect.any(String));
        expect(addJourneyAsync).toHaveBeenCalledWith(
            userId,
            expect.objectContaining({
                brakingAcceleration: expect.any(Number),
                cornering: expect.any(Number),
                speed: expect.any(Number),
                distance: expect.any(Number),
                roadType: 'city',
                lengthMinutes: 1,
                scores: { safetyScore: 100 },
            })
        );
        expect(state.currentJourney).toEqual({});
        expect(state.accelData).toEqual([]);
        expect(state.gyroData).toEqual([]);
    });

    test('calculateAverageSpeed returns 0 for fewer than 2 locations', () => {
        expect(calculateAverageSpeed([])).toBe(0);
        expect(calculateAverageSpeed([{ latitude: 0, longitude: 0, timestamp: Date.now() }])).toBe(0);
    });

    test('getDistance calculates approximate distance between two points', () => {
        const d = getDistance({ latitude: 0, longitude: 0 }, { latitude: 1, longitude: 1 });
        expect(d).toBeGreaterThan(150);
        expect(d).toBeLessThan(160);
    });
});
