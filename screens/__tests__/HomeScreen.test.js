/**
 * HomeScreen.test.jsx
 * ----------------
 * Created: 01-09-2025
 * Author: Amelia Goldsby
 * Project : A Dual-Focus Redesign of MyDrive: Enhancing Interfaces and Scoring Architecture
 * Course : Major Project, Level 6, QA
 *
 * Purpose:
 *    Functional tests for HomeScreen.jsx
 *
 * (Rani et al., 2021)
 */

// Polyfill clearImmediate for React Native Jest issues
if (typeof setImmediate === 'undefined') {
    global.setImmediate = (fn, ...args) => setTimeout(fn, 0, ...args);
}
if (typeof clearImmediate === 'undefined') {
    global.clearImmediate = jest.fn();
}

import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { UserContext } from '../../context/UserContext';
import * as utils from '../../utils';
import HomeScreen from '../HomeScreen';

jest.mock('@react-navigation/native');
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
        { id: 1, date: new Date().toISOString(), distance: 300, scores: { total: 80 } },
        { id: 2, date: new Date().toISOString(), distance: 150, scores: { total: 90 } },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        utils.getJourneyHistoryAsync.mockResolvedValue(mockJourneys);
        utils.calculateScore.mockImplementation(() => ({ total: 50 }));
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

    test('fetches journeys and displays discount modal when eligible', async () => {
        const user = { id: 'user1', firstName: 'Alice' };

        const { getByText, queryByText, getByTestId, getByAccessibilityHint } = render(
            <UserContext.Provider value={{ user }}>
                <HomeScreen />
            </UserContext.Provider>
        );

        // Wait for journeys to load and discount message to appear
        const discountBanner = await waitFor(() => getByTestId('discount-message'));
        expect(discountBanner).toBeTruthy();

        // Open the modal
        fireEvent.press(discountBanner);

        // Wait for modal content
        await waitFor(() => {
            expect(getByText(/Congratulations!/)).toBeTruthy();
            expect(getByText(/0800 123 4567/)).toBeTruthy();
        });
    });
});
