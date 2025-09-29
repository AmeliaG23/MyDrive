/**
 * SignUpScreen.test.jsx
 * ----------------
 * Created: 01-09-2025
 * Author: Amelia Goldsby
 * Updated: 26-09-2025
 *
 * Purpose:
 *    Functional tests for SignUpScreen.jsx
 *
 */

import * as utils from '@/utils';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Alert } from 'react-native';
import SignUpScreen from '../SignUpScreen';

jest.mock('@/utils');

describe('SignUpScreen', () => {
    let mockNavigation;

    beforeEach(() => {
        mockNavigation = { navigate: jest.fn(), goBack: jest.fn() };
        jest.spyOn(Alert, 'alert');
        Alert.alert.mockClear();
    });

    const fillValidForm = (screen, overrides = {}) => {
        const dobDate = overrides.dob ? new Date(overrides.dob) : new Date('2000-01-01');

        fireEvent.changeText(screen.getByPlaceholderText('First Name'), overrides.firstName || 'Jane');
        fireEvent.changeText(screen.getByPlaceholderText('Last Name'), overrides.lastName || 'Doe');
        fireEvent.changeText(screen.getByPlaceholderText('Username'), overrides.username || 'janedoe123');
        fireEvent.changeText(screen.getByPlaceholderText('Password'), overrides.password || 'StrongP@ss1');
        fireEvent.changeText(screen.getByPlaceholderText('Confirm Password'), overrides.confirmPassword || 'StrongP@ss1');

        // directly set dob and formattedDob state
        act(() => {
            screen.update(<SignUpScreen navigation={mockNavigation} testDob={dobDate} />);
        });
    };

    it('shows error if passwords do not match', async () => {
        const screen = render(<SignUpScreen navigation={mockNavigation} />);
        fillValidForm(screen, { confirmPassword: 'Mismatch1' });
        await act(async () => fireEvent.press(screen.getByText('Sign Up')));
        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith('Error', 'Passwords do not match.');
        });
    });

    it('shows error if password is weak', async () => {
        const screen = render(<SignUpScreen navigation={mockNavigation} />);
        fillValidForm(screen, { password: '123', confirmPassword: '123' });
        await act(async () => fireEvent.press(screen.getByText('Sign Up')));
        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith('Weak Password', 'Please use a stronger password.');
        });
    });

    it('shows error if username already exists', async () => {
        utils.addUserAsync.mockResolvedValue(false);
        const screen = render(<SignUpScreen navigation={mockNavigation} />);
        fillValidForm(screen);
        await act(async () => fireEvent.press(screen.getByText('Sign Up')));
        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith(
                'Error',
                'Username already exists. Please choose another.'
            );
        });
    });

    it('navigates to Login on success', async () => {
        utils.addUserAsync.mockResolvedValue(true);
        const screen = render(<SignUpScreen navigation={mockNavigation} />);
        fillValidForm(screen);
        await act(async () => fireEvent.press(screen.getByText('Sign Up')));
        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith('Success', 'Account created!');
            expect(mockNavigation.navigate).toHaveBeenCalledWith('Login');
        });
    });

    it('shows alert if addUserAsync throws', async () => {
        utils.addUserAsync.mockImplementation(() => Promise.reject(new Error('Failed')));
        const screen = render(<SignUpScreen navigation={mockNavigation} />);
        fillValidForm(screen);
        await act(async () => fireEvent.press(screen.getByText('Sign Up')));
        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith('Error', 'Failed to create account.');
        });
    });
});
