import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import WelcomeOnboardingScreen from '../WelcomeOnboardingScreen';

describe('WelcomeOnboardingScreen', () => {
    const mockNavigation = {
        navigate: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    const renderScreen = () =>
        render(<WelcomeOnboardingScreen navigation={mockNavigation} />);

    it('renders all main texts and bullet points', () => {
        const { getByText } = renderScreen();

        expect(getByText('Welcome to MyDrive!')).toBeTruthy();
        expect(getByText('Drive smart. Drive safe. Get rewarded.')).toBeTruthy();
        expect(
            getByText(
                'MyDrive helps you become a safer driver by monitoring your driving behavior. Your driving score can even help reduce your insurance premium.'
            )
        ).toBeTruthy();

        expect(getByText('We track:')).toBeTruthy();
        expect(getByText('Speed consistency and limits')).toBeTruthy();
        expect(getByText('Braking and cornering')).toBeTruthy();
        expect(getByText('Phone usage while driving')).toBeTruthy();
        expect(getByText('Time of day and distance')).toBeTruthy();

        expect(
            getByText(
                'All data is securely stored and used only to calculate your driving score. Your privacy is our priority.'
            )
        ).toBeTruthy();
    });

    it('navigates to TermsOnboarding screen when Next button is pressed', () => {
        const { getByText } = renderScreen();

        const nextButton = getByText('Next');
        fireEvent.press(nextButton);

        expect(mockNavigation.navigate).toHaveBeenCalledWith('TermsOnboarding');
    });
});
