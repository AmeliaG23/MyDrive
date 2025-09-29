/**
 * discount.js
 * ----------------
 * Created: 19-09-2025
 * Author: Amelia Goldsby
 * Project : A Dual-Focus Redesign of MyDrive: Enhancing Interfaces and Scoring Architecture
 * Course : Major Project, Level 6, QA
 *
 * Purpose:
 *    Determines if a user is eligible for an insurance discount.
 *    Rules:
 *  - User has been using the app for >= 1 year (365 days since first journey)
 *  - User has logged scored journeys consistently (>= 75% of months since first journey)
 *
 * (Rani et al., 2021)
 */

import uuid from "react-native-uuid";

export function checkDiscountEligibility(history = []) {
    if (!Array.isArray(history) || history.length === 0) {
        return { eligible: false, referenceCode: null };
    }

    // Sort journeys oldest to newest
    const sortedJourneys = [...history].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const firstJourneyDate = new Date(sortedJourneys[0].date);
    const daysSinceFirst =
        (Date.now() - firstJourneyDate.getTime()) / (1000 * 3600 * 24);

    const hasOneYear = daysSinceFirst >= 365;

    // Count months that have scored journeys
    const months = new Set();
    history.forEach((j) => {
        if (j.scores?.total !== undefined) {
            const d = new Date(j.date);
            months.add(`${d.getFullYear()}-${d.getMonth()}`);
        }
    });

    const monthsCount = months.size;
    const monthsSinceFirst = Math.floor(daysSinceFirst / 30);

    // Consistency check: >= 75% of months must have a scored journey
    const consistency =
        monthsSinceFirst > 0 && monthsCount / monthsSinceFirst >= 0.75;

    if (hasOneYear && consistency) {
        return {
            eligible: true,
            referenceCode:
                uuid.v4().split("-")[0].toUpperCase() || "REFCODE",
        };
    }

    return { eligible: false, referenceCode: null };
}
