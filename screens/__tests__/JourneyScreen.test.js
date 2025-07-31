import * as utils from '@/utils'; // For deleteJourneyAsync mock
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { UserContext } from '../../context/UserContext';
import JourneyScreen from '../JourneyScreen'; // Adjust path

// Mock navigation prop
const mockNavigation = {
    goBack: jest.fn(),
    dispatch: jest.fn(),
};

// Sample journey data for tests
const sampleJourney = {
    id: 'journey1',
    date: '2025-07-31T00:00:00.000Z',
    distance: 1234,
    scores: {
        total: 85,
        brakingAcceleration: 90,
        cornering: 80,
    },
};

// Mock user context
const user = {
    id: 'user1',
    username: 'testuser',
};

describe('JourneyScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders journey details correctly', () => {
        const { getByText } = render(
            <UserContext.Provider value={{ user }}>
                <JourneyScreen
                    route={{ params: { journey: sampleJourney } }}
                    navigation={mockNavigation}
                />
            </UserContext.Provider>
        );

        expect(getByText('Journey on 7/31/2025')).toBeTruthy();
        expect(getByText('1234 meters')).toBeTruthy();
        expect(getByText('Were you a passenger?')).toBeTruthy();
    });

    test('shows error message when no journey provided', () => {
        const { getByText } = render(
            <UserContext.Provider value={{ user }}>
                <JourneyScreen
                    route={{ params: {} }}
                    navigation={mockNavigation}
                />
            </UserContext.Provider>
        );

        expect(getByText('No journey data available')).toBeTruthy();
    });

    test('opens passenger modal on button press', () => {
        const { getByText, queryByText } = render(
            <UserContext.Provider value={{ user }}>
                <JourneyScreen
                    route={{ params: { journey: sampleJourney } }}
                    navigation={mockNavigation}
                />
            </UserContext.Provider>
        );

        fireEvent.press(getByText('Were you a passenger?'));
        expect(queryByText('Were you a passenger on this journey?')).toBeTruthy();
    });

    test('validates passenger modal selection', () => {
        const { getByText, queryByText } = render(
            <UserContext.Provider value={{ user }}>
                <JourneyScreen
                    route={{ params: { journey: sampleJourney } }}
                    navigation={mockNavigation}
                />
            </UserContext.Provider>
        );

        fireEvent.press(getByText('Were you a passenger?'));
        fireEvent.press(getByText('Confirm'));

        // Alert will show - no selection
        // Because React Native Alert is native, we can spy on it

        const alertSpy = jest.spyOn(global, 'alert').mockImplementation(() => { });
        fireEvent.press(getByText('Confirm'));
        expect(alertSpy).toHaveBeenCalled();
        alertSpy.mockRestore();
    });

    test('shows delete confirmation modal when "Yes" selected', () => {
        const { getByText, queryByText } = render(
            <UserContext.Provider value={{ user }}>
                <JourneyScreen
                    route={{ params: { journey: sampleJourney } }}
                    navigation={mockNavigation}
                />
            </UserContext.Provider>
        );

        fireEvent.press(getByText('Were you a passenger?'));
        fireEvent.press(getByText('Yes'));
        fireEvent.press(getByText('Confirm'));

        expect(queryByText('Are you sure you want to delete this journey?')).toBeTruthy();
    });

    test('deletes journey and resets navigation', async () => {
        jest.spyOn(utils, 'deleteJourneyAsync').mockResolvedValue();

        const { getByText, queryByText } = render(
            <UserContext.Provider value={{ user }}>
                <JourneyScreen
                    route={{ params: { journey: sampleJourney } }}
                    navigation={mockNavigation}
                />
            </UserContext.Provider>
        );

        fireEvent.press(getByText('Were you a passenger?'));
        fireEvent.press(getByText('Yes'));
        fireEvent.press(getByText('Confirm'));

        fireEvent.press(getByText('Delete Journey'));

        await waitFor(() => {
            expect(utils.deleteJourneyAsync).toHaveBeenCalledWith(user.id, sampleJourney.id);
            expect(mockNavigation.dispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'RESET',
                    payload: expect.objectContaining({
                        routes: [{ name: 'MainTabs' }],
                    }),
                })
            );
            expect(queryByText('Journey deleted')).toBeNull(); // Alert shows on native, can't test
        });
    });
});
