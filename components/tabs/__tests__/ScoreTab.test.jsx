import { render } from "@testing-library/react-native";
import React from "react";
import ScoreTab from "../ScoreTab"; // update import path

// Mock MaterialCommunityIcons
jest.mock("react-native-vector-icons/MaterialCommunityIcons", () => "Icon");

// Helper to create journey with scores, distance, and length in minutes
const createJourney = (daysAgo, scores, distance = 0, lengthMinutes = 0) => {
  const date = new Date(
    Date.now() - daysAgo * 24 * 60 * 60 * 1000
  ).toISOString();
  return { date, scores, distance, length: lengthMinutes };
};

describe("ScoreTab", () => {
  it("calculates and displays total miles, hours and trips in last 30 days", () => {
    const journeys = [
      createJourney(
        1,
        { braking: 80, cornering: 70, phoneDistraction: 90, speed: 60 },
        12.5,
        12 * 60
      ), // 12 hours
      createJourney(
        5,
        { braking: 60, cornering: 50, phoneDistraction: 70, speed: 40 },
        25.2,
        24 * 60
      ), // 24 hours
      createJourney(
        40,
        { braking: 90, cornering: 80, phoneDistraction: 85, speed: 70 },
        15,
        1 * 60
      ), // excluded (older than 30 days)
      createJourney(
        10,
        { braking: 70, cornering: 60, phoneDistraction: 75, speed: 50 },
        10,
        48 * 60
      ), // 48 hours
    ];

    const { getByText } = render(<ScoreTab journeys={journeys} />);

    // Total miles = 12.5 + 25.2 + 10 = 47.7
    expect(getByText("Total Miles")).toBeTruthy();
    expect(getByText("47.7")).toBeTruthy();

    // Total hours = 12 + 24 + 48 = 84
    expect(getByText("Total Hours")).toBeTruthy();
    expect(getByText("84.0")).toBeTruthy();

    // Trips = 3 (only journeys within 30 days)
    expect(getByText("Trips")).toBeTruthy();
    expect(getByText("3")).toBeTruthy();
  });

  it("shows warning messages for low scores", () => {
    const journeys = [
      createJourney(
        2,
        { braking: 50, cornering: 40, phoneDistraction: 60, speed: 45 },
        10,
        60
      ),
    ];

    const { getByText } = render(<ScoreTab journeys={journeys} />);

    expect(
      getByText("Try to brake smoother and earlier to improve your score.")
    ).toBeTruthy();
    expect(getByText("Take corners slower and more carefully.")).toBeTruthy();
    expect(getByText("Maintain speed limits for better safety.")).toBeTruthy();
  });

  it("renders no data message if no journeys in last 30 days", () => {
    const journeys = [
      createJourney(
        40,
        { braking: 90, cornering: 80, phoneDistraction: 85, speed: 70 },
        15,
        60
      ),
    ];

    const { getByText } = render(<ScoreTab journeys={journeys} />);
    expect(getByText("No journeys in the last 30 days.")).toBeTruthy();
  });
});
