import { StyleSheet } from 'react-native';

const OnboardingStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        paddingTop: 60,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 20,
    },
    logo: {
        width: 240,
        height: 120,
        alignSelf: 'center',
    },
    title: {
        paddingBottom: 20,
        fontSize: 28,
        fontWeight: 'bold',
        color: '#008080',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#555',
        marginBottom: 20,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        color: '#333',
        lineHeight: 24,
        marginBottom: 20,
        textAlign: 'center',
    },
    bulletTitle: {
        paddingTop: 10,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#444',
        marginBottom: 10,
    },
    bulletRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    bullet: {
        fontSize: 15,
        color: '#333',
        marginLeft: 10,
        flexShrink: 1,
    },
    note: {
        fontSize: 14,
        color: '#666',
        marginTop: 20,
        fontStyle: 'italic',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 10,
    },
    checkboxLabel: {
        marginLeft: 10,
        fontSize: 14,
        color: '#333',
        flex: 1,
        flexWrap: 'wrap',
    },
    button: {
        backgroundColor: '#F9A800',
        paddingVertical: 12,
        borderRadius: 25,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default OnboardingStyles;
