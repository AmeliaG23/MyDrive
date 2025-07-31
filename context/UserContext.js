import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [onboarded, setOnboardedState] = useState(null); // null = loading, true/false = loaded
    const [locationPermissionGranted, setLocationPermissionGrantedState] = useState(null);

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

    // Load location permission status for the logged-in user
    const loadLocationPermissionStatus = async (username) => {
        try {
            const permissionValue = await AsyncStorage.getItem(`locationPermissionGranted_${username}`);
            setLocationPermissionGrantedState(permissionValue === 'true');
        } catch (e) {
            console.error('Error loading location permission status:', e);
            setLocationPermissionGrantedState(false);
        }
    };

    // login sets user and loads statuses
    const login = async (loggedInUser) => {
        setUser(loggedInUser);
        await loadOnboardingStatus(loggedInUser.username);
        await loadLocationPermissionStatus(loggedInUser.username);
    };

    // logout resets user and states
    const logout = () => {
        setUser(null);
        setOnboardedState(null);
        setLocationPermissionGrantedState(null);
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

    // Save location permission persistently and update state
    const setLocationPermissionGranted = async (value) => {
        if (!user?.username) return; // safety check

        try {
            await AsyncStorage.setItem(`locationPermissionGranted_${user.username}`, value ? 'true' : 'false');
            setLocationPermissionGrantedState(value);
        } catch (e) {
            console.error('Failed to save location permission status:', e);
        }
    };

    return (
        <UserContext.Provider
            value={{
                user,
                login,
                logout,
                onboarded,
                setOnboarded,
                locationPermissionGranted,
                setLocationPermissionGranted,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};
