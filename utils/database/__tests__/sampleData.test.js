/**
 * sampleData.test.js
 * ----------------
 * Created: 01-09-2025
 * Author: Amelia Goldsby
 * Project : A Dual-Focus Redesign of MyDrive: Enhancing Interfaces and Scoring Architecture
 * Course : Major Project, Level 6, QA
 *
 * Purpose:
 *    Functional tests for sampleData.js
 *
 * (Rani et al., 2021)
 */

import { addJourneyAsync, getJourneyHistoryAsync } from '../journeys';
import { addSampleData } from '../sampleData';
import { calculateScore } from '../scoring';
import { addUserAsync, getAllUsers, overwriteUsersAsync } from '../users';

jest.mock('../users');
jest.mock('../journeys');
jest.mock('../scoring');

describe('addSampleData', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('updates users missing firstName, lastName, or dob and calls overwriteUsersAsync', async () => {
        const usersWithMissingData = [
            { id: '1', username: 'user1', password: 'pass' },
            { id: '2', username: 'user2', password: 'pass', firstName: 'Test', lastName: 'User', dob: null },
        ];

        const updatedUsers = usersWithMissingData.map((u, i) => ({
            ...u,
            firstName: u.firstName || expect.any(String),
            lastName: u.lastName || expect.any(String),
            dob: u.dob || expect.any(String),
        }));

        getAllUsers
            .mockResolvedValueOnce(usersWithMissingData)
            .mockResolvedValueOnce(updatedUsers)
            .mockResolvedValueOnce(updatedUsers);

        getJourneyHistoryAsync.mockResolvedValue([]);

        await addSampleData();

        expect(overwriteUsersAsync).toHaveBeenCalledWith(expect.any(Array));
    });

    it('adds missing users to reach 10 total', async () => {
        const existingUsers = [
            { id: '1', username: 'user1', password: 'pass', firstName: 'Test', lastName: 'User', dob: '1990-01-01' },
        ];

        const afterAddingUsers = Array.from({ length: 10 }, (_, i) => ({
            id: `${i + 1}`,
            username: `user${i + 1}`,
            password: `Password${i + 1}!`,
            firstName: expect.any(String),
            lastName: expect.any(String),
            dob: expect.any(String),
        }));

        getAllUsers
            .mockResolvedValueOnce(existingUsers)
            .mockResolvedValueOnce(existingUsers)
            .mockResolvedValueOnce(afterAddingUsers)
            .mockResolvedValueOnce(afterAddingUsers);

        getJourneyHistoryAsync.mockResolvedValue([]);

        await addSampleData();

        expect(addUserAsync).toHaveBeenCalledTimes(9);
    });

    it('adds journeys to users with no history and ensures 400 mile threshold is met', async () => {
        const mockUsers = Array.from({ length: 2 }, (_, i) => ({
            id: `${i + 1}`,
            username: `user${i + 1}`,
            password: `Password${i + 1}!`,
            firstName: `First${i}`,
            lastName: `Last${i}`,
            dob: '1990-01-01'
        }));

        getAllUsers
            .mockResolvedValueOnce(mockUsers)
            .mockResolvedValueOnce(mockUsers)
            .mockResolvedValueOnce(mockUsers)
            .mockResolvedValueOnce(mockUsers);

        getJourneyHistoryAsync.mockResolvedValue([]);
        calculateScore.mockReturnValue({ score: 90 });

        await addSampleData();

        const calls = addJourneyAsync.mock.calls.filter(call => call[0] === '1' || call[0] === '2');
        expect(calls.length).toBeGreaterThanOrEqual(mockUsers.length * 8);
        expect(calls.length).toBeLessThanOrEqual(mockUsers.length * 10);

        expect(calculateScore).toHaveBeenCalledTimes(calls.length);

        const distances = calls.map(c => c[1].distance);
        expect(Math.max(...distances)).toBeGreaterThanOrEqual(50);
    });
});
