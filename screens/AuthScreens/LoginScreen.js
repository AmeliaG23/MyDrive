/**
 * LoginScreen.jsx
 * ----------------
 * Created: 01-09-2025
 * Author: Amelia Goldsby
 * Project : A Dual-Focus Redesign of MyDrive: Enhancing Interfaces and Scoring Architecture
 * Course : Major Project, Level 6, QA
 *
 * Purpose:
 *    Allows users to sign in before accessing the Home Screen.
 *    Implements a 3 secon delay before navigation.
 *
 * (Rani et al., 2021)
 */

import React, { useContext, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { UserContext } from '../../context/UserContext';
import AuthStyles from '../../styles/AuthStyles';
import { getAllUsers } from '../../utils';

export default function LoginScreen({ navigation, skipLoginDelay = false }) {
    const { login } = useContext(UserContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        navigation.setOptions({
            headerLeft: null,
            headerShown: false,
        });
    }, [navigation]);

    // Function to handle log in with 3 second delay when successful
    const handleLogin = async () => {
        if (!username || !password) {
            Alert.alert('Error', 'Please enter both username and password.');
            return;
        }

        setLoading(true);
        try {
            const users = await getAllUsers()
            if (!users) {
                Alert.alert('Error', 'Unable to fetch users.');
                setLoading(false);
                return;
            }

            const user = users.find(
                (u) => u.username === username && u.password === password
            );

            if (user) {
                if (skipLoginDelay) { // For testing: skip transition delay
                    login(user);
                    setLoading(false);
                } else {
                    // 3-second delay before logging in to stop onboarding screens flashing
                    setTimeout(() => {
                        login(user);
                        setLoading(false);
                    }, 3000);
                }
            } else {
                Alert.alert('Error', 'Invalid username or password.');
                setLoading(false);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to log in.');
            setLoading(false);
        }
    };

    return (
        <View style={AuthStyles.container}>
            <Image source={require('../../assets/aviva-logo.png')} style={AuthStyles.logo} />
            <View style={AuthStyles.formContainer}>
                <TextInput
                    style={AuthStyles.input}
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                    editable={!loading}
                />
                <TextInput
                    style={AuthStyles.input}
                    placeholder="Password"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    editable={!loading}
                />
                <TouchableOpacity
                    style={[AuthStyles.button, loading && { opacity: 0.6 }]}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    <Text style={AuthStyles.buttonText}>Login</Text>
                </TouchableOpacity>
                <Text
                    style={[AuthStyles.secondButtonText, { marginTop: 20 }]}
                    onPress={() => navigation.navigate('Signup')}
                >
                    Don't have an account? Sign Up
                </Text>
            </View>
            {/* Spinner shown when loading is true */}
            {loading && (
                <View style={AuthStyles.overlay}>
                    <ActivityIndicator size="large" color="#fff" />
                    <Text style={AuthStyles.loadingText}>Logging you in…</Text>
                </View>
            )}
        </View>
    );
}
