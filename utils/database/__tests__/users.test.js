import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    addUserAsync,
    getAllUsers,
    getUserById,
    overwriteUsersAsync
} from '../users'; // adjust path as needed

describe('User Utils', () => {

    beforeEach(async () => {
        await AsyncStorage.clear();
        jest.clearAllMocks();
    });

    test('addUserAsync adds a new user', async () => {
        const userData = { username: 'testuser', password: '1234' };
        const result = await addUserAsync(userData);

        expect(result).toBe(true);

        const stored = await AsyncStorage.getItem('users');
        const users = JSON.parse(stored);
        expect(users.length).toBe(1);
        expect(users[0].username).toBe('testuser');
    });

    test('addUserAsync returns false if username already exists', async () => {
        const userData = { username: 'duplicate', password: '1234' };
        await addUserAsync(userData);

        const result = await addUserAsync(userData);
        expect(result).toBe(false);
    });

    test('getAllUsers returns users array', async () => {
        const fakeUsers = [{ id: '1', username: 'john', password: 'pass' }];
        await AsyncStorage.setItem('users', JSON.stringify(fakeUsers));

        const users = await getAllUsers();
        expect(users).toEqual(fakeUsers);
    });

    test('getUserById returns correct user', async () => {
        const fakeUsers = [{ id: 'abc123', username: 'alice', password: 'pw' }];
        await AsyncStorage.setItem('users', JSON.stringify(fakeUsers));

        const user = await getUserById('abc123');
        expect(user).toEqual(fakeUsers[0]);
    });

    test('getUserById returns null if user not found', async () => {
        const fakeUsers = [{ id: 'xyz', username: 'bob', password: 'pw' }];
        await AsyncStorage.setItem('users', JSON.stringify(fakeUsers));

        const user = await getUserById('not-exist');
        expect(user).toBeNull();
    });

    test('overwriteUsersAsync replaces users', async () => {
        const users = [
            { id: '1', username: 'one' },
            { id: '2', username: 'two' }
        ];
        await overwriteUsersAsync(users);

        const stored = await AsyncStorage.getItem('users');
        const result = JSON.parse(stored);
        expect(result).toEqual(users);
    });

});
