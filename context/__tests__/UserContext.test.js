import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, render } from '@testing-library/react-native';
import React from 'react';
import { UserContext, UserProvider } from '../UserContext';

describe('UserContext', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('logs in and sets onboarding and location permission states', async () => {
        const testUser = { username: 'testuser' };

        // Mock AsyncStorage responses for both onboarding and location permission keys
        AsyncStorage.getItem
            .mockResolvedValueOnce('true')  // for onboarded_testuser
            .mockResolvedValueOnce('false'); // for locationPermissionGranted_testuser

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
            .mockResolvedValueOnce('true') // onboarded
            .mockResolvedValueOnce('true'); // locationPermissionGranted

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
});
