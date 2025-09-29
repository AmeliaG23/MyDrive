/**
 * HomeScreen.jsx
 * ----------------
 * Created: 01-08-2025
 * Author: Amelia Goldsby
 * Purpose:
 *    Main dashboard for users when logged in.
 *    Displays Doughnut chart with average 30 day score or empty state if no scores.
 *    Displays discount message when user has driven 400 miles in the last 60 days.
 */

import { Ionicons } from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React, { useContext, useEffect, useState } from "react";
import {
    Dimensions,
    Linking,
    Modal,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import DoughnutChart from "../components/charts/DoughnutChart";
import JourneysTab from "../components/tabs/JourneysTab";
import ScoreTab from "../components/tabs/ScoreTab";
import { UserContext } from "../context/UserContext";
import HomeStyles from "../styles/HomeStyles";
import { calculateScore, checkDiscountEligibility, getJourneyHistoryAsync, scoreEligible } from "../utils";

const Tab = createMaterialTopTabNavigator();
const screenHeight = Dimensions.get("window").height;
const halfScreenHeight = screenHeight / 2;

const MIN_MILES_60_DAYS = 400;
const DAYS_THRESHOLD = 60;

export default function HomeScreen() {
    const { user } = useContext(UserContext);
    const [journeys, setJourneys] = useState([]);
    const [averageScore, setAverageScore] = useState(0);
    const [filter, setFilter] = useState("2mo");
    const [showDiscountMessage, setShowDiscountMessage] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [referenceCode, setReferenceCode] = useState(null);
    const [eligibleForDisplay, setEligibleForDisplay] = useState(false);

    useEffect(() => {
        async function fetchJourneys() {
            if (!user?.id) return;

            const history = await getJourneyHistoryAsync(user.id);
            setJourneys(history);

            const eligible = scoreEligible(history, MIN_MILES_60_DAYS, DAYS_THRESHOLD);
            setEligibleForDisplay(eligible);

            // Compute average 30-day score only if eligible
            if (eligible) {
                const recent30 = history.filter(
                    j => (Date.now() - new Date(j.date).getTime()) / (1000 * 3600 * 24) <= 30
                );
                const totalScore = recent30.reduce((sum, j) => {
                    let score = j.scores?.total;
                    if (score === undefined) {
                        try { score = calculateScore(j)?.total || 0; } catch { score = 0; }
                    }
                    return sum + score;
                }, 0);
                setAverageScore(recent30.length ? Math.round(totalScore / recent30.length) : 0);
            } else {
                setAverageScore(0);
            }

            // Discount eligibility check
            const { eligible: discountEligible, referenceCode } = checkDiscountEligibility(history);
            setReferenceCode(discountEligible ? referenceCode : null);

            if (discountEligible) {
                // Delay showing modal by 2 seconds
                setTimeout(() => {
                    setShowModal(true);
                }, 3000);
            }
        }

        fetchJourneys();
    }, [user]);

    const handleCallPress = () => Linking.openURL("tel:08001234567");

    return (
        <SafeAreaView style={{ flex: 1 }} edges={["bottom", "left", "right"]}>
            <View style={{ flex: 1 }}>
                {/* Top Section */}
                <View
                    style={[
                        HomeStyles.topSection,
                        {
                            minHeight: halfScreenHeight,
                            backgroundColor: "#008080",
                            justifyContent: "center",
                            alignItems: "center",
                            paddingHorizontal: 16,
                        },
                    ]}
                >
                    {user?.firstName && (
                        <Text
                            style={[
                                HomeStyles.welcomeText,
                                { color: "#fff", marginBottom: 10, textAlign: "center" },
                            ]}
                        >
                            Welcome back to MyDrive, {user.firstName}
                        </Text>
                    )}
                    {eligibleForDisplay && averageScore > 0 ? (
                        <>
                            <DoughnutChart score={averageScore} />
                            <Text
                                style={[
                                    HomeStyles.topSectionText,
                                    { color: "#fff", marginTop: 8 },
                                ]}
                            >
                                30-Day Average
                            </Text>
                        </>
                    ) : (
                        <Text style={{ color: "#fff", fontSize: 16, textAlign: "center" }}>
                            No scores available yet – drive at least 400 miles over the last 60 days.
                        </Text>
                    )}
                </View>
                {/* Tabs */}
                <Tab.Navigator
                    screenOptions={{
                        tabBarStyle: HomeStyles.tabBar,
                        tabBarLabelStyle: HomeStyles.tabLabel,
                        tabBarIndicatorStyle: { backgroundColor: "#F9A800" },
                    }}
                >
                    <Tab.Screen name="Score">
                        {() => <ScoreTab journeys={eligibleForDisplay ? journeys : []} />}
                    </Tab.Screen>
                    <Tab.Screen name="Journeys">
                        {() => eligibleForDisplay ? (
                            <JourneysTab journeys={journeys} filter={filter} setFilter={setFilter} />
                        ) : (
                            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                                <Text style={{ fontSize: 16, color: "#444" }}>
                                    No journeys recorded yet – drive at least 400 miles over the last 60 days.
                                </Text>
                            </View>
                        )}
                    </Tab.Screen>
                </Tab.Navigator>
                {/* Discount Modal */}
                <Modal
                    visible={showModal}
                    transparent
                    animationType="slide"
                    onRequestClose={() => setShowModal(false)}
                >
                    <View style={HomeStyles.modalOverlay}>
                        <View style={HomeStyles.modalContent}>
                            <TouchableOpacity
                                accessibilityLabel="Close modal"
                                onPress={() => setShowModal(false)}
                                style={HomeStyles.modalCloseButton}
                            >
                                <Ionicons name="close-circle" size={28} color="#008080" />
                            </TouchableOpacity>
                            <Ionicons
                                name="happy-outline"
                                size={64}
                                color="#008080"
                                style={HomeStyles.modalIcon}
                            />
                            <Text style={HomeStyles.modalTitle}>Congratulations!</Text>
                            <Text style={HomeStyles.modalText}>
                                You have now met the requirements to receive a personalised car
                                insurance discount.
                            </Text>
                            <Text style={HomeStyles.modalText}>
                                Please call{" "}
                                <Text
                                    style={{ fontWeight: "bold", color: "#008080" }}
                                    onPress={handleCallPress}
                                >
                                    0800 123 4567
                                </Text>{" "}
                                with the following reference:
                            </Text>
                            <Text
                                style={[HomeStyles.modalTitle, { textAlign: "center", marginTop: 10 }]}
                            >
                                {referenceCode}
                            </Text>
                        </View>
                    </View>
                </Modal>
            </View>
        </SafeAreaView>
    );
}
