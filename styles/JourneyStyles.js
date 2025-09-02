/**
 * JourneyStyles.js
 * ----------------
 * Created: 29-08-2025
 * Author: Amelia Goldsby
 * Project : A Dual-Focus Redesign of MyDrive: Enhancing Interfaces and Scoring Architecture
 * Course : Major Project, Level 6, QA
 *
 * Purpose:
 *    Stylesheet for the Journey Screen
 *
 * (Rani et al., 2021)
 */

import { StyleSheet } from 'react-native';

const JourneyStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    header: {
        alignItems: 'flex-start',
        backgroundColor: '#008080',
    },
    backButton: {
        padding: 8,
        color: 'white'
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        marginTop: 10,
        marginBottom: 20,
        color: 'white',
    },
    card: {
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
        padding: 16,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3
    },
    cardHeader: {
        flexDirection: 'row',
        marginBottom: 6,
    },
    cardHeaderText: {
        fontWeight: '600',
        fontSize: 16,
        marginLeft: 8,
        color: '#008080',
    },
    distanceText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#444',
    },
    scoreTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginTop: 15,
        color: '#222',
        marginBottom: 6,
    },
    breakdownContainer: {
        marginVertical: 8,
    },
    breakdownRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    breakdownLabel: {
        flex: 1,
        fontSize: 14,
        color: '#444',
        textTransform: 'capitalize',
    },
    progressFill: {
        height: '100%',
        borderRadius: 6,
    },
    breakdownValue: {
        width: 60,             // bigger width to fit 100%
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        textAlign: 'right',
        flexShrink: 0,
        flexGrow: 0,
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 24,
        width: '100%',
        maxWidth: 360,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 16,
        color: '#222',
        textAlign: 'center',
    },
    modalButtons: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    inlineButton: {
        backgroundColor: '#f0f0f0',
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 8,
        marginHorizontal: 10,
    },
    inlineButtonActive: {
        backgroundColor: '#007AFF',
    },
    inlineButtonText: {
        color: '#333',
        fontWeight: '600',
    },
    modalConfirm: {
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 8,
        marginBottom: 12,
        width: '100%',
    },
    modalConfirmText: {
        color: '#fff',
        fontWeight: '700',
        textAlign: 'center',
        fontSize: 16,
    },
    cancelButton: {
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        width: '100%',
    },
    cancelButtonText: {
        textAlign: 'center',
        fontWeight: '700',
        color: '#444',
        fontSize: 16,
    },
    errorText: {
        fontSize: 18,
        fontWeight: '600',
        color: 'red',
        textAlign: 'center',
        marginTop: 40,
    },
    passengerButton: {
        marginTop: 20,
    },
    passengerText: {
        color: '#007AFF',
        fontWeight: '600',
        fontSize: 16,
        alignSelf: 'flex-end',
    },
    shortProgressBar: {
        height: 10,
        width: 140, // Reduced width to give more space to labels
        backgroundColor: '#E0E0E0',
        borderRadius: 5,
        overflow: 'hidden',
        marginHorizontal: 10,
    },
    screenWrapper: {
        flex: 1,
        backgroundColor: '#fff',
    },
    topSection: {
        backgroundColor: '#008080',
        paddingHorizontal: 20,
        paddingBottom: 30,
        alignItems: 'center',
    },
    bottomSection: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingTop: 5,
    },
    // New styles for smaller, left-aligned "Were you a passenger?"
    passengerButtonLeft: {
        marginTop: 5,
        alignSelf: 'flex-end',
    },
    passengerTextSmall: {
        color: '#007AFF',
        fontWeight: '600',
        fontSize: 14,
        alignSelf: 'flex-end',
    },
});

export default JourneyStyles;
