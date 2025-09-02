/**
 * journeys.test.js
 * ----------------
 * Created: 01-09-2025
 * Author: Amelia Goldsby
 * Project : A Dual-Focus Redesign of MyDrive: Enhancing Interfaces and Scoring Architecture
 * Course : Major Project, Level 6, QA
 *
 * Purpose:
 *    Functional tests for journeys.js
 *
 * (Rani et al., 2021)
 */

/* eslint-env jest */
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    addJourneyAsync,
    getJourneyHistoryAsync
} from '../journeys';

describe('journeys.js', () => {
    const userId = 'user123';
    const journeyData = { date: '2025-07-29', location: 'New York' };

    beforeEach(async () => {
        await AsyncStorage.clear();
        jest.clearAllMocks();
    });

    test('addJourneyAsync should add a new journey for a user', async () => {
        await addJourneyAsync(userId, journeyData);

        const stored = await AsyncStorage.getItem('journeys');
        const parsed = JSON.parse(stored);

        expect(parsed[userId]).toBeDefined();
        expect(parsed[userId].length).toBe(1);
        expect(parsed[userId][0]).toEqual(journeyData);
    });

    test('addJourneyAsync should append to existing journeys', async () => {
        await addJourneyAsync(userId, journeyData);
        await addJourneyAsync(userId, { date: '2025-07-30', location: 'Boston' });

        const stored = await AsyncStorage.getItem('journeys');
        const parsed = JSON.parse(stored);

        expect(parsed[userId].length).toBe(2);
        expect(parsed[userId][1].location).toBe('Boston');
    });

    test('getJourneyHistoryAsync should return journeys for a user', async () => {
        const mockData = {
            [userId]: [journeyData],
        };
        await AsyncStorage.setItem('journeys', JSON.stringify(mockData));

        const result = await getJourneyHistoryAsync(userId);
        expect(result).toEqual([journeyData]);
    });

    test('getJourneyHistoryAsync should return empty array if user has no journeys', async () => {
        const result = await getJourneyHistoryAsync('nonexistent-user');
        expect(result).toEqual([]);
    });

    test('getJourneyHistoryAsync should return empty array if storage is empty', async () => {
        const result = await getJourneyHistoryAsync(userId);
        expect(result).toEqual([]);
    });
});
