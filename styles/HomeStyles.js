import { StyleSheet } from 'react-native';

const HomeStyles = StyleSheet.create({
    topSection: {
        backgroundColor: '#008080',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
    },
    chartContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    gauge: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -165 }, { translateY: -30 }],
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    scoreText: {
        fontSize: 48,
        fontWeight: 'bold',
    },
    outOfText: {
        fontSize: 20,
        marginLeft: 2,
        marginBottom: 6,
    },
    topSectionText: {
        marginTop: 15,
        fontSize: 20,
        fontWeight: '600',
        color: '#fff',
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
    welcomeText: {
        fontSize: 20,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 30,
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
    modalTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#008080',
    },
    modalText: {
        fontSize: 16,
        color: '#333',
        marginVertical: 8,
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
