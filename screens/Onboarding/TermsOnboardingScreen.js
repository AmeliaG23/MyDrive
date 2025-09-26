/**
 * TermsOnboardingScreen.jsx
 * ----------------
 * Created: 01-09-2025
 * Author: Amelia Goldsby
 * Project : A Dual-Focus Redesign of MyDrive: Enhancing Interfaces and Scoring Architecture
 * Course : Major Project, Level 6, QA
 *
 * Purpose:
 *    Displays terms of use and permisions required for users to utilise MyDrive.
 *    Displays what data is collected.
 *    Requests location permissions, which is essential for telematics tracking. 
 * 
 * (Rani et al., 2021)
 */

import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import * as Location from 'expo-location';
import React, { useContext, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { UserContext } from '../../context/UserContext';
import OnboardingStyles from '../../styles/OnboardingStyles';

export default function TermsOnboardingScreen({ navigation }) {
    const [consentGiven, setConsentGiven] = useState(false);
    const [loading, setLoading] = useState(false);
    const { setOnboarded, setLocationPermissionGranted } = useContext(UserContext);

    // Function to set loading as well as ensuring the user has given consent to location tracking
    const handleContinue = async () => {
        if (!consentGiven) {
            Alert.alert('Consent Required', 'Please agree to the terms to proceed.');
            return;
        }

        setLoading(true);
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(
                    'Permission Denied',
                    'Location access is required to track journeys.'
                );
                setLoading(false);
                return;
            }

            setLocationPermissionGranted(true);
            await setOnboarded(true);

            navigation.reset({
                index: 0,
                routes: [{ name: 'MainTabs' }],
            });
        } catch (error) {
            Alert.alert('Error', 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={OnboardingStyles.container}>
            <ScrollView
                contentContainerStyle={{ paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
            >
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{ position: 'absolute', top: 50, left: 20, zIndex: 10 }}
                    testID="backButton"
                >
                    <Ionicons name="arrow-back" size={24} color="#008080" />
                </TouchableOpacity>
                <Image
                    source={require('../../assets/aviva-logo.png')}
                    style={OnboardingStyles.logo}
                    resizeMode="contain"
                />
                <Text style={OnboardingStyles.title}>Data Consent & Permissions</Text>
                <Text style={OnboardingStyles.description}>
                    To provide accurate driving feedback and calculate your safety score, we
                    collect and process the following data while you are driving:
                </Text>
                <View style={OnboardingStyles.iconContainer}>
                    <FontAwesome5 name="car" size={80} color="#008080" />
                </View>
                <Text style={OnboardingStyles.bulletTitle}>What we collect:</Text>
                <View style={OnboardingStyles.cardRow}>
                    <FontAwesome5 name="tachometer-alt" size={24} color="#008080" />
                    <Text style={OnboardingStyles.cardText}>
                        Motion: acceleration, braking, cornering
                    </Text>
                </View>
                <View style={OnboardingStyles.cardRow}>
                    <Ionicons name="location-outline" size={24} color="#008080" />
                    <Text style={OnboardingStyles.cardText}>
                        GPS location: map journey and speed
                    </Text>
                </View>
                <View style={OnboardingStyles.cardRow}>
                    <FontAwesome5 name="mobile-alt" size={24} color="#008080" />
                    <Text style={OnboardingStyles.cardText}>Phone usage while driving</Text>
                </View>
                <View style={OnboardingStyles.cardRow}>
                    <FontAwesome5 name="running" size={24} color="#008080" />
                    <Text style={OnboardingStyles.cardText}>Background activity status</Text>
                </View>
                <Text style={OnboardingStyles.bulletTitle}>How we use your data:</Text>
                <View style={OnboardingStyles.cardRow}>
                    <FontAwesome5 name="chart-line" size={24} color="#008080" />
                    <Text style={OnboardingStyles.cardText}>Calculate your driving score</Text>
                </View>
                <View style={OnboardingStyles.cardRow}>
                    <FontAwesome5 name="lightbulb" size={24} color="#008080" />
                    <Text style={OnboardingStyles.cardText}>Offer personalised driving tips</Text>
                </View>
                <View style={OnboardingStyles.cardRow}>
                    <FontAwesome5 name="clipboard-list" size={24} color="#008080" />
                    <Text style={OnboardingStyles.cardText}>
                        Notify you about trip summaries and progress
                    </Text>
                </View>
                <Text style={OnboardingStyles.note}>
                    All data is securely stored on your device and encrypted before transmission.
                    Your data is never sold and only used to improve your driving experience.
                </Text>
                {/* Consent Checkbox */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 20 }}>
                    <Checkbox
                        value={consentGiven}
                        onValueChange={setConsentGiven}
                        color={consentGiven ? '#008080' : 'red'}
                        testID="consent-checkbox"
                    />
                    <Text style={{ marginLeft: 10, fontSize: 14, color: '#333', flex: 1 }}>
                        I agree to data tracking and storage as outlined above.
                    </Text>
                </View>
                <View style={{ marginTop: 10 }}>
                    <TouchableOpacity
                        style={[OnboardingStyles.button, { opacity: consentGiven ? 1 : 0.6 }]}
                        onPress={handleContinue}
                        disabled={!consentGiven || loading}
                        testID="continueButton"
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={OnboardingStyles.buttonText}>Continue</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}
