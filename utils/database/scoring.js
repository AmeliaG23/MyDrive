export const calculateScore = (journey) => {
    const normalize = (value, min, max) =>
        Math.min(100, Math.max(0, ((max - value) / (max - min)) * 100));

    const roadTypeWeight = journey.roadType === "city" ? 1.2 : journey.roadType === "rural" ? 1.1 : 1;

    const brakingScore = Math.max(
        0,
        100 - normalize(journey.brakingAcceleration, 0, 5) * 5 * roadTypeWeight
    );

    const corneringScore = Math.max(
        0,
        100 - normalize(journey.cornering, 0, 4) * 4 * roadTypeWeight
    );

    let speedPenalty = 0;
    if (journey.speed > 60) {
        speedPenalty = Math.pow(journey.speed - 60, 1.5) * 1.5;
    }
    const speedScore = Math.max(0, 100 - speedPenalty);

    let phonePenalty = 0;
    if (journey.phoneUsage) phonePenalty += 15;
    if (journey.phoneCallStatus) phonePenalty += 10;
    if (journey.phoneUsage && (journey.brakingAcceleration > 2 || journey.cornering > 2)) {
        phonePenalty += 10;
    }
    const phoneDistractionScore = Math.max(0, 100 - phonePenalty);

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

export const get30DayAverageScore = (journeys) => {
    const now = Date.now();
    const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

    const recentJourneys = journeys.filter(journey => {
        const journeyDate = new Date(journey.date).getTime();
        return (now - journeyDate) <= THIRTY_DAYS_MS;
    });

    if (recentJourneys.length === 0) return 0;

    const totalScore = recentJourneys.reduce((sum, j) => sum + (j.scores?.total || 0), 0);
    return Math.round(totalScore / recentJourneys.length);
};
