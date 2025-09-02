/**
 * RootNavigator.js
 * ----------------
 * Created: 01-08-2025
 * Author: Amelia Goldsby
 * Project : A Dual-Focus Redesign of MyDrive: Enhancing Interfaces and Scoring Architecture
 * Course : Major Project, Level 6, QA
 *
 * Purpose:
 *    Root navigator which lays out the screens for multiple scenrios:
 *      - Signed in or not
 *      - Onboarded or not
 *
 * (Rani et al., 2021)
 */

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useContext } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { UserContext } from '../context/UserContext';
import LoginScreen from '../screens/AuthScreens/LoginScreen';
import SignupScreen from '../screens/AuthScreens/SignUpScreen';
import JourneyScreen from '../screens/JourneyScreen'; // import JourneyScreen here
import TermsOnboardingScreen from '../screens/Onboarding/TermsOnboardingScreen';
import WelcomeOnboardingScreen from '../screens/Onboarding/WelcomeOnboardingScreen';
import MainTabNavigator from './MainTabNavigator';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
    const { user, onboarded } = useContext(UserContext);

    // Show loading spinner while onboarding status is being loaded
    if (user && onboarded === null) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#F9A800" />
            </View>
        );
    }

    let screens;

    if (!user) {
        // User not logged in
        screens = (
            <>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Signup" component={SignupScreen} />
            </>
        );
    } else if (onboarded === false) {
        // User logged in but not onboarded
        screens = (
            <>
                <Stack.Screen name="WelcomeOnboarding" component={WelcomeOnboardingScreen} />
                <Stack.Screen name="TermsOnboarding" component={TermsOnboardingScreen} />
                <Stack.Screen name="MainTabs" component={MainTabNavigator} />
                <Stack.Screen name="JourneyScreen" component={JourneyScreen} />
            </>
        );
    } else {
        // User logged in and onboarded
        screens = (
            <>
                <Stack.Screen name="MainTabs" component={MainTabNavigator} />
                <Stack.Screen name="JourneyScreen" component={JourneyScreen} />
            </>
        );
    }

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {screens}
        </Stack.Navigator>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
});
