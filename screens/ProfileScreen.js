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
                    {/* Close Button */}
                    <TouchableOpacity
                        onPress={onClose}
                        style={{ position: 'absolute', top: 12, right: 12, padding: 8 }}
                        testID="modal-close-button"
                    >
                        <Ionicons name="close" size={24} color="#333" />
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
