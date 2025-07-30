import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Alert } from 'react-native';
import { UserContext } from '../../../context/UserContext';
import TermsOnboardingScreen from '../TermsOnboardingScreen';

describe('TermsOnboardingScreen', () => {
    const mockSetOnboarded = jest.fn();
    const mockNavigation = {
        goBack: jest.fn(),
        reset: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(Alert, 'alert').mockImplementation(() => { });
    });

    const renderScreen = () =>
        render(
            <UserContext.Provider value={{ setOnboarded: mockSetOnboarded }}>
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

        fireEvent.press(getByText('Continue'));

        expect(mockSetOnboarded).not.toHaveBeenCalled();
        expect(mockNavigation.reset).not.toHaveBeenCalled();
    });

    it('calls setOnboarded and navigates on consent given', async () => {
        mockSetOnboarded.mockResolvedValue(true);

        const { getByTestId, getByText } = renderScreen();

        const checkbox = getByTestId('consent-checkbox');
        fireEvent(checkbox, 'onValueChange', true);

        const continueButton = getByTestId('continueButton');
        expect(continueButton.props.accessibilityState.disabled).toBe(false);

        await act(async () => {
            fireEvent.press(continueButton);
        });

        await waitFor(() => {
            expect(mockSetOnboarded).toHaveBeenCalledWith(true);
            expect(mockNavigation.reset).toHaveBeenCalledWith({
                index: 0,
                routes: [{ name: 'MainTabs' }],
            });
        });
    });

    it('shows alert if setOnboarded fails', async () => {
        mockSetOnboarded.mockRejectedValue(new Error('fail'));

        const { getByTestId, getByText } = renderScreen();

        const checkbox = getByTestId('consent-checkbox');
        fireEvent(checkbox, 'onValueChange', true);

        await act(async () => {
            fireEvent.press(getByText('Continue'));
        });

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith(
                'Error',
                'Something went wrong. Please try again.'
            );
        });
    });

    it('back arrow calls navigation.goBack', () => {
        const { getByTestId } = renderScreen();

        fireEvent.press(getByTestId('backButton'));

        expect(mockNavigation.goBack).toHaveBeenCalled();
    });
});
