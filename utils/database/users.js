/**
 * users.js
 * ----------------
 * Created: 20-08-2025
 * Author: Amelia Goldsby
 * Project : A Dual-Focus Redesign of MyDrive: Enhancing Interfaces and Scoring Architecture
 * Course : Major Project, Level 6, QA
 *
 * Purpose:
 *    User management functions for the database.
 *
 * (Rani et al., 2021)
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// Function to add new user
export const addUserAsync = async (userData) => {
    try {
        const users = (await getAllUsers()) || [];

        // Prevents duplicate usernames
        if (users.find(user => user.username === userData.username)) {
            return false;
        }

        // Generates random user id and saves new user data
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

// Function to retrieve all users
export const getAllUsers = async () => {
    try {
        // Returns all users in array
        const users = await AsyncStorage.getItem('users');
        return users ? JSON.parse(users) : [];
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
};

// Function to retrieve user by specific id
export const getUserById = async (userId) => {
    try {
        // Retrieves all users and returns specific user from database
        const users = await getAllUsers();
        return users.find(user => user.id === userId) || null;
    } catch (error) {
        console.error('Error fetching user:', error);
        return null;
    }
};

// Function to overwrite exisiting users
export const overwriteUsersAsync = async (users) => {
    try {
        await AsyncStorage.setItem('users', JSON.stringify(users));
    } catch (error) {
        console.error('Error overwriting users:', error);
    }
};
