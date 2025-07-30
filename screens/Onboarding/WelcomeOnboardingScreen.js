import { Entypo, FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons'; // Make sure expo/vector-icons is installed
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import OnboardingStyles from '../../styles/OnboardingStyles';

export default function WelcomeOnboardingScreen({ navigation }) {
    return (
        <View style={OnboardingStyles.container}>
            <ScrollView contentContainerStyle={OnboardingStyles.scrollContent}>
                <Image
                    source={require('../../assets/aviva-logo.png')}
                    style={OnboardingStyles.logo}
                    resizeMode="contain"
                />

                <Text style={OnboardingStyles.title}>Welcome to MyDrive!</Text>

                <Text style={OnboardingStyles.subtitle}>
                    Drive smart. Drive safe. Get rewarded.
                </Text>

                <Text style={OnboardingStyles.description}>
                    MyDrive helps you become a safer driver by monitoring your driving behavior. Your driving score can even help reduce your insurance premium.
                </Text>

                <Text style={OnboardingStyles.bulletTitle}>We track:</Text>

                <View style={OnboardingStyles.bulletRow}>
                    <MaterialIcons name="speed" size={20} color="#008080" />
                    <Text style={OnboardingStyles.bullet}>Speed consistency and limits</Text>
                </View>

                <View style={OnboardingStyles.bulletRow}>
                    <FontAwesome5 name="car-crash" size={20} color="#008080" />
                    <Text style={OnboardingStyles.bullet}>Braking and cornering</Text>
                </View>

                <View style={OnboardingStyles.bulletRow}>
                    <Ionicons name="phone-portrait-outline" size={20} color="#008080" />
                    <Text style={OnboardingStyles.bullet}>Phone usage while driving</Text>
                </View>

                <View style={OnboardingStyles.bulletRow}>
                    <Entypo name="clock" size={20} color="#008080" />
                    <Text style={OnboardingStyles.bullet}>Time of day and distance</Text>
                </View>

                <Text style={OnboardingStyles.note}>
                    All data is securely stored and used only to calculate your driving score. Your privacy is our priority.
                </Text>
            </ScrollView>

            <TouchableOpacity style={OnboardingStyles.button} onPress={() => navigation.navigate('TermsOnboarding')}>
                <Text style={OnboardingStyles.buttonText}>Next</Text>
            </TouchableOpacity>
        </View>
    );
}
