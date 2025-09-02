/**
 * getScoreColor.test.js
 * ----------------
 * Created: 02-09-2025
 * Author: Amelia Goldsby
 * Project : A Dual-Focus Redesign of MyDrive: Enhancing Interfaces and Scoring Architecture
 * Course : Major Project, Level 6, QA
 *
 * Purpose:
 *    Functional tests for getScoreColor.js
 *
 * (Rani et al., 2021)
 */

import { getScoreColor } from '../getScoreColor';

describe('getScoreColor', () => {
    test('returns green for scores >= 80', () => {
        expect(getScoreColor(80)).toBe('#4CAF50');
        expect(getScoreColor(90)).toBe('#4CAF50');
        expect(getScoreColor(100)).toBe('#4CAF50');
    });

    test('returns amber for scores between 60 and 79', () => {
        expect(getScoreColor(60)).toBe('#F9A800');
        expect(getScoreColor(70)).toBe('#F9A800');
        expect(getScoreColor(79)).toBe('#F9A800');
    });

    test('returns red for scores below 60', () => {
        expect(getScoreColor(59)).toBe('#F44336');
        expect(getScoreColor(30)).toBe('#F44336');
        expect(getScoreColor(0)).toBe('#F44336');
    });

    test('handles negative and unusual scores gracefully', () => {
        expect(getScoreColor(-10)).toBe('#F44336');
        expect(getScoreColor(200)).toBe('#4CAF50');
    });
});
