import { fireEvent, render, waitFor } from '@testing-library/react-native';
import * as Location from 'expo-location';
import React from 'react';
import { Alert } from 'react-native';
import { act } from 'react-test-renderer';
import { UserContext } from '../../context/UserContext';
import { addJourney } from '../../utils';
import JourneyScreen from '../JourneyScreen';

const mockNavigate = jest.fn();

jest.mock('../../utils', () => ({
    addJourney: jest.fn(),
}));

jest.spyOn(Alert, 'alert');

jest.mock('expo-location', () => ({
    requestForegroundPermissionsAsync: jest.fn(),
    watchPositionAsync: jest.fn(),
    Accuracy: { Highest: 6 },
    distance: jest.fn(),
}));

describe('JourneyScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const user = { id: 'user-123' };

    const renderWithContext = (userValue = user) =>
        render(
            <UserContext.Provider value={{ user: userValue }}>
                <JourneyScreen navigation={{ navigate: mockNavigate }} />
            </UserContext.Provider>
        );

    it('requests location permissions on mount and alerts if denied', async () => {
        Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'denied' });

        renderWithContext();

        await waitFor(() => {
            expect(Location.requestForegroundPermissionsAsync).toHaveBeenCalled();
            expect(Alert.alert).toHaveBeenCalledWith(
                'Permission denied',
                'Location access is required to track journeys.'
            );
        });
    });

    it('starts journey tracking when start button pressed', async () => {
        Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'granted' });
        const mockWatch = { remove: jest.fn() };
        Location.watchPositionAsync.mockResolvedValue(mockWatch);

        const { getByText } = renderWithContext();

        await act(async () => {
            fireEvent.press(getByText('Start Journey'));
        });

        expect(Location.watchPositionAsync).toHaveBeenCalledWith(
            {
                accuracy: Location.Accuracy.Highest,
                distanceInterval: 5,
                timeInterval: 1000,
            },
            expect.any(Function)
        );
        expect(getByText('Finish Journey')).toBeTruthy();
    });

    it('stops journey and calls addJourney with correct data', async () => {
        Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'granted' });
        const mockWatch = { remove: jest.fn() };
        Location.watchPositionAsync.mockResolvedValue(mockWatch);
        Location.distance.mockImplementation(() => 10);

        const { getByText } = renderWithContext();

        await act(async () => {
            fireEvent.press(getByText('Start Journey'));
        });

        const callback = Location.watchPositionAsync.mock.calls[0][1];

        const fakeLocations = [
            { coords: { latitude: 0, longitude: 0 } },
            { coords: { latitude: 0, longitude: 0.001 } },
            { coords: { latitude: 0, longitude: 0.002 } },
        ];

        await act(async () => {
            fakeLocations.forEach((loc) => callback(loc));
        });

        await act(async () => {
            fireEvent.press(getByText('Finish Journey'));
        });

        await waitFor(() => {
            expect(mockWatch.remove).toHaveBeenCalled();
            expect(addJourney).toHaveBeenCalled();
            expect(addJourney.mock.calls[0][0].userId).toBe(user.id);
        });

        const onSuccess = addJourney.mock.calls[0][1];
        await act(async () => {
            onSuccess();
        });

        expect(mockNavigate).toHaveBeenCalledWith('Home');
    });

    it('alerts error if not enough location data or no user on stopJourney', async () => {
        Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'granted' });
        const mockWatch = { remove: jest.fn() };
        Location.watchPositionAsync.mockResolvedValue(mockWatch);

        const { getByText } = renderWithContext(null);

        await act(async () => {
            fireEvent.press(getByText('Start Journey'));
        });

        await act(async () => {
            fireEvent.press(getByText('Finish Journey'));
        });

        await waitFor(() => {
            expect(mockWatch.remove).toHaveBeenCalled();
            expect(Alert.alert).toHaveBeenCalledWith('Error', 'Not enough data or no user info');
        });

        expect(addJourney).not.toHaveBeenCalled();
    });
});
