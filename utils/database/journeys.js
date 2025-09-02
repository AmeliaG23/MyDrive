/**
 * journeys.js
 * ----------------
 * Created: 20-08-2025
 * Author: Amelia Goldsby
 * Project : A Dual-Focus Redesign of MyDrive: Enhancing Interfaces and Scoring Architecture
 * Course : Major Project, Level 6, QA
 *
 * Purpose:
 *    Index file to export database helpers
 *
 * (Rani et al., 2021)
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// Function to add journey
export const addJourneyAsync = async (userId, journeyData) => {
    try {
        // Get all journeys
        const journeysJSON = await AsyncStorage.getItem('journeys');
        const journeys = journeysJSON ? JSON.parse(journeysJSON) : {};

        // If no journeys = empty string
        if (!journeys[userId]) {
            journeys[userId] = [];
        }

        // Stores new journey for current user 
        journeys[userId].push(journeyData);
        await AsyncStorage.setItem('journeys', JSON.stringify(journeys));
    } catch (error) {
        console.error('Error adding journey:', error);
    }
};

// Function to get history of journeys
export const getJourneyHistoryAsync = async (userId) => {
    try {
        // Returns journeys in an empty array
        const journeysJSON = await AsyncStorage.getItem('journeys');
        const journeys = journeysJSON ? JSON.parse(journeysJSON) : {};
        return journeys[userId] || [];
    } catch (error) {
        console.error('Error fetching journey history:', error);
        return [];
    }
};

// Function to delete a specific journey
export const deleteJourneyAsync = async (userId, journeyId) => {
    try {
        // Gets all journeys
        const journeysJSON = await AsyncStorage.getItem('journeys');
        const journeys = journeysJSON ? JSON.parse(journeysJSON) : {};

        if (!journeys[userId]) return;

        // Deletes journey with specific id
        journeys[userId] = journeys[userId].filter(j => j.id !== journeyId);
        await AsyncStorage.setItem('journeys', JSON.stringify(journeys));
    } catch (error) {
        console.error('Error deleting journey:', error);
        throw error;
    }
};
