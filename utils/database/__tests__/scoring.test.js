/**
 * scoring.test.js
 * ----------------
 * Created: 01-09-2025
 * Author: Amelia Goldsby
 * Project : A Dual-Focus Redesign of MyDrive: Enhancing Interfaces and Scoring Architecture
 * Course : Major Project, Level 6, QA
 *
 * Purpose:
 *    Functional tests for scoring.js
 *
 * (Rani et al., 2021)
 */

import { calculateScore, get30DayAverageScore } from '../scoring';

describe('calculateScore', () => {
    test('calculates a perfect score for ideal journey', () => {
        const journey = {
            brakingAcceleration: 0,
            cornering: 0,
            speed: 50,              // below penalty threshold
            phoneUsage: false,
            phoneCallStatus: false,
            roadType: 'highway',
        };

        const result = calculateScore(journey);

        expect(result.total).toBe(45);         // (0*0.3 + 0*0.25 + 100*0.25 + 100*0.2) = 45
        expect(result.braking).toBe(0);
        expect(result.cornering).toBe(0);
        expect(result.phoneDistraction).toBe(100);
        expect(result.speed).toBe(100);
    });

    test('penalizes phone usage and calls correctly', () => {
        const journey = {
            brakingAcceleration: 1,
            cornering: 1,
            speed: 50,
            phoneUsage: true,
            phoneCallStatus: true,
            roadType: 'city',
        };

        const result = calculateScore(journey);

        // phoneDistraction penalty = 15 (usage) + 10 (call) = 25 → score = 75
        expect(result.phoneDistraction).toBe(75);

        // total score should be less than 100 due to penalties
        expect(result.total).toBeLessThan(100);
    });

    test('calculates speed penalty for speeds above 60', () => {
        const journey = {
            brakingAcceleration: 0,
            cornering: 0,
            speed: 70, // above 60, so penalty applies
            phoneUsage: false,
            phoneCallStatus: false,
            roadType: 'highway',
        };

        const result = calculateScore(journey);

        // speed penalty = ((70 - 60) ^ 1.5) * 1.5
        const speedPenalty = Math.pow(10, 1.5) * 1.5;
        const expectedSpeedScore = Math.max(0, 100 - speedPenalty);

        expect(result.speed).toBe(Math.round(expectedSpeedScore));
        expect(result.total).toBeLessThan(100);
    });

    test('adds extra penalty for phone usage with high braking or cornering', () => {
        const journey = {
            brakingAcceleration: 3,
            cornering: 0,
            speed: 50,
            phoneUsage: true,
            phoneCallStatus: false,
            roadType: 'rural',
        };

        const result = calculateScore(journey);

        // phone penalty = 15 (usage) + 10 (extra for braking > 2)
        expect(result.phoneDistraction).toBe(75);
    });
});

describe('get30DayAverageScore', () => {
    const now = Date.now();

    test('calculates average of scores within last 30 days', () => {
        const journeys = [
            { date: new Date(now - 5 * 24 * 60 * 60 * 1000).toISOString(), scores: { total: 70 } },
            { date: new Date(now - 10 * 24 * 60 * 60 * 1000).toISOString(), scores: { total: 90 } },
            { date: new Date(now - 40 * 24 * 60 * 60 * 1000).toISOString(), scores: { total: 50 } }, // old, ignored
        ];

        const result = get30DayAverageScore(journeys);

        // average only first two (70 + 90) / 2 = 80
        expect(result).toBe(80);
    });

    test('returns 0 when no journeys in last 30 days', () => {
        const journeys = [
            { date: new Date(now - 40 * 24 * 60 * 60 * 1000).toISOString(), scores: { total: 50 } },
        ];

        expect(get30DayAverageScore(journeys)).toBe(0);
    });

    test('returns 35 if one journey is missing scores', () => {
        const journeys = [
            { date: new Date(now).toISOString(), scores: { total: 70 } },
            { date: new Date(now).toISOString() },
        ];

        const result = get30DayAverageScore(journeys);
        // sum = 70 + 0, count = 2 → 35
        expect(result).toBe(35);
    });

    test('rounds average correctly', () => {
        const journeys = [
            { date: new Date(now).toISOString(), scores: { total: 70.4 } },
            { date: new Date(now).toISOString(), scores: { total: 90.6 } },
        ];

        const result = get30DayAverageScore(journeys);

        // average  (70.4 + 90.6) / 2 = 80 → rounded 81
        expect(result).toBe(81);
    });
});
