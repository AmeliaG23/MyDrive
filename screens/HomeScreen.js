/**
 * HomeScreen.jsx
 * ----------------
 * Created: 01-09-2025
 * Author: Amelia Goldsby
 * Project : A Dual-Focus Redesign of MyDrive: Enhancing Interfaces and Scoring Architecture
 * Course : Major Project, Level 6, QA
 *
 * Purpose:
 *    Main dashboard for users when logged in.
 *    Displays Doughnut chart with average 30 day score.
 *    Displays discount message when user has driven 400 miles in the last 60 days.
 * 
 * (Rani et al., 2021)
 */

import { Ionicons } from '@expo/vector-icons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React, { useContext, useEffect, useState } from 'react';
import { Dimensions, Linking, Modal, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import uuid from 'react-native-uuid';

import DoughnutChart from '../components/charts/DoughnutChart';
import JourneysTab from '../components/tabs/JourneysTab';
import ScoreTab from '../components/tabs/ScoreTab';
import { UserContext } from '../context/UserContext';
import HomeStyles from '../styles/HomeStyles';
import { calculateScore, getJourneyHistoryAsync } from '../utils';

// Sets dimensions for tabs
const Tab = createMaterialTopTabNavigator();
const screenHeight = Dimensions.get('window').height;
const halfScreenHeight = screenHeight / 2;

export default function HomeScreen() {
    const { user } = useContext(UserContext);
    const [journeys, setJourneys] = useState([]);
    const [averageScore, setAverageScore] = useState(0);
    const [filter, setFilter] = useState('2mo');
    const [showDiscountMessage, setShowDiscountMessage] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [referenceCode, setReferenceCode] = useState(null);

    useEffect(() => {
        async function fetchJourneys() {
            if (!user?.id) return;

            const history = await getJourneyHistoryAsync(user.id);
            setJourneys(history);

            const recent30 = history.filter(j => (Date.now() - new Date(j.date).getTime()) / (1000 * 3600 * 24) <= 30);
            const totalScore = recent30.reduce((sum, j) => {
                let score = j.scores?.total;
                if (score === undefined) {
                    try {
                        score = calculateScore(j)?.total || 0;
                    } catch {
                        score = 0;
                    }
                }
                return sum + score;
            }, 0);

            // Sets average score
            const avgScore = recent30.length ? totalScore / recent30.length : 0;
            setAverageScore(Math.round(avgScore));

            // Discount eligibility (>=400 miles last 60 days)
            const recent60 = history.filter(j => {
                const daysAgo = (Date.now() - new Date(j.date).getTime()) / (1000 * 3600 * 24);
                return daysAgo <= 60 && (j.distance || 0) > 0;
            });

            const totalDistance = recent60.reduce((acc, j) => acc + (j.distance || 0), 0);

            if (totalDistance >= 400) {
                // If eligible generates random discount code for user
                setReferenceCode(prev => prev || uuid.v4().split('-')[0].toUpperCase() || 'REFCODE');
                setShowDiscountMessage(true);
            } else {
                setReferenceCode(null);
                setShowDiscountMessage(false);
            }
        }
        fetchJourneys();
    }, [user]);

    // Function to handle phone number press
    const handleCallPress = () => Linking.openURL('tel:08001234567');

    return (
        <SafeAreaView style={{ flex: 1 }} edges={['bottom', 'left', 'right']}>
            <View style={{ flex: 1 }}>
                <View style={[HomeStyles.topSection, { height: halfScreenHeight, backgroundColor: '#008080' }]}>
                    {user?.firstName && (
                        <>
                            <Text style={[HomeStyles.welcomeText, { color: '#fff' }]}>
                                Welcome back to MyDrive, {user.firstName}
                            </Text>
                            {showDiscountMessage && (
                                <TouchableOpacity
                                    style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}
                                    onPress={() => setShowModal(true)}
                                    testID="discount-message"
                                >
                                    <Text style={{ color: '#fff', fontSize: 16, marginRight: 6 }}>
                                        🎉 You are now eligible for your insurance discount
                                    </Text>
                                    <Ionicons name="information-circle-outline" size={20} color="#fff" />
                                </TouchableOpacity>
                            )}
                        </>
                    )}
                    <DoughnutChart score={averageScore} />
                    <Text style={[HomeStyles.topSectionText, { color: '#fff' }]}>30-Day Average</Text>
                </View>
                <Tab.Navigator
                    screenOptions={{
                        tabBarStyle: HomeStyles.tabBar,
                        tabBarLabelStyle: HomeStyles.tabLabel,
                        tabBarIndicatorStyle: { backgroundColor: '#F9A800' },
                    }}
                >
                    <Tab.Screen name="Score">{() => <ScoreTab journeys={journeys.filter(j => j.scores?.total !== undefined)} />}</Tab.Screen>
                    <Tab.Screen name="Journeys">{() => <JourneysTab journeys={journeys} filter={filter} setFilter={setFilter} />}</Tab.Screen>
                </Tab.Navigator>
                {/* Modal for when discount is applicable */}
                <Modal visible={showModal} transparent animationType="slide" onRequestClose={() => setShowModal(false)}>
                    <View style={HomeStyles.modalOverlay}>
                        <View style={HomeStyles.modalContent}>
                            <TouchableOpacity
                                accessibilityLabel="Close modal"
                                onPress={() => setShowModal(false)}
                                style={{ position: 'absolute', top: 15, right: 15 }}
                            >
                                <Ionicons name="close-circle" size={28} color="#008000" />
                            </TouchableOpacity>
                            <Ionicons name="happy-outline" size={64} color="#008080" style={{ alignSelf: 'center', marginBottom: 20 }} />
                            <Text style={[HomeStyles.modalTitle, { textAlign: 'center' }]}>Congratulations!</Text>
                            <Text style={[HomeStyles.modalText, { textAlign: 'center', marginBottom: 20 }]}>
                                You have now met the requirements to receive a personalised car insurance discount.
                            </Text>
                            <Text style={[HomeStyles.modalText, { textAlign: 'center' }]}>
                                Please call{' '}
                                <Text style={{ fontWeight: 'bold', color: '#008080' }} onPress={handleCallPress}>
                                    0800 123 4567
                                </Text>{' '}
                                with the following reference:
                            </Text>
                            <Text style={[HomeStyles.modalTitle, { textAlign: 'center', marginTop: 10 }]}>{referenceCode}</Text>
                        </View>
                    </View>
                </Modal>
            </View>
        </SafeAreaView>
    );
}
