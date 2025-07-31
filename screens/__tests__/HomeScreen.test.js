// Polyfill clearImmediate to fix React Native StatusBar error in Jest
if (typeof setImmediate === 'undefined') {
    global.setImmediate = (fn, ...args) => setTimeout(fn, 0, ...args);
}
if (typeof clearImmediate === 'undefined') {
    global.clearImmediate = jest.fn();
}

import { render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { UserContext } from '../../context/UserContext';
import * as utils from '../../utils';
import HomeScreen from '../HomeScreen';

// Use the mock from __mocks__ automatically
jest.mock('@react-navigation/native');
// Import the mock functions so we can assert on calls

jest.mock('react-native-safe-area-context', () => ({
    useSafeAreaInsets: () => ({ top: 20 }),
    SafeAreaView: ({ children }) => children,
}));

jest.mock('../../components/charts/DoughnutChart', () => () => null);
jest.mock('../../components/tabs/ScoreTab', () => () => null);
jest.mock('../../components/tabs/JourneysTab', () => () => null);

jest.mock('../../utils', () => ({
    getJourneyHistoryAsync: jest.fn(),
    calculateScore: jest.fn(),
}));

describe('HomeScreen', () => {
    const mockJourneys = [
        {
            date: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString(), // 10 days ago
            score: 70,
            length: 15,
        },
        {
            date: new Date(Date.now() - 40 * 24 * 3600 * 1000).toISOString(), // 40 days ago
            score: 90,
            length: 20,
        },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        utils.getJourneyHistoryAsync.mockResolvedValue(mockJourneys);
        utils.calculateScore.mockImplementation(() => 50);
    });

    test('does not fetch journeys if user id missing', async () => {
        const user = {}; // no id

        render(
            <UserContext.Provider value={{ user }}>
                <HomeScreen />
            </UserContext.Provider>
        );

        await waitFor(() => {
            expect(utils.getJourneyHistoryAsync).not.toHaveBeenCalled();
        });
    });
});
