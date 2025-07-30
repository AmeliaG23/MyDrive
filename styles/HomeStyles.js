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

});

export default HomeStyles;
