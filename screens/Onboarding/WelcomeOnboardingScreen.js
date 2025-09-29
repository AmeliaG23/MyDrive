/**
 * WelcomeOnboardingScreen.jsx
 * ----------------
 * Created: 01-08-2025
 * Author: Amelia Goldsby
 * Project : A Dual-Focus Redesign of MyDrive: Enhancing Interfaces and Scoring Architecture
 * Course : Major Project, Level 6, QA
 *
 * Purpose:
 *    Introduces the user to MyDrive and lists benefits and value.
 *    First page of onboarding journey.
 * 
 * (Rani et al., 2021)
 */

import { Entypo, FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import OnboardingStyles from '../../styles/OnboardingStyles';

export default function WelcomeOnboardingScreen({ navigation }) {
    return (
        <View style={OnboardingStyles.container}>
            <ScrollView
                contentContainerStyle={OnboardingStyles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
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
                    MyDrive helps you become a safer driver by monitoring your driving behavior.
                    Your driving score can even help reduce your insurance premium.
                </Text>
                <View style={OnboardingStyles.iconContainer}>
                    <FontAwesome5 name="car" size={80} color="#008080" />
                </View>
                <Text style={OnboardingStyles.bulletTitle}>Important Benefits:</Text>
                <View style={OnboardingStyles.cardRow}>
                    <MaterialIcons name="local-offer" size={20} color="#008080" />
                    <Text style={OnboardingStyles.cardText}>
                        Drive 400 miles over the past 60 days and earn a special Aviva car insurance discount!
                    </Text>
                </View>
                <View style={OnboardingStyles.cardRow}>
                    <Ionicons name="bar-chart" size={20} color="#008080" />
                    <Text style={OnboardingStyles.cardText}>
                        Track your driving score and see how safe you are on the road.
                    </Text>
                </View>
                <View style={OnboardingStyles.cardRow}>
                    <Entypo name="lock" size={20} color="#008080" />
                    <Text style={OnboardingStyles.cardText}>
                        All data is stored securely and never sold.
                    </Text>
                </View>
                <View style={OnboardingStyles.bottomButtonContainer}>
                    <TouchableOpacity
                        style={OnboardingStyles.button}
                        onPress={() => navigation.navigate('TermsOnboarding')}
                    >
                        <Text style={OnboardingStyles.buttonText}>Next</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}
