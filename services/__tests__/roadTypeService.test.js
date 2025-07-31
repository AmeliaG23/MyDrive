import { getRoadType, normalizeRoadType } from './roadTypeService';

global.fetch = jest.fn();

describe('normalizeRoadType', () => {
    it('returns highway for motorway', () => {
        expect(normalizeRoadType('motorway')).toBe('highway');
    });

    it('returns city for residential', () => {
        expect(normalizeRoadType('residential')).toBe('city');
    });

    it('returns rural for track', () => {
        expect(normalizeRoadType('track')).toBe('rural');
    });

    it('returns unknown for null', () => {
        expect(normalizeRoadType(null)).toBe('unknown');
    });

    it('returns unknown for unrecognized type', () => {
        expect(normalizeRoadType('runway')).toBe('unknown');
    });
});

describe('getRoadType', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('returns normalized road type from OSM response', async () => {
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
