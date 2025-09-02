/**
 * trackingService.js
 * ----------------
 * Created: 19-08-2025
 * Author: Amelia Goldsby
 * Project : A Dual-Focus Redesign of MyDrive: Enhancing Interfaces and Scoring Architecture
 * Course : Major Project, Level 6, QA
 *
 * Purpose:
 *    Provides tracking service for scoring architecture, including:
 *      - GPS, call detection, accelerometer, gyroscope
 *      - Calculates driving metrics
 *      - Stores current journey data
 * 
 *  * Key Calculations & Methods:
 *   - Braking Acceleration: Maximum vector magnitude of accelerometer readings √(x²+y²+z²) (Johnson et al., 2011).
 *   - Cornering: Maximum vector magnitude of gyroscope readings, capturing sharp rotations.
 *   - Average Speed (km/h)
 *   - Distance: Haversine formula for geodesic distance between two GPS coordinates (Nominatim, 2025).
 *   - Road Type
 *
 * (Rani et al., 2021)
 */

import * as Location from 'expo-location';
import { Accelerometer, Gyroscope } from 'expo-sensors';
import * as TaskManager from 'expo-task-manager';
import { addJourneyAsync, calculateScore } from '../utils';
import { startCallDetection, stopCallDetection } from './phoneUsageService';
import { getRoadType } from './roadTypeService';

const TASK_NAME = 'background-location-task';

// Centralized state for tracking current journeys
export const state = {
    currentJourney: {},
    accelData: [],
    gyroData: [],
    isDriving: false,
};

// Start accelerometer and gyroscope at 200ms intervals (braking and cornering)
function startSensors() {
    Accelerometer.setUpdateInterval(200);
    Gyroscope.setUpdateInterval(200);

    Accelerometer.addListener((data) => state.accelData.push(data));
    Gyroscope.addListener((data) => state.gyroData.push(data));
}

// Stop sensors and clear data
function stopSensors() {
    Accelerometer.removeAllListeners();
    Gyroscope.removeAllListeners();
    state.accelData = [];
    state.gyroData = [];
}

// Start a journey session
export async function startTracking(userId) {
    const { status: fgStatus } = await Location.requestForegroundPermissionsAsync();
    const { status: bgStatus } = await Location.requestBackgroundPermissionsAsync();
    if (fgStatus !== 'granted' || bgStatus !== 'granted') {
        throw new Error('Location permissions not granted');
    }

    // Start current journey with metadata
    state.currentJourney = {
        id: `journey_${Date.now()}`,
        userId,
        startDate: new Date().toISOString(),
        locations: [],
        lengthMinutes: 0,
        brakingAcceleration: 0,
        cornering: 0,
        speed: 0,
        distance: 0,
        phoneUsage: false,
        phoneCallStatus: false,
        roadType: 'unknown',
    };
    state.isDriving = true;

    // Call detection begins
    startCallDetection((status) => {
        state.currentJourney.phoneCallStatus = status;
    });

    startSensors();

    // GPS tracking
    await Location.startLocationUpdatesAsync(TASK_NAME, {
        accuracy: Location.Accuracy.Highest,
        distanceInterval: 10,
        deferredUpdatesInterval: 1000,
        showsBackgroundLocationIndicator: true,
    });
}

// Stop tracking and calculate results
export async function stopTracking(userId) {
    state.isDriving = false;
    await Location.stopLocationUpdatesAsync(TASK_NAME);
    stopSensors();
    stopCallDetection();


    // Calculate braking acceleration (max magnitude of accelerometer readings)
    const maxAccel = state.accelData.reduce((max, a) => {
        const mag = Math.sqrt(a.x ** 2 + a.y ** 2 + a.z ** 2);
        return mag > max ? mag : max;
    }, 0);
    state.currentJourney.brakingAcceleration = maxAccel;

    // Calculate cornering (max magnitude of gyroscope readings)
    const maxGyro = state.gyroData.reduce((max, g) => {
        const mag = Math.sqrt(g.x ** 2 + g.y ** 2 + g.z ** 2);
        return mag > max ? mag : max;
    }, 0);
    state.currentJourney.cornering = maxGyro;

    // Calculate average speed (km/h)
    state.currentJourney.speed = calculateAverageSpeed(state.currentJourney.locations);

    // Total distance (Haversine formula)
    let totalDistance = 0;
    for (let i = 1; i < state.currentJourney.locations.length; i++) {
        totalDistance += getDistance(
            state.currentJourney.locations[i - 1],
            state.currentJourney.locations[i]
        );
    }
    state.currentJourney.distance = parseFloat(totalDistance.toFixed(2));

    // Detect road type from start location
    if (state.currentJourney.locations.length > 0) {
        const { latitude, longitude } = state.currentJourney.locations[0];
        state.currentJourney.roadType = await getRoadType(latitude, longitude);
    }

    // Journey duration (minutes)
    if (state.currentJourney.locations.length > 1) {
        const start = new Date(state.currentJourney.locations[0].timestamp);
        const end = new Date(
            state.currentJourney.locations[state.currentJourney.locations.length - 1].timestamp
        );
        state.currentJourney.lengthMinutes = Math.round((end - start) / 60000);
    }

    // Calculates score based on telematics metrics
    state.currentJourney.scores = calculateScore(state.currentJourney);
    await addJourneyAsync(userId, state.currentJourney);

    // Clears and resets data
    state.currentJourney = {};
    state.accelData = [];
    state.gyroData = [];
}

// ------------------
// Calculations

// Calculate average speed in km/h
export function calculateAverageSpeed(locations) {
    if (locations.length < 2) return 0;
    let totalDistance = 0;
    for (let i = 1; i < locations.length; i++) {
        totalDistance += getDistance(locations[i - 1], locations[i]);
    }
    const startTime = new Date(locations[0].timestamp).getTime();
    const endTime = new Date(locations[locations.length - 1].timestamp).getTime();
    const timeHours = (endTime - startTime) / (1000 * 60 * 60);
    return totalDistance / timeHours;
}

// Distance between two GPS points (Haversine formula)
export function getDistance(loc1, loc2) {
    const toRad = (x) => (x * Math.PI) / 180;
    const R = 6371; // Earth radius in km
    const dLat = toRad(loc2.latitude - loc1.latitude);
    const dLon = toRad(loc2.longitude - loc1.longitude);
    const lat1 = toRad(loc1.latitude);
    const lat2 = toRad(loc2.latitude);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Background task helper for tests
export function runBackgroundTask({ data, error }) {
    if (error) {
        console.error(error);
        return;
    }
    if (!data || !state.isDriving) return;
    const { locations } = data;
    locations.forEach((loc) => {
        state.currentJourney.locations.push({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            timestamp: loc.timestamp,
        });
    });
}

// Define the background task for Expo
TaskManager.defineTask(TASK_NAME, runBackgroundTask);
