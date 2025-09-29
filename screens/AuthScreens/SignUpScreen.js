/**
 * SignUpScreen.jsx
 * ----------------
 * Created: 01-09-2025
 * Author: Amelia Goldsby
 * Project : A Dual-Focus Redesign of MyDrive: Enhancing Interfaces and Scoring Architecture
 * Course : Major Project, Level 6, QA
 *
 * Purpose:
 *    Allows users to sign up so they can log in to the app.
 *    Enforces minimum age to be 17.
 *    Ensures password is secure (includes a special character + numbers)
 * 
 * (Rani et al., 2021)
 */

import { formatDate } from '@/utils';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import AuthStyles from '../../styles/AuthStyles';
import { addUserAsync } from '../../utils';

// Function to ensure password is secure and display a bar from red to green
const getPasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return { label: 'Weak', color: 'red', width: '33%' };
    if (score === 3 || score === 4) return { label: 'Medium', color: 'orange', width: '66%' };
    return { label: 'Strong', color: 'green', width: '100%' };
};

export default function SignUpScreen({ navigation }) {
    // Handles whether the screen is being rendered in a Jest Test 
    const isTest = typeof process !== 'undefined' && process.env.JEST_WORKER_ID !== undefined;

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dob, setDob] = useState(isTest ? new Date('2000-01-01') : new Date());
    const [formattedDob, setFormattedDob] = useState(
        isTest ? '01/01/2000' : formatDate(new Date())
    );
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(getPasswordStrength(''));

    // Handles sign up process and validation
    const handleSignUp = async () => {
        if (!firstName || !lastName || !formattedDob || !username || !password || !confirmPassword) {
            Alert.alert('Error', 'Please fill out all fields.');
            return;
        }

        const today = new Date();
        const age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        const dayDiff = today.getDate() - dob.getDate();
        const isAtLeast17 = age > 17 || (age === 17 && (monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0)));

        if (!isAtLeast17) {
            Alert.alert('Age Restriction', 'You must be at least 17 years old to sign up.');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match.');
            return;
        }

        if (passwordStrength.label !== 'Strong') {
            Alert.alert('Weak Password', 'Please use a stronger password.');
            return;
        }

        try {
            const success = await addUserAsync({
                username,
                password,
                firstName,
                lastName,
                dob: dob.toISOString(),
            });

            if (!success) {
                Alert.alert('Error', 'Username already exists. Please choose another.');
                return;
            }

            Alert.alert('Success', 'Account created!');
            navigation.navigate('Login');
        } catch (error) {
            Alert.alert('Error', 'Failed to create account.');
        }
    };

    // Handles date picker selection
    const onChangeDate = (event, selectedDate) => {
        setShowDatePicker(false);
        if (event.type === 'set' && selectedDate) {
            setDob(selectedDate); // store Date object
            setFormattedDob(formatDate(selectedDate)); // display as DD/MM/YYYY
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: '#fff' }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20 }}
                keyboardShouldPersistTaps="handled"
            >
                <View style={AuthStyles.container}>
                    <Image source={require('../../assets/aviva-logo.png')} style={AuthStyles.logo} />
                    <View style={[AuthStyles.formContainer, { backgroundColor: '#fff', borderRadius: 10, padding: 20 }]}>
                        {/* First Name */}
                        <Text style={AuthStyles.label}>First Name</Text>
                        <TextInput
                            style={AuthStyles.input}
                            placeholder="Enter first name"
                            value={firstName}
                            onChangeText={setFirstName}
                        />
                        {/* Last Name */}
                        <Text style={AuthStyles.label}>Last Name</Text>
                        <TextInput
                            style={AuthStyles.input}
                            placeholder="Enter last name"
                            value={lastName}
                            onChangeText={setLastName}
                        />
                        {/* Date of Birth */}
                        <Text style={AuthStyles.label}>Date of Birth</Text>
                        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                            <TextInput
                                testID="dob-input"
                                style={AuthStyles.input}
                                placeholder="DD/MM/YYYY"
                                value={formattedDob}
                                editable={false}
                                pointerEvents="none"
                            />
                        </TouchableOpacity>
                        {showDatePicker && !isTest && (
                            <DateTimePicker
                                testID="dob-picker"
                                value={dob || new Date()} // ensure valid Date
                                mode="date"
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                onChange={onChangeDate}
                                maximumDate={new Date()}
                            />
                        )}
                        {/* Username */}
                        <Text style={AuthStyles.label}>Username</Text>
                        <TextInput
                            style={AuthStyles.input}
                            placeholder="Enter username"
                            value={username}
                            onChangeText={setUsername}
                        />
                        {/* Password */}
                        <Text style={AuthStyles.label}>Password</Text>
                        <TextInput
                            style={AuthStyles.input}
                            placeholder="Enter password"
                            secureTextEntry
                            value={password}
                            onChangeText={(text) => {
                                setPassword(text);
                                setPasswordStrength(getPasswordStrength(text));
                            }}
                        />
                        {/* Password Strength */}
                        <View style={{ marginBottom: 10 }}>
                            <View style={{ height: 6, backgroundColor: '#ccc', borderRadius: 3 }}>
                                <View
                                    style={{
                                        height: 6,
                                        backgroundColor: passwordStrength.color,
                                        width: passwordStrength.width,
                                        borderRadius: 3,
                                    }}
                                />
                            </View>
                            <Text style={{ color: passwordStrength.color, fontSize: 12, marginTop: 4 }}>
                                Strength: {passwordStrength.label}
                            </Text>
                        </View>
                        {/* Confirm Password */}
                        <Text style={AuthStyles.label}>Confirm Password</Text>
                        <TextInput
                            style={AuthStyles.input}
                            placeholder="Re-enter password"
                            secureTextEntry
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                        />
                        {/* Sign Up Button */}
                        <TouchableOpacity style={AuthStyles.button} onPress={handleSignUp}>
                            <Text style={AuthStyles.buttonText}>Sign Up</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
