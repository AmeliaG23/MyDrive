/**
 * AuthStyles.js
 * ----------------
 * Created: 29-08-2025
 * Author: Amelia Goldsby
 * Project : A Dual-Focus Redesign of MyDrive: Enhancing Interfaces and Scoring Architecture
 * Course : Major Project, Level 6, QA
 *
 * Purpose:
 *    Stylesheet for auth screens:
 *      - screens/AuthScreens/LoginScreen.js
 *      - screens/AuthScreens/SignUpScreen.js
 *
 * (Rani et al., 2021)
 */

import { StyleSheet } from 'react-native';

const yellow = '#F9A800';
const teal = '#008080';
const lightGray = '#f5f5f5';

const AuthStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    logo: {
        marginBottom: 5,
    },
    formContainer: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    input: {
        height: 45,
        borderColor: teal,
        borderWidth: 1,
        marginBottom: 12,
        paddingLeft: 12,
        borderRadius: 8,
        backgroundColor: lightGray,
    },
    secondButtonText: {
        textAlign: 'center',
        color: teal,
        fontWeight: '500',
    },
    button: {
        borderWidth: 2,
        borderColor: yellow,
        backgroundColor: 'transparent',
        borderRadius: 25,
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: yellow,
        fontSize: 16,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
    }
});

export default AuthStyles;
