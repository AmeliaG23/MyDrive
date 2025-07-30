import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { Dimensions, StatusBar as RNStatusBar, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

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
    const navigation = useNavigation();
    const { user } = useContext(UserContext);
    const [journeys, setJourneys] = useState([]);
    const [averageScore, setAverageScore] = useState(0);
    const [filter, setFilter] = useState('2mo');

    useEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);

    useEffect(() => {
        async function fetchJourneys() {
            if (!user?.id) return;
            const history = await getJourneyHistoryAsync(user.id);
            const recent30 = history.filter(j => {
                const daysAgo = (Date.now() - new Date(j.date).getTime()) / (1000 * 3600 * 24);
                return daysAgo <= 30;
            });

            const totalScore = recent30.reduce(
                (sum, j) => sum + (j.score || calculateScore(j)),
                0
            );
            const avgScore = recent30.length ? totalScore / recent30.length : 0;

            setJourneys(history);
            setAverageScore(Math.round(avgScore));
        }
        fetchJourneys();
    }, [user]);

    return (
        <>
            {/* Use native StatusBar from react-native here */}
            <RNStatusBar translucent backgroundColor="transparent" barStyle="light-content" />

            {/* Colored View for the status bar space (fixes black bar on iOS) */}
            <View style={{ height: insets.top, backgroundColor: '#008080' }} />

            <SafeAreaView style={{ flex: 1, backgroundColor: '#008080' }} edges={['bottom', 'left', 'right']}>
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
                            {() => <ScoreTab journeys={journeys.filter(j => j.score !== undefined)} />}
                        </Tab.Screen>
                        <Tab.Screen name="Journeys">
                            {() => <JourneysTab journeys={journeys} filter={filter} setFilter={setFilter} />}
                        </Tab.Screen>
                    </Tab.Navigator>
                </View>
            </SafeAreaView>
        </>
    );
}
