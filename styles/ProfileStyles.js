import { StyleSheet } from 'react-native';

const ProfileStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#008080',
        marginBottom: 30,
        textAlign: 'center',
        marginTop: 50,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 25,
        width: '100%',
        maxWidth: 400,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        position: 'relative',
        alignSelf: 'center',
    },
    label: {
        fontSize: 14,
        color: '#888',
        marginTop: 15,
    },
    value: {
        fontSize: 18,
        color: '#333',
        fontWeight: '500',
    },
    helpButton: {
        position: 'absolute',
        top: 15,
        right: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    helpText: {
        color: '#008080',
        fontWeight: '600',
        marginLeft: 6,
        fontSize: 16,
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
        borderRadius: 10,
        padding: 25,
        width: '100%',
        maxWidth: 350,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#008080',
        marginBottom: 10,
    },
    modalText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 10,
    },
    modalContact: {
        fontSize: 16,
        color: '#444',
        marginBottom: 4,
    },
});

export default ProfileStyles;