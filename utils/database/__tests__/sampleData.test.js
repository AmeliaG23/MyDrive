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
            firstName: u.firstName || 'Alice',
            lastName: u.lastName || 'Smith',
            dob: u.dob || '1990-01-01'
        }));

        getAllUsers
            .mockResolvedValueOnce(usersWithMissingData) // first load
            .mockResolvedValueOnce(updatedUsers)         // after update
            .mockResolvedValueOnce(updatedUsers);        // before journey generation

        getJourneyHistoryAsync.mockResolvedValue([]);

        await addSampleData();

        expect(overwriteUsersAsync).toHaveBeenCalledWith(expect.any(Array));
    });

    it('adds missing users if less than 10 exist', async () => {
        const existingUsers = [
            { id: '1', username: 'user1', password: 'pass', firstName: 'Test', lastName: 'User', dob: '1990-01-01' },
        ];
        const tenUsers = Array.from({ length: 10 }, (_, i) => ({
            id: `${i}`,
            username: `user${i + 1}`,
            password: `Password${i + 1}!`,
            firstName: `First${i}`,
            lastName: `Last${i}`,
            dob: '1990-01-01'
        }));

        getAllUsers
            .mockResolvedValueOnce(existingUsers) // first check
            .mockResolvedValueOnce(existingUsers) // after possible update
            .mockResolvedValueOnce(tenUsers)      // after adding users
            .mockResolvedValueOnce(tenUsers);     // for journeys

        getJourneyHistoryAsync.mockResolvedValue([]);

        await addSampleData();

        // We expect some users to be added
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
            .mockResolvedValueOnce(mockUsers) // first load
            .mockResolvedValueOnce(mockUsers) // after update
            .mockResolvedValueOnce(mockUsers) // after add
            .mockResolvedValueOnce(mockUsers); // final before journey loop

        getJourneyHistoryAsync.mockResolvedValue([]); // simulate no journeys
        calculateScore.mockReturnValue({ score: 90 });

        await addSampleData();

        expect(addJourneyAsync).toHaveBeenCalledTimes(2 * 3); // 3 journeys per user
    });
});
