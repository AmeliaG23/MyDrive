/**
 * roadTypeService.test.js
 * ----------------
 * Created: 01-09-2025
 * Author: Amelia Goldsby
 * Project : A Dual-Focus Redesign of MyDrive: Enhancing Interfaces and Scoring Architecture
 * Course : Major Project, Level 6, QA
 *
 * Purpose:
 *    Functional tests for roadTypeService.js
 *
 * (Rani et al., 2021)
 */

import { getRoadType, normaliseRoadType } from '../roadTypeService';

global.fetch = jest.fn();

describe('normaliseRoadType', () => {
    it('returns highway for motorway', () => {
        expect(normaliseRoadType('motorway')).toBe('highway');
    });

    it('returns city for residential', () => {
        expect(normaliseRoadType('residential')).toBe('city');
    });

    it('returns rural for track', () => {
        expect(normaliseRoadType('track')).toBe('rural');
    });

    it('returns unknown for null', () => {
        expect(normaliseRoadType(null)).toBe('unknown');
    });

    it('returns unknown for unrecognised type', () => {
        expect(normaliseRoadType('runway')).toBe('unknown');
    });
});

describe('getRoadType', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('returns normalised road type from OSM response', async () => {
        const fakeResponse = {
            address: {
                highway: 'residential',
            },
        };

        fetch.mockResolvedValueOnce({
            json: () => Promise.resolve(fakeResponse),
        });

        const roadType = await getRoadType(51.5074, -0.1278);
        expect(roadType).toBe('city');
        expect(fetch).toHaveBeenCalledTimes(1);
    });

    it('returns unknown when API fails', async () => {
        fetch.mockRejectedValueOnce(new Error('API error'));

        const roadType = await getRoadType(0, 0);
        expect(roadType).toBe('unknown');
    });

    it('returns unknown when no highway is in response', async () => {
        const fakeResponse = {
            address: {
                suburb: 'Downtown',
            },
        };

        fetch.mockResolvedValueOnce({
            json: () => Promise.resolve(fakeResponse),
        });

        const roadType = await getRoadType(0, 0);
        expect(roadType).toBe('unknown');
    });
});
