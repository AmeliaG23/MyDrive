import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useContext, useState } from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';

import { UserContext } from '../context/UserContext';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MainTabStyles from '../styles/MainTabStyles'; // <-- import styles here

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
                <View style={MainTabStyles.modalOverlay}>
                    <View style={MainTabStyles.modalBox}>
                        <Text style={MainTabStyles.modalTitle}>Are you sure you want to log out?</Text>
                        <View style={MainTabStyles.modalButtons}>
                            <TouchableOpacity
                                style={[MainTabStyles.modalButton, { backgroundColor: '#ccc' }]}
                                onPress={() => setLogoutModalVisible(false)}
                            >
                                <Text>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[MainTabStyles.modalButton, { backgroundColor: '#f44336' }]}
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
