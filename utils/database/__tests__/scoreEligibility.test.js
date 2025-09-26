/**
 * scoreEligibility.test.js
 * --------------------
 * Created: 26-09-2025
 * Author: Amelia Goldsby
 *
 * Purpose:
 *    Functional tests for scoreEligibility.js
 * 
 * (Rani et al., 2021)
 */

import { scoreEligible } from "../scoreEligibility";

describe("meetsThreshold", () => {
    const now = new Date();

    const makeJourney = (daysAgo, distance) => {
        const date = new Date(now);
        date.setDate(now.getDate() - daysAgo);
        return {
            date: date.toISOString().split("T")[0],
            distance,
        };
    };

    it("returns false when no journeys exist", () => {
        expect(scoreEligible([])).toBe(false);
    });

    it("returns false when total distance < 400 in last 60 days", () => {
        const journeys = [
            makeJourney(10, 100),
            makeJourney(20, 150),
            makeJourney(30, 50),
        ];
        expect(scoreEligible(journeys)).toBe(false);
    });

    it("returns true when total distance >= 400 in last 60 days", () => {
        const journeys = [
            makeJourney(5, 200),
            makeJourney(15, 150),
            makeJourney(25, 100),
        ];
        expect(scoreEligible(journeys)).toBe(true);
    });

    it("ignores journeys older than 60 days", () => {
        const journeys = [
            makeJourney(10, 300),
            makeJourney(70, 200), // too old
            makeJourney(80, 150), // too old
        ];
        expect(scoreEligible(journeys)).toBe(false);
    });

    it("handles journeys with missing or zero distance safely", () => {
        const journeys = [
            makeJourney(5, undefined),
            makeJourney(15, 0),
            makeJourney(25, 400),
        ];
        expect(scoreEligible(journeys)).toBe(true);
    });
});
