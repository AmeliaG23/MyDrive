/**
 * SignUpScreen.test.jsx
 * ----------------
 * Created: 01-09-2025
 * Author: Amelia Goldsby
 * Project : A Dual-Focus Redesign of MyDrive: Enhancing Interfaces and Scoring Architecture
 * Course : Major Project, Level 6, QA
 *
 * Purpose:
 *    Functional tests for SignUpScreen.jsx
 *
 * (Rani et al., 2021)
 */

import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Alert } from 'react-native';
import * as utils from '../../../utils';
import SignUpScreen from '../SignUpScreen';

jest.mock('../../../utils', () => ({
    addUserAsync: jest.fn(),
}));

const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
};

beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, 'alert');
});

const simulateDateChange = async (screen, dob) => {
    await act(async () => {
        fireEvent.press(screen.getByPlaceholderText('Date of Birth (MM/DD/YYYY)'));
    });

    const picker = screen.getByTestId('dob-picker');
    if (!picker) {
        throw new Error('Date picker not found. Make sure testID="dob-picker" exists.');
    }

    await act(async () => {
        fireEvent(picker, 'onChange', { type: 'set', nativeEvent: { timestamp: dob.getTime() } }, dob);
    });
};

const fillValidForm = async (screen, options = {}) => {
    const {
        firstName = 'Jane',
        lastName = 'Doe',
        username = 'janedoe123',
        password = 'StrongP@ss1',
        confirmPassword = 'StrongP@ss1',
        dob = new Date(2000, 0, 1),
    } = options;

    await act(async () => {
        fireEvent.changeText(screen.getByPlaceholderText('First Name'), firstName);
        fireEvent.changeText(screen.getByPlaceholderText('Last Name'), lastName);
        fireEvent.changeText(screen.getByPlaceholderText('Username'), username);
        fireEvent.changeText(screen.getByPlaceholderText('Password'), password);
        fireEvent.changeText(screen.getByPlaceholderText('Confirm Password'), confirmPassword);
    });

    await simulateDateChange(screen, dob);
};

describe('SignUpScreen', () => {
    it('renders all fields and buttons', () => {
        const screen = render(<SignUpScreen navigation={mockNavigation} />);
        expect(screen.getByPlaceholderText('First Name')).toBeTruthy();
        expect(screen.getByPlaceholderText('Last Name')).toBeTruthy();
        expect(screen.getByPlaceholderText('Date of Birth (MM/DD/YYYY)')).toBeTruthy();
        expect(screen.getByPlaceholderText('Username')).toBeTruthy();
        expect(screen.getByPlaceholderText('Password')).toBeTruthy();
        expect(screen.getByPlaceholderText('Confirm Password')).toBeTruthy();
        expect(screen.getByText('Sign Up')).toBeTruthy();
        expect(screen.getByText('Back')).toBeTruthy();
    });

    it('shows error if fields are empty', async () => {
        const screen = render(<SignUpScreen navigation={mockNavigation} />);
        await act(async () => {
            fireEvent.press(screen.getByText('Sign Up'));
        });
        await waitFor(() =>
            expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please fill out all fields.')
        );
    });

    it('shows error if under 17', async () => {
        const screen = render(<SignUpScreen navigation={mockNavigation} />);
        const underageDob = new Date();
        underageDob.setFullYear(underageDob.getFullYear() - 10);
        await fillValidForm(screen, { dob: underageDob });

        await act(async () => {
            fireEvent.press(screen.getByText('Sign Up'));
        });

        await waitFor(() =>
            expect(Alert.alert).toHaveBeenCalledWith(
                'Age Restriction',
                'You must be at least 17 years old to sign up.'
            )
        );
    });

    it('shows error if passwords do not match', async () => {
        const screen = render(<SignUpScreen navigation={mockNavigation} />);
        await fillValidForm(screen, {
            password: 'StrongP@ss1',
            confirmPassword: 'Mismatch!',
        });

        await act(async () => {
            fireEvent.press(screen.getByText('Sign Up'));
        });

        await waitFor(() =>
            expect(Alert.alert).toHaveBeenCalledWith('Error', 'Passwords do not match.')
        );
    });

    it('shows error if password is weak', async () => {
        const screen = render(<SignUpScreen navigation={mockNavigation} />);
        await fillValidForm(screen, {
            password: '123',
            confirmPassword: '123',
        });

        await act(async () => {
            fireEvent.press(screen.getByText('Sign Up'));
        });

        await waitFor(() =>
            expect(Alert.alert).toHaveBeenCalledWith(
                'Weak Password',
                'Please use a stronger password.'
            )
        );
    });

    it('shows error if username already exists', async () => {
        utils.addUserAsync.mockResolvedValue(false);
        const screen = render(<SignUpScreen navigation={mockNavigation} />);
        await fillValidForm(screen);

        await act(async () => {
            fireEvent.press(screen.getByText('Sign Up'));
        });

        await waitFor(() =>
            expect(Alert.alert).toHaveBeenCalledWith(
                'Error',
                'Username already exists. Please choose another.'
            )
        );
    });

    it('navigates to Login on success', async () => {
        utils.addUserAsync.mockResolvedValue(true);
        const screen = render(<SignUpScreen navigation={mockNavigation} />);
        await fillValidForm(screen);

        await act(async () => {
            fireEvent.press(screen.getByText('Sign Up'));
        });

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith('Success', 'Account created!');
            expect(mockNavigation.navigate).toHaveBeenCalledWith('Login');
        });
    });

    it('shows alert if addUserAsync throws', async () => {
        utils.addUserAsync.mockRejectedValue(new Error('Failed'));
        const screen = render(<SignUpScreen navigation={mockNavigation} />);
        await fillValidForm(screen);

        await act(async () => {
            fireEvent.press(screen.getByText('Sign Up'));
        });

        await waitFor(() =>
            expect(Alert.alert).toHaveBeenCalledWith('Error', 'Failed to create account.')
        );
    });

    it('calls goBack on back button press', async () => {
        const screen = render(<SignUpScreen navigation={mockNavigation} />);
        await act(async () => {
            fireEvent.press(screen.getByText('Back'));
        });
        expect(mockNavigation.goBack).toHaveBeenCalled();
    });
});
