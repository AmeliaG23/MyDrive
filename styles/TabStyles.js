import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const TabStyles = StyleSheet.create({
    container: {
        paddingVertical: 20,
        paddingHorizontal: 16,
        backgroundColor: '#f5f7fa',
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 16,
        color: '#333',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        elevation: 1,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 1 },
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    cardTitle: {
        flex: 1,
        marginLeft: 12,
        fontSize: 18,
        fontWeight: '600',
        color: '#444',
    },
    cardScore: {
        fontSize: 18,
        fontWeight: '700',
    },
    progressBar: {
        height: 10,
        backgroundColor: '#e0e0e0',
        borderRadius: 5,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 5,
    },
    warningText: {
        marginTop: 10,
        color: '#d32f2f',
        fontStyle: 'italic',
        fontSize: 14,
    },
    noDataContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    noDataText: {
        fontSize: 16,
        color: '#666',
    },
    warningBox: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        padding: 10,
        marginTop: 10,
        borderRadius: 8,
        elevation: 3,
    },
    warningText: {
        fontWeight: "600",
        flexShrink: 1,
        marginLeft: 8,
    },
    dropdownButton: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        backgroundColor: '#fff',
    },
    dropdownButtonText: {
        fontSize: 16,
        color: '#444',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: width * 0.8,
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingVertical: 15,
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 5 },
    },
    modalItem: {
        paddingVertical: 12,
        paddingHorizontal: 20,
    },
    modalItemText: {
        fontSize: 16,
        color: '#333',
    },
    modalItemTextActive: {
        color: '#F9A800',
        fontWeight: '700',
    },
    dropdownHeader: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    dropdownButton: {
        backgroundColor: '#eee',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    dropdownButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100,
    },
    emptyText: {
        fontSize: 16,
        color: '#777',
        fontStyle: 'italic',
    },
});

export default TabStyles;
