// utils/context/__tests__/UserContext.test.js (or .ts if using TS)
import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, render } from '@testing-library/react-native';
import React from 'react';
import { UserContext, UserProvider } from '../UserContext';

describe('UserContext', () => {
    it('logs in and sets onboarding state', async () => {
        const testUser = { username: 'testuser' };
        AsyncStorage.getItem.mockResolvedValueOnce('true');

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
        expect(AsyncStorage.getItem).toHaveBeenCalledWith('onboarded_testuser');
    });

    it('logs out correctly', async () => {
        const testUser = { username: 'testuser' };
        AsyncStorage.getItem.mockResolvedValueOnce('true');

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
    });
});
