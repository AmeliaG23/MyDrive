import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import AuthStyles from '../../styles/AuthStyles';
import { addUserAsync } from '../../utils';

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
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dob, setDob] = useState(new Date());
    const [formattedDob, setFormattedDob] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(getPasswordStrength(''));

    const handleSignUp = async () => {
        if (!firstName || !lastName || !formattedDob || !username || !password || !confirmPassword) {
            Alert.alert('Error', 'Please fill out all fields.');
            return;
        }

        // Age check
        const today = new Date();
        const birthDate = new Date(dob);
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const dayDiff = today.getDate() - birthDate.getDate();

        const isAtLeast17 =
            age > 17 || (age === 17 && (monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0)));

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
                dob: formattedDob,
            });

            if (!success) {
                Alert.alert('Error', 'Username already exists. Please choose another.');
                return;
            }

            Alert.alert('Success', 'Account created!');
            navigation.navigate('Login');
        } catch (error) {
            console.error('Error signing up', error);
            Alert.alert('Error', 'Failed to create account.');
        }
    };



    const onChangeDate = (event, selectedDate) => {
        setShowDatePicker(false);
        if (event.type === 'set' && selectedDate) {
            const currentDate = selectedDate || dob;
            setDob(currentDate);
            const formattedDate = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`;
            setFormattedDob(formattedDate);
        }
    };

    return (
        <View style={[AuthStyles.container]}>
            <Image source={require('../../assets/aviva-logo.png')} style={AuthStyles.logo} />
            <View style={[AuthStyles.formContainer, { backgroundColor: '#fff', borderRadius: 10, padding: 20 }]}>
                <TextInput
                    style={AuthStyles.input}
                    placeholder="First Name"
                    value={firstName}
                    onChangeText={setFirstName}
                />
                <TextInput
                    style={AuthStyles.input}
                    placeholder="Last Name"
                    value={lastName}
                    onChangeText={setLastName}
                />
                <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                    <TextInput
                        testID="dob-input"
                        style={AuthStyles.input}
                        placeholder="Date of Birth (MM/DD/YYYY)"
                        value={formattedDob}
                        editable={false}
                        pointerEvents="none"
                    />
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                        testID="dob-picker"
                        value={dob}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={onChangeDate}
                        maximumDate={new Date()}
                    />
                )}
                <TextInput
                    style={AuthStyles.input}
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                />
                <TextInput
                    style={AuthStyles.input}
                    placeholder="Password"
                    secureTextEntry
                    value={password}
                    onChangeText={(text) => {
                        setPassword(text);
                        setPasswordStrength(getPasswordStrength(text));
                    }}
                />
                {/* Password Strength Meter */}
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

                <TextInput
                    style={AuthStyles.input}
                    placeholder="Confirm Password"
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                />
                <TouchableOpacity
                    style={AuthStyles.button}
                    onPress={handleSignUp}
                >
                    <Text style={AuthStyles.buttonText}>Sign Up</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 10,
                    }}
                >
                    <Ionicons name="arrow-back" size={24} color="#008080" />
                    <Text style={AuthStyles.secondButtonText}>Back</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
