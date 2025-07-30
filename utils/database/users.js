import AsyncStorage from '@react-native-async-storage/async-storage';

export const addUserAsync = async (userData) => {
    try {
        const users = (await getAllUsers()) || [];

        if (users.find(user => user.username === userData.username)) {
            return false;
        }

        const userId = `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
        const newUser = { id: userId, ...userData };
        users.push(newUser);

        await AsyncStorage.setItem('users', JSON.stringify(users));
        return true;
    } catch (error) {
        console.error('Error adding user:', error);
        return false;
    }
};

export const getAllUsers = async () => {
    try {
        const users = await AsyncStorage.getItem('users');
        return users ? JSON.parse(users) : [];
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
};

export const getUserById = async (userId) => {
    try {
        const users = await getAllUsers();
        return users.find(user => user.id === userId) || null;
    } catch (error) {
        console.error('Error fetching user:', error);
        return null;
    }
};

export const overwriteUsersAsync = async (users) => {
    try {
        await AsyncStorage.setItem('users', JSON.stringify(users));
    } catch (error) {
        console.error('Error overwriting users:', error);
    }
};
