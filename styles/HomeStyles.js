/**
 * HomeStyles.js
 * ----------------
 * Created: 29-08-2025
 * Author: Amelia Goldsby
 * Project : A Dual-Focus Redesign of MyDrive: Enhancing Interfaces and Scoring Architecture
 * Course : Major Project, Level 6, QA
 *
 * Purpose:
 *    Stylesheet for the Home Screen
 *
 * (Rani et al., 2021)
 */

import { Dimensions, StyleSheet } from 'react-native';

const screenHeight = Dimensions.get('window').height;
const halfScreenHeight = screenHeight / 2;

const HomeStyles = StyleSheet.create({
    topSection: {
        minHeight: halfScreenHeight,
        backgroundColor: '#008080',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 20,
    },
    welcomeText: {
        fontSize: 20,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 10,
        textAlign: 'center',
    },
    topSectionText: {
        marginTop: 15,
        fontSize: 20,
        fontWeight: '600',
        color: '#fff',
        textAlign: 'center',
    },
    emptyStateText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
    tabBar: {
        backgroundColor: '#fff',
        elevation: 4,
        shadowOpacity: 0.1,
    },
    tabLabel: {
        fontWeight: '600',
        fontSize: 14,
        color: '#444',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 30,
        width: '90%',
        maxWidth: 350,
        alignItems: 'center',
        elevation: 5,
    },
    modalCloseButton: {
        position: 'absolute',
        top: 15,
        right: 15,
    },
    modalIcon: {
        alignSelf: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#008080',
        textAlign: 'center',
        marginVertical: 8,
    },
    modalText: {
        fontSize: 16,
        color: '#333',
        marginVertical: 8,
        textAlign: 'center',
    },
    modalTextBold: {
        fontWeight: 'bold',
    },
    modalButton: {
        marginTop: 20,
        backgroundColor: '#008080',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
    },
    modalButtonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
        textAlign: 'center',
    },
});

export default HomeStyles;
