/**
 * WelcomeOnboardingScreen.test.jsx
 * ----------------
 * Created: 01-09-2025
 * Author: Amelia Goldsby
 * Project : A Dual-Focus Redesign of MyDrive: Enhancing Interfaces and Scoring Architecture
 * Course : Major Project, Level 6, QA
 *
 * Purpose:
 *    Functional tests for WelcomeOnboardingScreen.jsx
 *
 * (Rani et al., 2021)
 */

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

    it('renders all main texts and offer card', () => {
        const { getByText } = renderScreen();

        expect(getByText('Welcome to MyDrive!')).toBeTruthy();
        expect(getByText('Drive smart. Drive safe. Get rewarded.')).toBeTruthy();
        expect(
            getByText(
                'MyDrive helps you become a safer driver by monitoring your driving behavior. Your driving score can even help reduce your insurance premium.'
            )
        ).toBeTruthy();

        expect(
            getByText(
                'Drive 400 miles over the past 60 days and earn a special Aviva car insurance discount!'
            )
        ).toBeTruthy();
        expect(getByText('Track your driving score and see how safe you are on the road.')).toBeTruthy();
        expect(getByText('All data is stored securely and never sold.')).toBeTruthy();
    });

    it('navigates to TermsOnboarding screen when Next button is pressed', () => {
        const { getByText } = renderScreen();

        const nextButton = getByText('Next');
        fireEvent.press(nextButton);

        expect(mockNavigation.navigate).toHaveBeenCalledWith('TermsOnboarding');
    });
});
