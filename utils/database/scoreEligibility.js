/**
 * scoreEligibility.js
 * ----------------
 * Created: 26-09-2025
 * Author: Amelia Goldsby
 * Project : A Dual-Focus Redesign of MyDrive: Enhancing Interfaces and Scoring Architecture
 * Course : Major Project, Level 6, QA
 *
 * Purpose:
 *    Determines if a user has driven over 400 miles over the last 60 days to recieve their first score
 *
 * (Rani et al., 2021)
 */

export function scoreEligible(journeys) {
    const now = Date.now();
    const sixtyDaysAgo = now - 60 * 24 * 60 * 60 * 1000;

    const recentJourneys = journeys.filter(j => new Date(j.date).getTime() >= sixtyDaysAgo);
    const totalDistance = recentJourneys.reduce((sum, j) => sum + (j.distance || 0), 0);

    return totalDistance >= 400;
}
