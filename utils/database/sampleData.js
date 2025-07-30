import { addJourneyAsync, getJourneyHistoryAsync } from './journeys';
import { calculateScore } from './scoring';
import { addUserAsync, getAllUsers, overwriteUsersAsync } from './users';

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

export const addSampleData = async () => {
    let users = await getAllUsers();
    if (!Array.isArray(users)) return;

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

    const sampleRoadTypes = ['city', 'rural', 'highway'];
    const sampleRoutes = [['start', 'mid1', 'mid2', 'end'], ['A', 'B', 'C', 'D'], ['X', 'Y', 'Z']];

    for (const user of users) {
        const journeys = await getJourneyHistoryAsync(user.id);
        if (!Array.isArray(journeys) || journeys.length === 0) {
            for (let j = 0; j < 3; j++) {
                const journey = {
                    date: new Date(Date.now() - j * 86400000).toISOString().split('T')[0],
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

                const scores = calculateScore(journey);
                journey.scores = scores;

                await addJourneyAsync(user.id, journey);
            }
        }
    }
};
