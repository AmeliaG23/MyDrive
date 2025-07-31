export async function getRoadType(latitude, longitude) {
    try {
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`;

        const response = await fetch(url, {
            headers: {
                'User-Agent': 'MyDriveApp/1.0 (amelia.goldsby@gmail.com)', // Update with your info
                'Accept-Language': 'en'
            }
        });

        const data = await response.json();

        const osmType = data?.address?.highway || 'unknown';

        // Normalize to broad categories
        return normalizeRoadType(osmType);
    } catch (error) {
        console.error('RoadType API error:', error);
        return 'unknown';
    }
}

function normalizeRoadType(osmType) {
    if (!osmType) return 'unknown';

    const highway = osmType.toLowerCase();

    if (
        ['motorway', 'trunk', 'primary', 'motorway_link', 'trunk_link'].includes(highway)
    ) {
        return 'highway';
    } else if (
        ['residential', 'living_street', 'service', 'tertiary', 'unclassified'].includes(highway)
    ) {
        return 'city';
    } else if (
        ['track', 'road', 'path', 'footway', 'bridleway'].includes(highway)
    ) {
        return 'rural';
    } else {
        return 'unknown';
    }
}
