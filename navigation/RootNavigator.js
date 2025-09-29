/**
 * RootNavigator.js
 * ----------------
 * Created: 01-08-2025
 * Author: Amelia Goldsby
 * Project : A Dual-Focus Redesign of MyDrive: Enhancing Interfaces and Scoring Architecture
 * Course : Major Project, Level 6, QA
 *
 * Purpose:
 *    Root navigator which lays out the screens for multiple scenarios:
 *      - Signed in or not
 *      - Onboarded or not
 *
 * (Rani et al., 2021)
 */

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import React, { useContext } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { UserContext } from '../context/UserContext';
import LoginScreen from '../screens/AuthScreens/LoginScreen';
import SignupScreen from '../screens/AuthScreens/SignUpScreen';
import JourneyScreen from '../screens/JourneyScreen';
import TermsOnboardingScreen from '../screens/Onboarding/TermsOnboardingScreen';
import WelcomeOnboardingScreen from '../screens/Onboarding/WelcomeOnboardingScreen';
import MainTabNavigator from './MainTabNavigator';

const Stack = createNativeStackNavigator();

// Reusable options to avoid repetition
const noTitleOptions = {
    headerShown: true,
    title: '',
};

const hiddenHeaderOptions = {
    headerShown: false,
};

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

    const getAuthScreens = () => (
        <>
            {/* User not logged in */}
            <Stack.Screen name="Login" component={LoginScreen} options={noTitleOptions} />
            <Stack.Screen name="Signup" component={SignupScreen} options={noTitleOptions} />
        </>
    );

    const getOnboardingScreens = () => (
        <>
            {/* User logged in but not onboarded */}
            <Stack.Screen name="WelcomeOnboarding" component={WelcomeOnboardingScreen} options={noTitleOptions} />
            <Stack.Screen
                name="TermsOnboarding"
                component={TermsOnboardingScreen}
                options={{
                    ...noTitleOptions,
                    headerBackTitle: 'Back'
                }}
            />
            <Stack.Screen name="MainTabs" component={MainTabNavigator} options={hiddenHeaderOptions} />
            <Stack.Screen name="JourneyScreen" component={JourneyScreen} options={{
                ...noTitleOptions,
                headerBackTitle: 'Back'
            }} />
        </>
    );

    const getMainScreens = () => (
        <>
            {/* User logged in and onboarded */}
            <Stack.Screen name="MainTabs" component={MainTabNavigator} options={hiddenHeaderOptions} />
            <Stack.Screen name="JourneyScreen" component={JourneyScreen} options={{
                ...noTitleOptions,
                headerBackTitle: 'Back'
            }} />
        </>
    );

    return (
        <View style={{ flex: 1, backgroundColor: '#000' }}>
            {/* Expo Status Bar - consistent across all devices */}
            <StatusBar style="dark" backgroundColor='#000' />
            <Stack.Navigator
                screenOptions={{
                    headerShown: true,
                    headerTintColor: '#008080',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}
            >
                {!user && getAuthScreens()}
                {user && onboarded === false && getOnboardingScreens()}
                {user && onboarded && getMainScreens()}
            </Stack.Navigator>
        </View>
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
