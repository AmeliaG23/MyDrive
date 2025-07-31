import { Ionicons } from '@expo/vector-icons';
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

    const handleContinue = async () => {
        if (!consentGiven) {
            Alert.alert('Consent Required', 'Please agree to the terms to proceed.');
            return;
        }

        setLoading(true);
        try {
            // Request location permission here
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(
                    'Permission Denied',
                    'Location access is required to track journeys.'
                );
                setLoading(false);
                return;
            }

            // Save permission granted state in context
            setLocationPermissionGranted(true);

            // Mark onboarding done
            await setOnboarded(true);

            // Navigate to main app screen
            navigation.reset({
                index: 0,
                routes: [{ name: 'MainTabs' }],
            });
        } catch (error) {
            console.error('Error updating onboarding status:', error);
            Alert.alert('Error', 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={OnboardingStyles.container}>
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{ position: 'absolute', top: 50, left: 20, zIndex: 10 }}
                testID="backButton"
            >
                <Ionicons name="arrow-back" size={24} color="#008080" />
            </TouchableOpacity>

            <ScrollView
                contentContainerStyle={OnboardingStyles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
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

                <Text style={OnboardingStyles.bulletTitle}>What we collect:</Text>
                <View style={OnboardingStyles.bulletRow}>
                    <Text style={OnboardingStyles.bullet}>
                        {'\u2022'} Motion (acceleration, braking, cornering)
                    </Text>
                </View>
                <View style={OnboardingStyles.bulletRow}>
                    <Text style={OnboardingStyles.bullet}>
                        {'\u2022'} GPS location (to map your journey and speed)
                    </Text>
                </View>
                <View style={OnboardingStyles.bulletRow}>
                    <Text style={OnboardingStyles.bullet}>{'\u2022'} Phone usage while driving</Text>
                </View>
                <View style={OnboardingStyles.bulletRow}>
                    <Text style={OnboardingStyles.bullet}>{'\u2022'} Background activity status</Text>
                </View>

                <Text style={OnboardingStyles.bulletTitle}>How we use your data:</Text>
                <View style={OnboardingStyles.bulletRow}>
                    <Text style={OnboardingStyles.bullet}>{'\u2022'} To calculate your driving score</Text>
                </View>
                <View style={OnboardingStyles.bulletRow}>
                    <Text style={OnboardingStyles.bullet}>{'\u2022'} To offer personalized driving tips</Text>
                </View>
                <View style={OnboardingStyles.bulletRow}>
                    <Text style={OnboardingStyles.bullet}>
                        {'\u2022'} To notify you about trip summaries and progress
                    </Text>
                </View>

                <Text style={OnboardingStyles.note}>
                    All data is stored securely on your device and encrypted before any
                    transmission. Your data is never sold and only used to improve your driving
                    experience.
                </Text>

                <View
                    style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 20 }}
                >
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
            </ScrollView>
        </View>
    );
}
