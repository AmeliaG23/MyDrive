import { Ionicons } from '@expo/vector-icons';
import React, { useContext, useEffect, useState } from 'react';
import {
    ActivityIndicator,
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
                    <ActivityIndicator size="large" color="#008080" testID="loading-indicator" />
                )}
            </View>

            <HelpModal visible={showModal} onClose={() => setShowModal(false)} />
        </View>
    );
}

function HelpModal({ visible, onClose }) {
    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} testID="helpModal">
            <TouchableOpacity
                style={ProfileStyles.modalOverlay}
                onPress={onClose}
                activeOpacity={1}
                testID="modal-overlay"
            >
                <View style={ProfileStyles.modalContent} testID="modal-content">
                    <Text style={ProfileStyles.modalTitle} testID="modal-title">Need Help?</Text>
                    <Text style={ProfileStyles.modalText} testID="modal-text">
                        If any of your details are incorrect, please contact our support team:
                    </Text>
                    <Text style={ProfileStyles.modalContact} testID="modal-email">Email: support@example.com</Text>
                    <Text style={ProfileStyles.modalContact} testID="modal-phone">Phone: 0800 123 4567</Text>
                </View>
            </TouchableOpacity>
        </Modal>
    );
}
