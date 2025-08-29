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
            { id: '1', username: 'user1', password: 'pass' }, // missing names & dob
            { id: '2', username: 'user2', password: 'pass', firstName: 'Test', lastName: 'User', dob: null },
        ];

        const updatedUsers = usersWithMissingData.map((u, i) => ({
            ...u,
            firstName: u.firstName || expect.any(String),
            lastName: u.lastName || expect.any(String),
            dob: u.dob || expect.any(String),
        }));

        getAllUsers
            .mockResolvedValueOnce(usersWithMissingData) // initial load
            .mockResolvedValueOnce(updatedUsers)         // after possible update
            .mockResolvedValueOnce(updatedUsers);        // before journey generation

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
            .mockResolvedValueOnce(existingUsers) // first check
            .mockResolvedValueOnce(existingUsers) // after update
            .mockResolvedValueOnce(afterAddingUsers) // after adding users
            .mockResolvedValueOnce(afterAddingUsers); // before journey generation

        getJourneyHistoryAsync.mockResolvedValue([]);

        await addSampleData();

        expect(addUserAsync).toHaveBeenCalledTimes(9); // already 1 exists
    });

    it('adds journeys to users with no history', async () => {
        const mockUsers = Array.from({ length: 2 }, (_, i) => ({
            id: `${i + 1}`,
            username: `user${i + 1}`,
            password: `Password${i + 1}!`,
            firstName: `First${i}`,
            lastName: `Last${i}`,
            dob: '1990-01-01'
        }));

        getAllUsers
            .mockResolvedValueOnce(mockUsers) // initial
            .mockResolvedValueOnce(mockUsers) // after update
            .mockResolvedValueOnce(mockUsers) // after adding missing users
            .mockResolvedValueOnce(mockUsers); // before journey loop

        getJourneyHistoryAsync.mockResolvedValue([]); // no journeys
        calculateScore.mockReturnValue({ score: 90 });

        await addSampleData();

        // Each user should get 3 recent + 5 older journeys
        expect(addJourneyAsync).toHaveBeenCalledTimes(mockUsers.length * (3 + 5));
        // Optional: verify calculateScore called for each journey
        expect(calculateScore).toHaveBeenCalledTimes(mockUsers.length * (3 + 5));
    });
});
