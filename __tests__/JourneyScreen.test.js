/**
 * JourneyScreen.test.jsx
 * ----------------
 * Created: 01-09-2025
 * Author: Amelia Goldsby
 * Project : A Dual-Focus Redesign of MyDrive: Enhancing Interfaces and Scoring Architecture
 * Course : Major Project, Level 6, QA
 *
 * Purpose:
 *    Functional tests for JourneyScreen.jsx
 *
 * (Rani et al., 2021)
 */

import { act, fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { UserContext } from '../../context/UserContext';
import JourneyScreen from '../JourneyScreen';

const mockNavigation = {
    goBack: jest.fn(),
    dispatch: jest.fn(),
};

const mockUser = { id: 'user123' };
const mockJourney = {
    id: 'journey123',
    date: '2023-01-01T00:00:00Z',
    scores: {
        total: 75,
        speed: 80,
        braking: 70,
    },
    distance: 10,
    length: 15,
};

const mockRouteWithJourney = {
    params: { journey: mockJourney },
};

const mockRouteNoJourney = {
    params: {},
};

jest.mock('@/utils', () => ({
    deleteJourneyAsync: jest.fn(),
}));

const Wrapper = ({ children }) => (
    <UserContext.Provider value={{ user: mockUser }}>
        {children}
    </UserContext.Provider>
);

describe('JourneyScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('shows error message when no journey provided', () => {
        const { getByText } = render(
            <JourneyScreen route={mockRouteNoJourney} navigation={mockNavigation} />,
            { wrapper: Wrapper }
        );

        expect(getByText(/no journey data available/i)).toBeTruthy();
    });

    test('renders journey details correctly', () => {
        const { getByText, getByTestId } = render(
            <JourneyScreen route={mockRouteWithJourney} navigation={mockNavigation} />,
            { wrapper: Wrapper }
        );

        expect(getByText(/journey on/i)).toBeTruthy();
        expect(getByText(/10 miles/i)).toBeTruthy();
        expect(getByText(/15 minutes/i)).toBeTruthy();
        expect(getByText(/speed/i)).toBeTruthy();
        expect(getByText(/braking/i)).toBeTruthy();
        expect(getByTestId('backButton')).toBeTruthy();
    });

    test('opens passenger modal and cancels correctly', async () => {
        const { getByText, queryByText } = render(
            <JourneyScreen route={mockRouteWithJourney} navigation={mockNavigation} />,
            { wrapper: Wrapper }
        );

        // Open modal
        await act(async () => {
            fireEvent.press(getByText(/were you a passenger/i));
        });

        expect(getByText(/were you a passenger on this journey/i)).toBeTruthy();

        // Cancel passenger modal
        await act(async () => {
            fireEvent.press(getByText('No'));
        });

        expect(queryByText(/were you a passenger on this journey/i)).toBeNull();
    });

    test('back button calls navigation.goBack', async () => {
        const { getByTestId } = render(
            <JourneyScreen route={mockRouteWithJourney} navigation={mockNavigation} />,
            { wrapper: Wrapper }
        );

        const backButton = getByTestId('backButton');
        await act(async () => {
            fireEvent.press(backButton);
        });

        expect(mockNavigation.goBack).toHaveBeenCalled();
    });
});
