import * as Location from 'expo-location';
import { Accelerometer, Gyroscope } from 'expo-sensors';
import * as TaskManager from 'expo-task-manager';
import { addJourneyAsync, calculateScore } from '../utils';
import { startCallDetection, stopCallDetection } from './phoneUsageService';
import { getRoadType } from './roadTypeService';

const TASK_NAME = 'background-location-task';

let currentJourney = {
    id: null,
    userId: null,
    startDate: null,
    locations: [],
    lengthMinutes: 0,
    brakingAcceleration: 0,
    cornering: 0,
    speed: 0,
    distance: 0,  // <-- added here
    phoneUsage: false,
    phoneCallStatus: false,
    roadType: 'unknown',
};

let accelData = [];
let gyroData = [];
let isDriving = false;

// Start accelerometer and gyroscope listeners
function startSensors() {
    Accelerometer.setUpdateInterval(200);
    Gyroscope.setUpdateInterval(200);

    Accelerometer.addListener(data => {
        accelData.push(data);
    });

    Gyroscope.addListener(data => {
        gyroData.push(data);
    });
}

function stopSensors() {
    Accelerometer.removeAllListeners();
    Gyroscope.removeAllListeners();
    accelData = [];
    gyroData = [];
}

export async function startTracking(userId) {
    const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
    const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();

    if (foregroundStatus !== 'granted' || backgroundStatus !== 'granted') {
        throw new Error('Location permissions not granted');
    }

    currentJourney = {
        id: `journey_${Date.now()}`,
        userId,
        startDate: new Date().toISOString(),
        locations: [],
        lengthMinutes: 0,
        brakingAcceleration: 0,
        cornering: 0,
        speed: 0,
        distance: 0,  // <-- added here
        phoneUsage: false,
        phoneCallStatus: false,
        roadType: 'unknown',
    };
    isDriving = true;

    startCallDetection(status => {
        currentJourney.phoneCallStatus = status;
    });

    startSensors();

    await Location.startLocationUpdatesAsync(TASK_NAME, {
        accuracy: Location.Accuracy.Highest,
        distanceInterval: 10,
        deferredUpdatesInterval: 1000,
        showsBackgroundLocationIndicator: true,
    });
}

export async function stopTracking(userId) {
    isDriving = false;
    await Location.stopLocationUpdatesAsync(TASK_NAME);
    stopSensors();
    stopCallDetection();

    const maxAccel = accelData.reduce((max, a) => {
        const mag = Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z);
        return mag > max ? mag : max;
    }, 0);
    currentJourney.brakingAcceleration = maxAccel;

    const maxGyro = gyroData.reduce((max, g) => {
        const mag = Math.sqrt(g.x * g.x + g.y * g.y + g.z * g.z);
        return mag > max ? mag : max;
    }, 0);
    currentJourney.cornering = maxGyro;

    currentJourney.speed = calculateAverageSpeed(currentJourney.locations);

    // ➕ Calculate total distance
    let totalDistance = 0;
    for (let i = 1; i < currentJourney.locations.length; i++) {
        totalDistance += getDistance(currentJourney.locations[i - 1], currentJourney.locations[i]);
    }
    currentJourney.distance = parseFloat(totalDistance.toFixed(2)); // kilometers

    if (currentJourney.locations.length > 0) {
        const { latitude, longitude } = currentJourney.locations[0];
        currentJourney.roadType = await getRoadType(latitude, longitude);
    }

    if (currentJourney.locations.length > 1) {
        const start = new Date(currentJourney.locations[0].timestamp);
        const end = new Date(currentJourney.locations[currentJourney.locations.length - 1].timestamp);
        currentJourney.lengthMinutes = Math.round((end - start) / 60000);
    }

    currentJourney.scores = calculateScore(currentJourney);

    await addJourneyAsync(userId, currentJourney);

    currentJourney = {};
    accelData = [];
    gyroData = [];
}

function calculateAverageSpeed(locations) {
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

function getDistance(loc1, loc2) {
    const toRad = x => (x * Math.PI) / 180;
    const R = 6371; // km
    const dLat = toRad(loc2.latitude - loc1.latitude);
    const dLon = toRad(loc2.longitude - loc1.longitude);
    const lat1 = toRad(loc1.latitude);
    const lat2 = toRad(loc2.latitude);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d; // km
}

TaskManager.defineTask(TASK_NAME, ({ data, error }) => {
    if (error) {
        console.error(error);
        return;
    }
    if (data) {
        const { locations } = data;
        if (!isDriving) return;

        locations.forEach(loc => {
            currentJourney.locations.push({
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
                timestamp: loc.timestamp,
            });
        });
    }
});
