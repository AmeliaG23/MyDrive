import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import React from 'react';
import { UserContext } from '../../context/UserContext';
import * as utils from '../../utils';
import ProfileScreen from '../ProfileScreen';

// Mock getUserById and formatDate utilities
jest.mock('../../utils', () => ({
    getUserById: jest.fn(),
    formatDate: jest.fn((date) => `formatted-${date}`),
}));

describe('ProfileScreen', () => {
    const mockUser = { id: 'user123' };
    const mockUserDetails = {
        firstName: 'Jane',
        lastName: 'Doe',
        dob: '1990-01-01',
        username: 'janedoe',
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('shows loading spinner initially', async () => {
        utils.getUserById.mockResolvedValue(mockUserDetails);

        render(
            <UserContext.Provider value={{ user: mockUser }}>
                <ProfileScreen />
            </UserContext.Provider>
        );

        // Initially shows ActivityIndicator (loading)
        expect(screen.getByTestId('loading-indicator')).toBeTruthy();
    });

    test('does not fetch user details if user id missing', () => {
        render(
            <UserContext.Provider value={{ user: {} }}>
                <ProfileScreen />
            </UserContext.Provider>
        );

        expect(utils.getUserById).not.toHaveBeenCalled();
        expect(screen.queryByText('First Name')).toBeNull();
    });

    test('opens and closes the Help modal when help button pressed', async () => {
        utils.getUserById.mockResolvedValue(mockUserDetails);

        render(
            <UserContext.Provider value={{ user: mockUser }}>
                <ProfileScreen />
            </UserContext.Provider>
        );

        // Press help button to open modal
        fireEvent.press(screen.getByTestId('help-button'));

        // Modal content should appear
        expect(screen.getByText(/Need Help\?/i)).toBeTruthy();
        expect(screen.getByText(/please contact our support team/i)).toBeTruthy();

        // Press overlay to close modal
        fireEvent.press(screen.getByTestId('modal-overlay'));

        // Modal content should disappear
        await waitFor(() => {
            expect(screen.queryByText(/Need Help\?/i)).toBeNull();
        });
    });

    test('logs error if fetching user details fails', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        utils.getUserById.mockRejectedValue(new Error('Failed to fetch'));

        render(
            <UserContext.Provider value={{ user: mockUser }}>
                <ProfileScreen />
            </UserContext.Provider>
        );

        await waitFor(() => {
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                'Error fetching user details:',
                expect.any(Error)
            );
        });

        consoleErrorSpy.mockRestore();
    });
});
