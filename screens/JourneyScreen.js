import { deleteJourneyAsync } from '@/utils';
import { CommonActions } from '@react-navigation/native';
import React, { useContext, useState } from 'react';
import {
    Alert,
    Modal,
    Pressable,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DoughnutChart from '../components/charts/DoughnutChart';
import { UserContext } from '../context/UserContext';
import JourneyStyles from '../styles/JourneyStyles';

function getScoreColor(score) {
    if (score >= 80) return '#4CAF50';
    if (score >= 60) return '#F9A800';
    return '#F44336';
}

function formatLabel(key) {
    return key
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/^./, (str) => str.toUpperCase());
}

function ScoreBreakdown({ scores }) {
    if (!scores) return null;

    return (
        <View style={JourneyStyles.breakdownContainer}>
            {Object.entries(scores).map(([key, value]) => {
                if (key === 'total') return null;

                return (
                    <View key={key} style={JourneyStyles.breakdownRow}>
                        <Text style={JourneyStyles.breakdownLabel}>{formatLabel(key)}</Text>
                        <View style={JourneyStyles.shortProgressBar}>
                            <View
                                style={[
                                    JourneyStyles.progressFill,
                                    {
                                        width: `${value}%`,
                                        backgroundColor: getScoreColor(value),
                                    },
                                ]}
                            />
                        </View>
                        <Text style={JourneyStyles.breakdownValue}>{value}%</Text>
                    </View>
                );
            })}
        </View>
    );
}

export default function JourneyScreen({ route, navigation }) {
    const { journey } = route.params || {};
    const { user } = useContext(UserContext);

    const [passengerModalVisible, setPassengerModalVisible] = useState(false);
    const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
    const [wasPassenger, setWasPassenger] = useState(null);

    if (!journey) {
        return (
            <View style={JourneyStyles.container}>
                <Text style={JourneyStyles.errorText}>No journey data available</Text>
            </View>
        );
    }

    const handlePassengerPress = () => {
        setWasPassenger(null);
        setConfirmDeleteVisible(false);
        setPassengerModalVisible(true);
    };

    const handleConfirmPassenger = () => {
        if (wasPassenger === true) {
            setConfirmDeleteVisible(true);
        } else if (wasPassenger === false) {
            setPassengerModalVisible(false);
        } else {
            Alert.alert('Please select an option');
        }
    };

    const handleDeleteJourney = async () => {
        try {
            await deleteJourneyAsync(user.id, journey.id);
            setConfirmDeleteVisible(false);
            setPassengerModalVisible(false);
            Alert.alert('Journey deleted', 'This journey has been removed.');

            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'MainTabs' }],
                })
            );
        } catch (err) {
            Alert.alert('Error', 'Failed to delete journey.');
        }
    };

    return (
        <View style={JourneyStyles.screenWrapper}>
            {/* Header */}
            <View style={JourneyStyles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={JourneyStyles.backButton}>
                    <MaterialCommunityIcons name="arrow-left" size={28} color="white" />
                </TouchableOpacity>
            </View>

            {/* Top Section */}
            <View style={JourneyStyles.topSection}>
                <Text style={JourneyStyles.title}>
                    Journey on {new Date(journey.date).toLocaleDateString()}
                </Text>

                <DoughnutChart score={journey.scores?.total ?? 0} />

                {/* Distance and Time cards side by side */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
                    {/* Distance card */}
                    <View style={[JourneyStyles.card, { flex: 1, marginRight: 8 }]}>
                        <View style={JourneyStyles.cardHeader}>
                            <MaterialCommunityIcons name="map-marker-distance" size={24} color="#008080" />
                            <Text style={JourneyStyles.cardHeaderText}>Distance</Text>
                        </View>
                        <Text style={JourneyStyles.distanceText}>
                            {journey.distance ? `${journey.distance} miles` : 'N/A'}
                        </Text>
                    </View>

                    {/* Time of Journey card */}
                    <View style={[JourneyStyles.card, { flex: 1, marginLeft: 8 }]}>
                        <View style={JourneyStyles.cardHeader}>
                            <MaterialCommunityIcons name="clock-outline" size={24} color="#008080" />
                            <Text style={JourneyStyles.cardHeaderText}>Length of Journey</Text>
                        </View>
                        <Text style={JourneyStyles.distanceText}>
                            {journey.length ? `${journey.length} minutes` : 'N/A'}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Bottom Section */}
            <View style={JourneyStyles.bottomSection}>
                <TouchableOpacity
                    onPress={handlePassengerPress}
                    style={JourneyStyles.passengerButtonLeft}
                >
                    <Text style={JourneyStyles.passengerTextSmall}>Were you a passenger?</Text>
                </TouchableOpacity>

                <Text style={JourneyStyles.scoreTitle}>Score Breakdown</Text>

                <ScrollView
                    style={{ maxHeight: 200 }}
                    contentContainerStyle={{ paddingVertical: 8 }}
                    showsVerticalScrollIndicator={true}
                >
                    <ScoreBreakdown scores={journey.scores} />
                </ScrollView>
            </View>

            {/* Modal */}
            <Modal
                visible={passengerModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => {
                    setPassengerModalVisible(false);
                    setConfirmDeleteVisible(false);
                }}
            >
                <View style={JourneyStyles.modalOverlay}>
                    <View style={JourneyStyles.modalContent}>
                        {!confirmDeleteVisible ? (
                            <>
                                <Text style={JourneyStyles.modalTitle}>Were you a passenger on this journey?</Text>
                                <View style={JourneyStyles.modalButtons}>
                                    <TouchableOpacity
                                        style={[
                                            JourneyStyles.inlineButton,
                                            wasPassenger === true && JourneyStyles.inlineButtonActive,
                                        ]}
                                        onPress={() => setWasPassenger(true)}
                                    >
                                        <Text style={JourneyStyles.inlineButtonText}>Yes</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[
                                            JourneyStyles.inlineButton,
                                            wasPassenger === false && JourneyStyles.inlineButtonActive,
                                        ]}
                                        onPress={() => setWasPassenger(false)}
                                    >
                                        <Text style={JourneyStyles.inlineButtonText}>No</Text>
                                    </TouchableOpacity>
                                </View>
                                <Pressable style={JourneyStyles.modalConfirm} onPress={handleConfirmPassenger}>
                                    <Text style={JourneyStyles.modalConfirmText}>Confirm</Text>
                                </Pressable>
                                <Pressable
                                    style={JourneyStyles.cancelButton}
                                    onPress={() => setPassengerModalVisible(false)}
                                >
                                    <Text style={JourneyStyles.cancelButtonText}>Cancel</Text>
                                </Pressable>
                            </>
                        ) : (
                            <>
                                <Text style={JourneyStyles.modalTitle}>Are you sure you want to delete this journey?</Text>
                                <Pressable style={JourneyStyles.modalConfirm} onPress={handleDeleteJourney}>
                                    <Text style={JourneyStyles.modalConfirmText}>Delete Journey</Text>
                                </Pressable>
                                <Pressable
                                    style={JourneyStyles.cancelButton}
                                    onPress={() => setConfirmDeleteVisible(false)}
                                >
                                    <Text style={JourneyStyles.cancelButtonText}>Cancel</Text>
                                </Pressable>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
}
