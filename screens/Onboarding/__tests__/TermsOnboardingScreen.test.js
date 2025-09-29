/**
 * TermsOnboardingScreen.test.jsx
 * ----------------
 * Created: 01-09-2025
 * Author: Amelia Goldsby
 * Project : A Dual-Focus Redesign of MyDrive: Enhancing Interfaces and Scoring Architecture
 * Course : Major Project, Level 6, QA
 *
 * Purpose:
 *    Functional tests for TermsOnboardingScreen.jsx
 *
 * (Rani et al., 2021)
 */

import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import * as Location from 'expo-location';
import React from 'react';
import { Alert } from 'react-native';
import { UserContext } from '../../../context/UserContext';
import TermsOnboardingScreen from '../TermsOnboardingScreen';

jest.mock('expo-location', () => ({
    requestForegroundPermissionsAsync: jest.fn(),
}));

describe('TermsOnboardingScreen', () => {
    const mockSetOnboarded = jest.fn();
    const mockSetLocationPermissionGranted = jest.fn();
    const mockNavigation = {
        goBack: jest.fn(),
        reset: jest.fn(),
    };

    beforeAll(() => {
        const originalConsoleError = console.error;
        jest.spyOn(console, 'error').mockImplementation((msg, ...args) => {
            if (typeof msg === 'string' && msg.includes('An update to Icon inside a test was not wrapped in act')) {
                return;
            }
            originalConsoleError(msg, ...args);
        });
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(Alert, 'alert').mockImplementation(() => { });
    });

    const renderScreen = () =>
        render(
            <UserContext.Provider
                value={{
                    setOnboarded: mockSetOnboarded,
                    setLocationPermissionGranted: mockSetLocationPermissionGranted,
                }}
            >
                <TermsOnboardingScreen navigation={mockNavigation} />
            </UserContext.Provider>
        );

    it('renders title, checkbox, and continue button', () => {
        const { getByText } = renderScreen();

        expect(getByText('Data Consent & Permissions')).toBeTruthy();
        expect(getByText('I agree to data tracking and storage as outlined above.')).toBeTruthy();
        expect(getByText('Continue')).toBeTruthy();
    });

    it('does not proceed if consent not given', async () => {
        const { getByText } = renderScreen();

        await act(async () => {
            fireEvent.press(getByText('Continue'));
        });

        expect(mockSetOnboarded).not.toHaveBeenCalled();
        expect(mockNavigation.reset).not.toHaveBeenCalled();
    });

    it('calls setOnboarded and navigates on consent given', async () => {
        mockSetOnboarded.mockResolvedValue(true);
        Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'granted' });

        const { getByTestId } = renderScreen();

        const checkbox = getByTestId('consent-checkbox');
        fireEvent(checkbox, 'onValueChange', true);

        const continueButton = getByTestId('continueButton');
        expect(continueButton.props.accessibilityState.disabled).toBe(false);

        await act(async () => {
            fireEvent.press(continueButton);
        });

        await waitFor(() => {
            expect(mockSetLocationPermissionGranted).toHaveBeenCalledWith(true);
            expect(mockSetOnboarded).toHaveBeenCalledWith(true);
            expect(mockNavigation.reset).toHaveBeenCalledWith({
                index: 0,
                routes: [{ name: 'MainTabs' }],
            });
        });
    });

    it('shows alert if setOnboarded fails', async () => {
        mockSetOnboarded.mockRejectedValue(new Error('fail'));
        Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'granted' });

        const { getByTestId, getByText } = renderScreen();

        const checkbox = getByTestId('consent-checkbox');

        fireEvent(checkbox, 'onValueChange', true);
        fireEvent.press(getByText('Continue'));

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith(
                'Error',
                'Something went wrong. Please try again.'
            );
        });
    });
});
