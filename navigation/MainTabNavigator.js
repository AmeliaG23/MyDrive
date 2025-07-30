import React, { useState, useContext } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import JourneyScreen from '../screens/JourneyScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { UserContext } from '../context/UserContext';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
    const [logoutModalVisible, setLogoutModalVisible] = useState(false);
    const { logout } = useContext(UserContext);

    const handleLogout = () => {
        setLogoutModalVisible(false);
        logout(); // ✅ triggers switch to Login in RootNavigator
    };

    return (
        <>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ color, size }) => {
                        let iconName;
                        switch (route.name) {
                            case 'Home':
                                iconName = 'home-outline';
                                break;
                            case 'Journey':
                                iconName = 'car-outline';
                                break;
                            case 'Profile':
                                iconName = 'person-outline';
                                break;
                            case 'Logout':
                                iconName = 'log-out-outline';
                                break;
                            default:
                                iconName = 'ellipse-outline';
                        }
                        return <Ionicons name={iconName} size={size} color={color} />;
                    },
                    tabBarActiveTintColor: '#008080',
                    tabBarInactiveTintColor: 'gray',
                    headerShown: false,
                })}
            >
                <Tab.Screen name="Home" component={HomeScreen} />
                <Tab.Screen name="Journey" component={JourneyScreen} />
                <Tab.Screen name="Profile" component={ProfileScreen} />
                <Tab.Screen
                    name="Logout"
                    component={HomeScreen} // Dummy to satisfy navigator
                    listeners={{
                        tabPress: (e) => {
                            e.preventDefault(); // ⛔ prevent navigation
                            setLogoutModalVisible(true); // ✅ show confirmation
                        },
                    }}
                />
            </Tab.Navigator>

            {/* 🔽 Logout Confirmation Modal */}
            <Modal
                transparent
                visible={logoutModalVisible}
                animationType="fade"
                onRequestClose={() => setLogoutModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>Are you sure you want to log out?</Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: '#ccc' }]}
                                onPress={() => setLogoutModalVisible(false)}
                            >
                                <Text>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: '#f44336' }]}
                                onPress={handleLogout}
                            >
                                <Text style={{ color: '#fff' }}>Log Out</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBox: {
        width: 300,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        marginBottom: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 6,
    },
});
