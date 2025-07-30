import AsyncStorage from '@react-native-async-storage/async-storage';

export const addJourneyAsync = async (userId, journeyData) => {
    try {
        const journeysJSON = await AsyncStorage.getItem('journeys');
        const journeys = journeysJSON ? JSON.parse(journeysJSON) : {};

        if (!journeys[userId]) {
            journeys[userId] = [];
        }

        journeys[userId].push(journeyData);
        await AsyncStorage.setItem('journeys', JSON.stringify(journeys));
    } catch (error) {
        console.error('Error adding journey:', error);
    }
};

export const getJourneyHistoryAsync = async (userId) => {
    try {
        const journeysJSON = await AsyncStorage.getItem('journeys');
        const journeys = journeysJSON ? JSON.parse(journeysJSON) : {};
        return journeys[userId] || [];
    } catch (error) {
        console.error('Error fetching journey history:', error);
        return [];
    }
};
