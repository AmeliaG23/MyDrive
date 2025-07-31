import { Ionicons } from '@expo/vector-icons'; // for happy face icon
import React, { useContext, useEffect, useState } from 'react';
import { Dimensions, Modal, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { v4 as uuidv4 } from 'uuid'; // npm install uuid or use your own ref generator

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import DoughnutChart from '../components/charts/DoughnutChart';
import JourneysTab from '../components/tabs/JourneysTab';
import ScoreTab from '../components/tabs/ScoreTab';
import { UserContext } from '../context/UserContext';
import HomeStyles from '../styles/HomeStyles';
import { calculateScore, getJourneyHistoryAsync } from '../utils';

const Tab = createMaterialTopTabNavigator();
const screenHeight = Dimensions.get('window').height;
const halfScreenHeight = screenHeight / 2;

export default function HomeScreen() {
    const insets = useSafeAreaInsets();
    const { user } = useContext(UserContext);
    const [journeys, setJourneys] = useState([]);
    const [averageScore, setAverageScore] = useState(0);
    const [filter, setFilter] = useState('2mo');

    const [showModal, setShowModal] = useState(false);
    const [referenceCode, setReferenceCode] = useState(null);

    useEffect(() => {
        async function fetchJourneys() {
            if (!user?.id) return;
            const history = await getJourneyHistoryAsync(user.id);

            setJourneys(history);

            // Calculate 30-day average score for existing logic
            const recent30 = history.filter(j => {
                const daysAgo = (Date.now() - new Date(j.date).getTime()) / (1000 * 3600 * 24);
                return daysAgo <= 30;
            });

            const totalScore = recent30.reduce((sum, j) => {
                let score = j.scores?.total;
                if (score === undefined) {
                    try {
                        score = calculateScore(j)?.total || 0;
                    } catch (e) {
                        score = 0;
                    }
                }
                return sum + score;
            }, 0);
            const avgScore = recent30.length ? totalScore / recent30.length : 0;
            setAverageScore(Math.round(avgScore));

            // Check 60-day total distance condition for modal
            const recent60 = history.filter(j => {
                const daysAgo = (Date.now() - new Date(j.date).getTime()) / (1000 * 3600 * 24);
                return daysAgo <= 60;
            });

            const totalDistance60Days = recent60.reduce((acc, journey) => acc + (journey.distance || 0), 0);

            if (totalDistance60Days > 400 && !referenceCode) {
                // Generate and store a unique reference code
                const ref = uuidv4().split('-')[0].toUpperCase(); // short ref code
                setReferenceCode(ref);
                setShowModal(true);

                // Here you should also save the ref for the user in your backend/storage if needed
            }
        }

        fetchJourneys();
    }, [user, referenceCode]);

    return (
        <SafeAreaView style={{ flex: 1 }} edges={['bottom', 'left', 'right']}>
            <View style={{ flex: 1 }}>
                <View style={[HomeStyles.topSection, { height: halfScreenHeight, backgroundColor: '#008080' }]}>
                    {user?.firstName && (
                        <Text style={HomeStyles.welcomeText}>
                            Welcome back to MyDrive, {user.firstName}
                        </Text>
                    )}
                    <DoughnutChart score={averageScore} />
                    <Text style={HomeStyles.topSectionText}>30-Day Average</Text>
                </View>

                <Tab.Navigator
                    screenOptions={{
                        tabBarStyle: HomeStyles.tabBar,
                        tabBarLabelStyle: HomeStyles.tabLabel,
                        tabBarIndicatorStyle: { backgroundColor: '#F9A800' },
                    }}
                >
                    <Tab.Screen name="Score">
                        {() => (
                            <ScoreTab journeys={journeys.filter(j => j.scores?.total !== undefined)} />
                        )}
                    </Tab.Screen>
                    <Tab.Screen name="Journeys">
                        {() => (
                            <JourneysTab journeys={journeys} filter={filter} setFilter={setFilter} />
                        )}
                    </Tab.Screen>
                </Tab.Navigator>

                {/* Modal for insurance discount */}
                <Modal
                    visible={showModal}
                    transparent
                    animationType="slide"
                    onRequestClose={() => setShowModal(false)}
                >
                    <View style={HomeStyles.modalOverlay}>
                        <View style={HomeStyles.modalContent}>
                            <Ionicons name="happy-outline" size={64} color="#008080" style={{ alignSelf: 'center', marginBottom: 20 }} />
                            <Text style={[HomeStyles.modalTitle, { textAlign: 'center' }]}>
                                Congratulations!
                            </Text>
                            <Text style={[HomeStyles.modalText, { textAlign: 'center', marginBottom: 20 }]}>
                                You have now met the requirements to receive a personalised car insurance discount.
                            </Text>
                            <Text style={[HomeStyles.modalText, { textAlign: 'center' }]}>
                                Please call <Text style={{ fontWeight: 'bold' }}>0800 123 4567</Text> with the following reference:
                            </Text>
                            <Text style={[HomeStyles.modalTitle, { textAlign: 'center', marginTop: 10 }]}>
                                {referenceCode}
                            </Text>

                            <TouchableOpacity
                                style={HomeStyles.modalButton}
                                onPress={() => setShowModal(false)}
                            >
                                <Text style={HomeStyles.modalButtonText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        </SafeAreaView>
    );
}
