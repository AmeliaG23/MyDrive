import React, { useState, useContext, useEffect } from 'react';
import { View, Button, Text, StyleSheet, Alert } from 'react-native';
import * as Location from 'expo-location';
import { UserContext } from '../context/UserContext';
import { addJourney } from '../utils';

export default function JourneyScreen({ navigation }) {
    const { user } = useContext(UserContext);

    const [isTracking, setIsTracking] = useState(false);
    const [locations, setLocations] = useState([]);
    const [watcher, setWatcher] = useState(null);

    const [journeyStart, setJourneyStart] = useState(null);

    // Request permissions on mount
    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission denied', 'Location access is required to track journeys.');
            }
        })();
    }, []);

    const startJourney = async () => {
        const startTime = new Date().toISOString();
        setJourneyStart(startTime);

        const watch = await Location.watchPositionAsync(
            {
                accuracy: Location.Accuracy.Highest,
                distanceInterval: 5,
                timeInterval: 1000,
            },
            (location) => {
                setLocations((prev) => [...prev, location]);
            }
        );
        setWatcher(watch);
        setIsTracking(true);
    };

    const stopJourney = async () => {
        if (watcher) {
            await watcher.remove();
            setWatcher(null);
        }

        setIsTracking(false);

        if (!user || locations.length < 2) {
            Alert.alert('Error', 'Not enough data or no user info');
            return;
        }

        const endTime = new Date().toISOString();

        // Calculate total distance
        const distance = locations.reduce((acc, loc, i, arr) => {
            if (i === 0) return 0;
            const prev = arr[i - 1];
            const d = Location.distance(
                { latitude: prev.coords.latitude, longitude: prev.coords.longitude },
                { latitude: loc.coords.latitude, longitude: loc.coords.longitude }
            );
            return acc + d;
        }, 0);

        // Average speed in m/s (optional)
        const timeElapsed = (new Date(endTime) - new Date(journeyStart)) / 1000; // seconds
        const avgSpeed = timeElapsed > 0 ? distance / timeElapsed : 0;

        const journeyData = {
            date: journeyStart,
            distance: distance.toFixed(2),
            speed: avgSpeed.toFixed(2),
            braking: 0, // Placeholder
            acceleration: 0, // Placeholder
            cornering: 0, // Placeholder
            phoneUsage: false, // Placeholder
            phoneCallStatus: false, // Placeholder
            roadType: 'Urban',
            score: 100, // Placeholder
            userId: user.id,
        };

        addJourney(journeyData,
            () => navigation.navigate('Home'),
            (err) => console.error(err)
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Journey Tracking</Text>

            {isTracking ? (
                <Button title="Finish Journey" color="#f44336" onPress={stopJourney} />
            ) : (
                <Button title="Start Journey" color="#008080" onPress={startJourney} />
            )}

            <Text style={styles.infoText}>Points Collected: {locations.length}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    title: { fontSize: 20, textAlign: 'center', marginBottom: 20 },
    infoText: { marginTop: 15, textAlign: 'center', fontSize: 16 },
});
