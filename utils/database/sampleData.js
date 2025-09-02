/**
 * sampleData.js
 * ----------------
 * Created: 20-08-2025
 * Author: Amelia Goldsby
 * Project : A Dual-Focus Redesign of MyDrive: Enhancing Interfaces and Scoring Architecture
 * Course : Major Project, Level 6, QA
 *
 * Purpose:
 *    Generate sample data for database and to demonstrate and test functions.
 *
 * (Rani et al., 2021)
 */

import { addJourneyAsync, getJourneyHistoryAsync } from './journeys';
import { calculateScore } from './scoring';
import { addUserAsync, getAllUsers, overwriteUsersAsync } from './users';

// Sample data for sample users
const randomFromArray = (arr) => arr[Math.floor(Math.random() * arr.length)];
const sampleFirstNames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Evan', 'Fiona', 'George', 'Hannah', 'Ian', 'Julia'];
const sampleLastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Martinez', 'Taylor'];
const randomDOB = () => {
    const start = new Date(1970, 0, 1).getTime();
    const end = new Date(2000, 11, 31).getTime();
    const dobTimestamp = start + Math.random() * (end - start);
    const dob = new Date(dobTimestamp);
    return dob.toISOString().split('T')[0];
};

// Generate unique ID for journeys
const generateUniqueId = () => Date.now().toString() + Math.random().toString(36).substr(2, 5);

// Function to add sample data to database
//  - 10 sample users with journey data
export const addSampleData = async () => {
    let users = await getAllUsers();
    if (!Array.isArray(users)) return;

    // Updates sample user data if missing
    if (users.length > 0) {
        let updated = false;
        for (let i = 0; i < users.length && i < 10; i++) {
            const user = users[i];
            const shouldUpdate = !user.firstName || !user.lastName || !user.dob;

            if (shouldUpdate) {
                user.firstName = sampleFirstNames[i];
                user.lastName = sampleLastNames[i];
                user.dob = randomDOB();
                updated = true;
            }
            if (!user.username) user.username = `user${i + 1}`;
            if (!user.password) user.password = `Password${i + 1}!`;
        }
        if (updated) {
            await overwriteUsersAsync(users);
        }
    }

    users = await getAllUsers();
    if (!Array.isArray(users)) return;

    const existingUsernames = users.map(u => u.username);

    // Ensure there are at least 10 sample users
    for (let i = 1; i <= 10; i++) {
        const username = `user${i}`;
        if (!existingUsernames.includes(username)) {
            const userData = {
                username,
                password: `Password${i}!`,
                firstName: sampleFirstNames[i - 1],
                lastName: sampleLastNames[i - 1],
                dob: randomDOB(),
            };
            await addUserAsync(userData);
        }
    }

    users = await getAllUsers();
    if (!Array.isArray(users)) return;

    // Sample journey routes and road types
    const sampleRoadTypes = ['city', 'rural', 'highway'];
    const sampleRoutes = [['start', 'mid1', 'mid2', 'end'], ['A', 'B', 'C', 'D'], ['X', 'Y', 'Z']];

    for (const user of users) {
        const journeys = await getJourneyHistoryAsync(user.id);
        if (!Array.isArray(journeys) || journeys.length === 0) {
            // Ensures there are 3 journeys within last 30 days
            for (let j = 0; j < 3; j++) {
                const date = new Date();
                date.setDate(date.getDate() - Math.floor(Math.random() * 30)); // 0-29 days ago

                const journey = {
                    id: generateUniqueId(),
                    date: date.toISOString().split('T')[0],
                    length: Math.floor(Math.random() * 60) + 10,
                    distance: Math.floor(Math.random() * 100) + 5,
                    speed: Math.floor(Math.random() * 100),
                    brakingAcceleration: +(Math.random() * 5).toFixed(2),
                    cornering: +(Math.random() * 4).toFixed(2),
                    journeyRoute: randomFromArray(sampleRoutes),
                    phoneUsage: Math.random() < 0.5,
                    phoneCallStatus: Math.random() < 0.3,
                    roadType: randomFromArray(sampleRoadTypes),
                };

                // Calculates scores for sample journeys
                journey.scores = calculateScore(journey);
                await addJourneyAsync(user.id, journey);
            }

            // 5 journeys between 30 and ~240 days ago
            for (let j = 0; j < 5; j++) {
                const date = new Date();
                const daysBack = Math.floor(Math.random() * (240 - 30)) + 30; // 30 to 240 days ago
                date.setDate(date.getDate() - daysBack);

                const journey = {
                    id: generateUniqueId(),
                    date: date.toISOString().split('T')[0],
                    length: Math.floor(Math.random() * 60) + 10,
                    distance: Math.floor(Math.random() * 100) + 5,
                    speed: Math.floor(Math.random() * 100),
                    brakingAcceleration: +(Math.random() * 5).toFixed(2),
                    cornering: +(Math.random() * 4).toFixed(2),
                    journeyRoute: randomFromArray(sampleRoutes),
                    phoneUsage: Math.random() < 0.5,
                    phoneCallStatus: Math.random() < 0.3,
                    roadType: randomFromArray(sampleRoadTypes),
                };

                journey.scores = calculateScore(journey);
                await addJourneyAsync(user.id, journey);
            }
        }
    }
};

// Returns true if seeded test users already exist
export const testUsersExist = async () => {
    const users = await getAllUsers();
    if (!Array.isArray(users) || users.length === 0) return false;

    // Checks if users are already present
    return users.some(u => u.username && u.username.startsWith("user"));
};

