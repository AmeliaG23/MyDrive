/**
 * ProfileScreen.jsx
 * ----------------
 * Created: 01-09-2025
 * Author: Amelia Goldsby
 * Project : A Dual-Focus Redesign of MyDrive: Enhancing Interfaces and Scoring Architecture
 * Course : Major Project, Level 6, QA
 *
 * Purpose:
 *    Displays user details (first name, last name, DOB, username).
 *    Allows the user to open an info modal and what to do if their details are incorrect.
 * 
 * (Rani et al., 2021)
 */

import { Ionicons } from '@expo/vector-icons';
import React, { useContext, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Linking,
    Modal,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { UserContext } from '../context/UserContext';
import ProfileStyles from '../styles/ProfileStyles';
import { formatDate, getUserById } from '../utils';

export default function ProfileScreen() {
    const { user } = useContext(UserContext);
    const [userDetails, setUserDetails] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Fetching user details
    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                if (user?.id) {
                    const userData = await getUserById(user.id);
                    setUserDetails(userData);
                }
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        };
        fetchUserDetails();
    }, [user]);

    return (
        <View style={ProfileStyles.container} testID="profile-screen">
            <Text style={ProfileStyles.title} testID="profile-title">Profile</Text>
            <View style={ProfileStyles.card} testID="profile-card">
                <TouchableOpacity
                    style={ProfileStyles.helpButton}
                    onPress={() => setShowModal(true)}
                    testID="help-button"
                >
                    <Ionicons name="information-circle-outline" size={22} color="#008080" />
                </TouchableOpacity>
                {/* Only shows user details if they are found */}
                {userDetails ? (
                    <>
                        <Text style={ProfileStyles.label} testID="label-first-name">First Name</Text>
                        <Text style={ProfileStyles.value} testID="value-first-name">{userDetails.firstName}</Text>
                        <Text style={ProfileStyles.label} testID="label-last-name">Last Name</Text>
                        <Text style={ProfileStyles.value} testID="value-last-name">{userDetails.lastName}</Text>
                        <Text style={ProfileStyles.label} testID="label-dob">Date of Birth</Text>
                        <Text style={ProfileStyles.value} testID="value-dob">{formatDate(userDetails.dob)}</Text>
                        <Text style={ProfileStyles.label} testID="label-username">Username</Text>
                        <Text style={ProfileStyles.value} testID="value-username">{userDetails.username}</Text>
                    </>
                ) : (
                    // Spinner if loading/details not found
                    <ActivityIndicator size="large" color="#008080" testID="loading-indicator" />
                )}
            </View>
            <HelpModal visible={showModal} onClose={() => setShowModal(false)} />
        </View>
    );
}

// Function for modal to give user information on who to contact if their personal details are incorrect
function HelpModal({ visible, onClose }) {
    // Handles email and phone number press
    const handleEmailPress = () => {
        Linking.openURL('mailto:support@example.com');
    };
    const handlePhonePress = () => {
        Linking.openURL('tel:08001234567');
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
            testID="helpModal"
        >
            <TouchableOpacity
                style={ProfileStyles.modalOverlay}
                onPress={onClose}
                activeOpacity={1}
                testID="modal-overlay"
            >
                <TouchableOpacity
                    activeOpacity={1}
                    style={ProfileStyles.modalContent}
                    onPress={() => { }}
                    testID="modal-content"
                >
                    <TouchableOpacity
                        onPress={onClose}
                        style={ProfileStyles.modalCloseButton}
                        testID="modal-close-button"
                    >
                        <Ionicons name="close" style={ProfileStyles.modalCloseIcon} />
                    </TouchableOpacity>
                    <Text style={ProfileStyles.modalTitle} testID="modal-title">Need Help?</Text>
                    <Text style={ProfileStyles.modalText} testID="modal-text">
                        If any of your details are incorrect, please contact our support team:
                    </Text>
                    <TouchableOpacity
                        onPress={handleEmailPress}
                        style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8 }}
                        testID="modal-email"
                    >
                        <Ionicons name="mail-outline" size={20} color="#007AFF" />
                        <Text style={[ProfileStyles.modalContact, { marginLeft: 8, color: '#007AFF' }]}>
                            support@example.com
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handlePhonePress}
                        style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8 }}
                        testID="modal-phone"
                    >
                        <Ionicons name="call-outline" size={20} color="#007AFF" />
                        <Text style={[ProfileStyles.modalContact, { marginLeft: 8, color: '#007AFF' }]}>
                            0800 123 4567
                        </Text>
                    </TouchableOpacity>
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
}
