/**
 * roadTypeService.js
 * ----------------
 * Created: 19-08-2025
 * Author: Amelia Goldsby
 * Project : A Dual-Focus Redesign of MyDrive: Enhancing Interfaces and Scoring Architecture
 * Course : Major Project, Level 6, QA
 *
 * Purpose:
 *    Service to determine the road type the user is currently on within a journey. 
 *    Utilises coordinates (latitude/longitude) and queries the OpenStreetMap Nominatim API.
 * 
 * (Rani et al., 2021)
 */

export async function getRoadType(latitude, longitude) {
    try {
        // Fetches road information from OpenStreetMap
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`;
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'MyDriveApp/1.0 (amelia.goldsby@gmail.com)', // Update with your info
                'Accept-Language': 'en'
            }
        });

        const data = await response.json();

        const osmType = data?.address?.highway || 'unknown';

        // Normalize to broad categories (highway, city, rural, unknown)
        return normalizeRoadType(osmType);
    } catch (error) {
        console.error('RoadType API error:', error);
        return 'unknown';
    }
}
// (Nominatim, 2024)

// Function to Normalize OpenStreetMap tags into smaller categories
export function normalizeRoadType(osmType) {
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
