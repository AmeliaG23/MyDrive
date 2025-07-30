import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useContext } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { UserContext } from '../context/UserContext';
import LoginScreen from '../screens/AuthScreens/LoginScreen';
import SignupScreen from '../screens/AuthScreens/SignUpScreen';
import TermsOnboardingScreen from '../screens/Onboarding/TermsOnboardingScreen';
import WelcomeOnboardingScreen from '../screens/Onboarding/WelcomeOnboardingScreen';
import MainTabNavigator from './MainTabNavigator';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
    const { user, onboarded } = useContext(UserContext);

    // Loading spinner while onboarding status loads
    if (user && onboarded === null) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#F9A800" />
            </View>
        );
    }

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {!user ? (
                <>
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Signup" component={SignupScreen} />
                </>
            ) : onboarded === false ? (
                <>
                    {/* Start onboarding with Welcome */}
                    <Stack.Screen name="WelcomeOnboarding" component={WelcomeOnboardingScreen} />
                    <Stack.Screen name="TermsOnboarding" component={TermsOnboardingScreen} />
                    {/* MainTabs only reachable after onboarding */}
                    <Stack.Screen name="MainTabs" component={MainTabNavigator} />
                </>
            ) : (
                <Stack.Screen name="MainTabs" component={MainTabNavigator} />
            )}
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
