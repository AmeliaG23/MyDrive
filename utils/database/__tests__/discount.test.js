/**
 * discount.test.js
 * ----------------
 * Created: 19-09-2025
 * Author: Amelia Goldsby
 * Project : A Dual-Focus Redesign of MyDrive: Enhancing Interfaces and Scoring Architecture
 * Course : Major Project, Level 6, QA
 *
 * Purpose:
 *    Functional tests for discount.js
 *
 * (Rani et al., 2021)
 */

import { checkDiscountEligibility } from "../discount";

describe("checkDiscountEligibility", () => {
    const makeJourney = (date, scored = true) => ({
        date,
        distance: 10,
        scores: scored ? { total: 75 } : undefined,
    });

    it("returns false if no journeys", () => {
        expect(checkDiscountEligibility([])).toEqual({
            eligible: false,
            referenceCode: null,
        });
    });

    it("returns false if user has less than 1 year of history", () => {
        const recentDate = new Date();
        recentDate.setDate(recentDate.getDate() - 100);
        const history = [makeJourney(recentDate.toISOString())];

        expect(checkDiscountEligibility(history)).toEqual({
            eligible: false,
            referenceCode: null,
        });
    });

    it("returns false if user has 1 year but not consistent scoring", () => {
        const history = [];
        const today = new Date();
        for (let i = 0; i < 12; i++) {
            const d = new Date(today);
            d.setMonth(today.getMonth() - i);
            // Only add score every 3rd month
            history.push(makeJourney(d.toISOString(), i % 3 === 0));
        }
        expect(checkDiscountEligibility(history).eligible).toBe(false);
    });

    it("returns true if user has 1 year and consistent scored journeys", () => {
        const history = [];
        const today = new Date();
        for (let i = 0; i < 13; i++) {
            const d = new Date(today);
            d.setMonth(today.getMonth() - i);
            history.push(makeJourney(d.toISOString(), true));
        }
        const result = checkDiscountEligibility(history);
        expect(result.eligible).toBe(true);
        expect(result.referenceCode).toMatch(/[A-Z0-9]{8}/);
    });
});
