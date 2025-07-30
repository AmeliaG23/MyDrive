import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Alert } from 'react-native';
import { UserContext } from '../../../context/UserContext';
import { getAllUsers } from '../../../utils';
import LoginScreen from '../LoginScreen';

jest.mock('../../../utils', () => ({
    getAllUsers: jest.fn(),
}));

const mockLogin = jest.fn();
jest.spyOn(Alert, 'alert');

describe('LoginScreen', () => {
    const navigation = { navigate: jest.fn(), setOptions: jest.fn() };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    const renderWithContext = () =>
        render(
            <UserContext.Provider value={{ login: mockLogin }}>
                <LoginScreen navigation={navigation} skipLoginDelay={true} />
            </UserContext.Provider>
        );

    it('renders username, password inputs and login button', () => {
        const { getByPlaceholderText, getByText } = renderWithContext();

        expect(getByPlaceholderText('Username')).toBeTruthy();
        expect(getByPlaceholderText('Password')).toBeTruthy();
        expect(getByText('Login')).toBeTruthy();
    });

    it('shows alert if username or password is empty', () => {
        const { getByText } = renderWithContext();
        fireEvent.press(getByText('Login'));

        expect(Alert.alert).toHaveBeenCalledWith(
            'Error',
            'Please enter both username and password.'
        );
    });

    it('calls login with correct user after successful authentication', async () => {
        const user = { id: '1', username: 'test', password: 'pass' };
        getAllUsers.mockResolvedValue([user]);

        const { getByPlaceholderText, getByText } = renderWithContext();

        fireEvent.changeText(getByPlaceholderText('Username'), 'test');
        fireEvent.changeText(getByPlaceholderText('Password'), 'pass');
        fireEvent.press(getByText('Login'));

        // No timers to advance since delay skipped
        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith(user);
        });
    });

    it('shows alert on invalid username or password', async () => {
        getAllUsers.mockResolvedValue([{ username: 'user', password: '123' }]);

        const { getByPlaceholderText, getByText } = renderWithContext();
        fireEvent.changeText(getByPlaceholderText('Username'), 'wrong');
        fireEvent.changeText(getByPlaceholderText('Password'), 'wrong');
        fireEvent.press(getByText('Login'));

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith(
                'Error',
                'Invalid username or password.'
            );
        });
    });

    it('shows alert on getAllUsers failure', async () => {
        getAllUsers.mockRejectedValue(new Error('fail'));

        const { getByPlaceholderText, getByText } = renderWithContext();
        fireEvent.changeText(getByPlaceholderText('Username'), 'test');
        fireEvent.changeText(getByPlaceholderText('Password'), 'pass');
        fireEvent.press(getByText('Login'));

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith('Error', 'Failed to log in.');
        });
    });

    it('navigates to Signup screen on link press', () => {
        const { getByText } = renderWithContext();
        fireEvent.press(getByText("Don't have an account? Sign Up"));

        expect(navigation.navigate).toHaveBeenCalledWith('Signup');
    });
});
