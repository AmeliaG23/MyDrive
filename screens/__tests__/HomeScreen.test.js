/**
 * HomeScreen.test.jsx
 * ----------------
 * Created: 01-09-2025
 * Author: Amelia Goldsby
 * Project : A Dual-Focus Redesign of MyDrive
 * Course : Major Project, Level 6, QA
 *
 * Purpose:
 *    Functional tests for HomeScreen.jsx
 *
 * (Rani et al., 2021)
 */

import * as utils from "@/utils";
import { act, render, waitFor } from "@testing-library/react-native";
import React from "react";
import { UserContext } from "../../context/UserContext";
import HomeScreen from "../HomeScreen";

jest.mock("@react-navigation/native");
jest.mock("react-native-safe-area-context", () => ({
    useSafeAreaInsets: () => ({ top: 20 }),
    SafeAreaView: ({ children }) => children,
}));

jest.mock("../../components/charts/DoughnutChart", () => () => null);
jest.mock("../../components/tabs/ScoreTab", () => () => null);
jest.mock("../../components/tabs/JourneysTab", () => () => null);

jest.mock("../../utils", () => ({
    getJourneyHistoryAsync: jest.fn(),
    calculateScore: jest.fn(),
    checkDiscountEligibility: jest.fn(),
    scoreEligible: jest.fn(),
}));

describe("HomeScreen", () => {
    const mockJourneysBelowThreshold = [
        { id: 1, date: new Date().toISOString(), distance: 100, scores: { total: 80 } },
        { id: 2, date: new Date().toISOString(), distance: 150, scores: { total: 90 } },
    ];

    const mockJourneysOverThreshold = [
        { id: 1, date: new Date().toISOString(), distance: 250, scores: { total: 80 } },
        { id: 2, date: new Date().toISOString(), distance: 200, scores: { total: 90 } },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        utils.calculateScore.mockImplementation(() => ({ total: 50 }));
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
    });

    test("does not fetch journeys if user id missing", async () => {
        const user = {};

        render(
            <UserContext.Provider value={{ user }}>
                <HomeScreen />
            </UserContext.Provider>
        );

        await waitFor(() => {
            expect(utils.getJourneyHistoryAsync).not.toHaveBeenCalled();
        });
    });

    test("does not show journeys if under 400 miles / 60 days", async () => {
        const user = { id: "user1", firstName: "Alice" };

        utils.getJourneyHistoryAsync.mockResolvedValue(mockJourneysBelowThreshold);
        utils.checkDiscountEligibility.mockReturnValue({ eligible: false, referenceCode: null });
        utils.scoreEligible = jest.fn().mockReturnValue(false);

        const { findByText } = render(
            <UserContext.Provider value={{ user }}>
                <HomeScreen />
            </UserContext.Provider>
        );

        const noJourneysMessage = await findByText(
            /No scores available yet – drive at least 400 miles/i
        );
        expect(noJourneysMessage).toBeTruthy();
    });

    test("shows journeys if over 400 miles / 60 days", async () => {
        const user = { id: "user2", firstName: "Bob" };
        utils.getJourneyHistoryAsync.mockResolvedValue(mockJourneysOverThreshold);
        utils.scoreEligible.mockReturnValue(true);
        utils.checkDiscountEligibility.mockReturnValue({ eligible: true, referenceCode: "TESTCODE1" });

        const { queryByText } = render(
            <UserContext.Provider value={{ user }}>
                <HomeScreen />
            </UserContext.Provider>
        );

        await waitFor(() => {
            expect(queryByText(/No journeys recorded yet/i)).toBeNull();
        });
    });

    test("automatically shows discount modal when eligible", async () => {
        const user = { id: "user3", firstName: "Charlie" };
        utils.getJourneyHistoryAsync.mockResolvedValue(mockJourneysOverThreshold);
        utils.scoreEligible.mockReturnValue(true);
        utils.checkDiscountEligibility.mockReturnValue({ eligible: true, referenceCode: "TESTCODE2" });

        const { getByText, queryByText } = render(
            <UserContext.Provider value={{ user }}>
                <HomeScreen />
            </UserContext.Provider>
        );

        // Initially modal should not be visible
        expect(queryByText(/Congratulations!/)).toBeNull();

        // Wait for useEffect async operations
        await waitFor(() => {
            expect(utils.getJourneyHistoryAsync).toHaveBeenCalledWith(user.id);
        });

        // Run the modal timeout inside act
        await act(async () => {
            jest.runAllTimers();
        });

        // Now modal should be visible
        await waitFor(() => {
            expect(getByText(/Congratulations!/)).toBeTruthy();
            expect(getByText(/0800 123 4567/)).toBeTruthy();
            expect(getByText("TESTCODE2")).toBeTruthy();
        });
    });

    test("does not show discount modal when not eligible", async () => {
        const user = { id: "user4", firstName: "Dana" };
        utils.getJourneyHistoryAsync.mockResolvedValue(mockJourneysBelowThreshold);
        utils.scoreEligible.mockReturnValue(false);
        utils.checkDiscountEligibility.mockReturnValue({ eligible: false, referenceCode: null });

        const { queryByText } = render(
            <UserContext.Provider value={{ user }}>
                <HomeScreen />
            </UserContext.Provider>
        );

        jest.runAllTimers();

        await waitFor(() => {
            expect(queryByText(/Congratulations!/)).toBeNull();
        });
    });
});
