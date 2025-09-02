/**
 * formatDate.test.jsx
 * ----------------
 * Created: 01-09-2025
 * Author: Amelia Goldsby
 * Project : A Dual-Focus Redesign of MyDrive: Enhancing Interfaces and Scoring Architecture
 * Course : Major Project, Level 6, QA
 *
 * Purpose:
 *    Functional tests for formatDates.js
 *
 * (Rani et al., 2021)
 */

import { formatDate } from '../formatDate';

describe('formatDate', () => {
    test('formats a valid date string correctly', () => {
        const input = '2025-07-29T12:34:56Z';
        const output = formatDate(input);
        expect(output).toBe('29/07/2025');
    });

    test('pads single digit day and month with leading zeros', () => {
        const input = '2025-01-05T00:00:00Z';
        const output = formatDate(input);
        expect(output).toBe('05/01/2025');
    });

    test('returns empty string for invalid date string', () => {
        const input = 'invalid-date-string';
        const output = formatDate(input);
        expect(output).toBe('');
    });

    test('returns empty string for empty input', () => {
        const output = formatDate('');
        expect(output).toBe('');
    });

    test('returns empty string for undefined input', () => {
        const output = formatDate(undefined);
        expect(output).toBe('');
    });
});
