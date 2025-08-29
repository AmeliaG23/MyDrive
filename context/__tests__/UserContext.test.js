import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, render } from '@testing-library/react-native';
import React from 'react';
import { UserContext, UserProvider } from '../UserContext';

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
}));

describe('UserContext', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('logs in and sets onboarding and location permission states', async () => {
        const testUser = { username: 'testuser' };

        AsyncStorage.getItem
            .mockResolvedValueOnce('true')  // onboarded_testuser
            .mockResolvedValueOnce('false'); // locationPermissionGranted_testuser

        let contextValue;
        render(
            <UserProvider>
                <UserContext.Consumer>
                    {(value) => {
                        contextValue = value;
                        return null;
                    }}
                </UserContext.Consumer>
            </UserProvider>
        );

        await act(async () => {
            await contextValue.login(testUser);
        });

        expect(contextValue.user).toEqual(testUser);
        expect(contextValue.onboarded).toBe(true);
        expect(contextValue.locationPermissionGranted).toBe(false);
        expect(AsyncStorage.getItem).toHaveBeenCalledWith('onboarded_testuser');
        expect(AsyncStorage.getItem).toHaveBeenCalledWith('locationPermissionGranted_testuser');
    });

    it('logs out correctly and resets states', async () => {
        const testUser = { username: 'testuser' };

        AsyncStorage.getItem
            .mockResolvedValueOnce('true')
            .mockResolvedValueOnce('true');

        let contextValue;
        render(
            <UserProvider>
                <UserContext.Consumer>
                    {(value) => {
                        contextValue = value;
                        return null;
                    }}
                </UserContext.Consumer>
            </UserProvider>
        );

        await act(async () => {
            await contextValue.login(testUser);
        });

        act(() => {
            contextValue.logout();
        });

        expect(contextValue.user).toBe(null);
        expect(contextValue.onboarded).toBe(null);
        expect(contextValue.locationPermissionGranted).toBe(null);
    });

    it('updates onboarding state and persists it', async () => {
        const testUser = { username: 'testuser' };
        AsyncStorage.setItem.mockResolvedValueOnce();

        let contextValue;
        render(
            <UserProvider>
                <UserContext.Consumer>
                    {(value) => {
                        contextValue = value;
                        return null;
                    }}
                </UserContext.Consumer>
            </UserProvider>
        );

        await act(async () => {
            await contextValue.login(testUser);
        });

        await act(async () => {
            await contextValue.setOnboarded(true);
        });

        expect(contextValue.onboarded).toBe(true);
        expect(AsyncStorage.setItem).toHaveBeenCalledWith('onboarded_testuser', 'true');
    });

    it('updates location permission state and persists it', async () => {
        const testUser = { username: 'testuser' };
        AsyncStorage.setItem.mockResolvedValueOnce();

        let contextValue;
        render(
            <UserProvider>
                <UserContext.Consumer>
                    {(value) => {
                        contextValue = value;
                        return null;
                    }}
                </UserContext.Consumer>
            </UserProvider>
        );

        await act(async () => {
            await contextValue.login(testUser);
        });

        await act(async () => {
            await contextValue.setLocationPermissionGranted(true);
        });

        expect(contextValue.locationPermissionGranted).toBe(true);
        expect(AsyncStorage.setItem).toHaveBeenCalledWith(
            'locationPermissionGranted_testuser',
            'true'
        );
    });

    it('handles errors when getting onboarding status', async () => {
        const testUser = { username: 'testuser' };
        AsyncStorage.getItem.mockRejectedValueOnce(new Error('Async error'));

        let contextValue;
        render(
            <UserProvider>
                <UserContext.Consumer>
                    {(value) => {
                        contextValue = value;
                        return null;
                    }}
                </UserContext.Consumer>
            </UserProvider>
        );

        await act(async () => {
            await contextValue.login(testUser);
        });

        expect(contextValue.onboarded).toBe(false); // default fallback
    });
});
