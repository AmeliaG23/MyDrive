/**
 * scoring.js
 * ----------------
 * Created: 20-08-2025
 * Author: Amelia Goldsby
 * Project : A Dual-Focus Redesign of MyDrive: Enhancing Interfaces and Scoring Architecture
 * Course : Major Project, Level 6, QA
 *
 * Purpose:
 *    Scoring logic for journeys based on the telematics data recorded.
 *
 * (Rani et al., 2021)
 */

// Function to calculate journey score with telematics data
export const calculateScore = (journey) => {
    // Maps score to be between 0-100
    const normalise = (value, min, max) =>
        Math.min(100, Math.max(0, ((max - value) / (max - min)) * 100));

    // Road type weighting- cities penalised
    const roadTypeWeight = journey.roadType === "city" ? 1.2 : journey.roadType === "rural" ? 1.1 : 1;

    // Braking score- harsh braking penalised
    const brakingScore = Math.max(
        0,
        100 - normalise(journey.brakingAcceleration, 0, 5) * 5 * roadTypeWeight
    );

    // Cornering score- sharp cornering penalised
    const corneringScore = Math.max(
        0,
        100 - normalise(journey.cornering, 0, 4) * 4 * roadTypeWeight
    );

    // Speed score- average speed over 60 penalised
    let speedPenalty = 0;
    if (journey.speed > 60) {
        speedPenalty = Math.pow(journey.speed - 60, 1.5) * 1.5;
    }
    const speedScore = Math.max(0, 100 - speedPenalty);

    // Phone distraction score- phone usage/calls penalised
    let phonePenalty = 0;
    if (journey.phoneUsage) phonePenalty += 15;
    if (journey.phoneCallStatus) phonePenalty += 10;
    if (journey.phoneUsage && (journey.brakingAcceleration > 2 || journey.cornering > 2)) {
        phonePenalty += 10;
    }
    const phoneDistractionScore = Math.max(0, 100 - phonePenalty);

    // Total score calculated
    const totalScore =
        brakingScore * 0.3 +
        corneringScore * 0.25 +
        phoneDistractionScore * 0.25 +
        speedScore * 0.2;

    return {
        total: Math.round(totalScore),
        braking: Math.round(brakingScore),
        cornering: Math.round(corneringScore),
        phoneDistraction: Math.round(phoneDistractionScore),
        speed: Math.round(speedScore),
    };
};
// (Kalra et al., 2021)
// (Shirole et al., 2025)

// Function to retrieve 30 day average score
export const get30DayAverageScore = (journeys) => {
    const now = Date.now();
    const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

    // Filters journeys for only the past 30 days
    const recentJourneys = journeys.filter(journey => {
        const journeyDate = new Date(journey.date).getTime();
        return (now - journeyDate) <= THIRTY_DAYS_MS;
    });

    if (recentJourneys.length === 0) return 0;

    // Average the scores
    const totalScore = recentJourneys.reduce((sum, j) => sum + (j.scores?.total || 0), 0);
    return Math.round(totalScore / recentJourneys.length);
};
