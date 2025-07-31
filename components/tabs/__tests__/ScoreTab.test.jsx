import { render } from "@testing-library/react-native";
import React from "react";
import ScoreTab from "../ScoreTab"; // update import path

// Mock MaterialCommunityIcons
jest.mock("react-native-vector-icons/MaterialCommunityIcons", () => "Icon");

// Mock styles to avoid style errors
jest.mock("../../../styles/TabStyles", () => ({
  container: {},
  title: {},
  card: {},
  cardHeader: {},
  cardTitle: {},
  cardScore: {},
  progressBar: {},
  progressFill: {},
  warningBox: {},
  warningText: {},
  noDataContainer: {},
  noDataText: {},
  summaryContainer: {},
  summaryCard: {},
  summaryValue: {},
  summaryLabel: {},
}));

// Helper to create journey with scores, date offset, distance, and optional endDate
const createJourney = (
  daysAgo,
  scores,
  distance = 0,
  endDateOffset = null // in days, null means no endDate, assume instantaneous
) => {
  const date = new Date(
    Date.now() - daysAgo * 24 * 60 * 60 * 1000
  ).toISOString();
  let endDate = null;
  if (endDateOffset !== null) {
    endDate = new Date(
      Date.now() - endDateOffset * 24 * 60 * 60 * 1000
    ).toISOString();
  }
  return { date, scores, distance, endDate };
};

describe("ScoreTab", () => {
  // Existing tests unchanged...

  it("calculates and displays total miles, hours and trips in last 30 days", () => {
    const journeys = [
      createJourney(
        1,
        { braking: 80, cornering: 70, phoneDistraction: 90, speed: 60 },
        12.5,
        0.5
      ),
      createJourney(
        5,
        { braking: 60, cornering: 50, phoneDistraction: 70, speed: 40 },
        25.2,
        4
      ),
      createJourney(
        40,
        { braking: 90, cornering: 80, phoneDistraction: 85, speed: 70 },
        15,
        1
      ), // old, excluded
      createJourney(
        10,
        { braking: 70, cornering: 60, phoneDistraction: 75, speed: 50 },
        10,
        8
      ),
    ];

    const { getByText } = render(<ScoreTab journeys={journeys} />);

    // Total miles: sum of last 30 days journeys distances = 12.5 + 25.2 + 10 = 47.7
    expect(getByText("Total Miles")).toBeTruthy();
    expect(getByText("47.7")).toBeTruthy();

    // Total hours: sum of durations (in hours)
    // Journey 1: endDateOffset 0.5 days ago - date 1 day ago = 0.5 days = 12 hours
    // Journey 2: endDateOffset 4 days ago - date 5 days ago = 1 day = 24 hours
    // Journey 4: endDateOffset 8 days ago - date 10 days ago = 2 days = 48 hours
    // total = 12 + 24 + 48 = 84 hours
    expect(getByText("Total Hours")).toBeTruthy();
    expect(getByText("84.0")).toBeTruthy();

    // Trips count = 3 (only journeys within 30 days)
    expect(getByText("Trips")).toBeTruthy();
    expect(getByText("3")).toBeTruthy();
  });
});
