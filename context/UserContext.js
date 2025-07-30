import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [onboarded, setOnboardedState] = useState(null); // null = loading, true/false = loaded

    // Load onboarding status for the logged-in user
    const loadOnboardingStatus = async (username) => {
        try {
            const onboardedValue = await AsyncStorage.getItem(`onboarded_${username}`);
            setOnboardedState(onboardedValue === 'true');
        } catch (e) {
            console.error('Error checking onboarding status:', e);
            setOnboardedState(false);
        }
    };

    // login sets user and loads onboarding status
    const login = async (loggedInUser) => {
        setUser(loggedInUser);
        await loadOnboardingStatus(loggedInUser.username);
    };

    // logout resets user and onboarding state
    const logout = () => {
        setUser(null);
        setOnboardedState(null);
    };

    // Save onboarding status persistently and update state
    const setOnboarded = async (value) => {
        if (!user?.username) return; // safety check

        try {
            await AsyncStorage.setItem(`onboarded_${user.username}`, value ? 'true' : 'false');
            setOnboardedState(value);
        } catch (e) {
            console.error('Failed to save onboarding status:', e);
        }
    };

    return (
        <UserContext.Provider value={{ user, login, logout, onboarded, setOnboarded }}>
            {children}
        </UserContext.Provider>
    );
};
