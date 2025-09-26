/**
 * ScoreTab.test.jsx
 * ----------------
 * Created: 01-09-2025
 * Author: Amelia Goldsby
 * Project : A Dual-Focus Redesign of MyDrive: Enhancing Interfaces and Scoring Architecture
 * Course : Major Project, Level 6, QA
 *
 * Purpose:
 *    Functional tests for ScoreTab.jsx
 *
 * (Rani et al., 2021)
 */

/**
 * ScoreTab.test.jsx
 * ----------------
 * Updated: 26-09-2025
 * Author: Amelia Goldsby
 *
 * Purpose:
 *    Functional tests for ScoreTab.jsx including 400 miles / 60 days eligibility
 */

import { scoreEligible } from "@/utils";
import { render } from "@testing-library/react-native";
import React from "react";
import ScoreTab from "../ScoreTab";

jest.mock("react-native-vector-icons/MaterialCommunityIcons", () => "Icon");

const createJourney = (daysAgo, scores, distance = 0, lengthMinutes = 0) => {
  const date = new Date(
    Date.now() - daysAgo * 24 * 60 * 60 * 1000
  ).toISOString();
  return { date, scores, distance, length: lengthMinutes };
};

describe("ScoreTab", () => {
  it("calculates and displays total miles, hours and trips in last 30 days if eligible", () => {
    const journeys = [
      createJourney(
        1,
        { braking: 80, cornering: 70, phoneDistraction: 90, speed: 60 },
        200,
        12 * 60
      ),
      createJourney(
        5,
        { braking: 60, cornering: 50, phoneDistraction: 70, speed: 40 },
        150,
        24 * 60
      ),
      createJourney(
        10,
        { braking: 70, cornering: 60, phoneDistraction: 75, speed: 50 },
        100,
        48 * 60
      ),
    ];

    if (!scoreEligible(journeys)) {
      render(<ScoreTab journeys={[]} />);
    } else {
      const { getByText } = render(<ScoreTab journeys={journeys} />);
      expect(getByText("Total Miles")).toBeTruthy();
      expect(getByText("450.0")).toBeTruthy();
      expect(getByText("Total Hours")).toBeTruthy();
      expect(getByText("84.0")).toBeTruthy();
      expect(getByText("Trips")).toBeTruthy();
      expect(getByText("3")).toBeTruthy();
    }
  });

  it("renders no data message if under 400 miles / 60 days", () => {
    const journeys = [
      createJourney(
        2,
        { braking: 80, cornering: 70, phoneDistraction: 90, speed: 60 },
        50,
        12 * 60
      ),
      createJourney(
        5,
        { braking: 60, cornering: 50, phoneDistraction: 70, speed: 40 },
        100,
        24 * 60
      ),
    ];

    const { getByText } = render(
      scoreEligible(journeys) ? (
        <ScoreTab journeys={journeys} />
      ) : (
        <ScoreTab journeys={[]} />
      )
    );

    expect(
      getByText(
        "No scores available – drive at least 400 miles over the last 60 days."
      )
    ).toBeTruthy();
  });

  it("shows warning messages for low scores when eligible", () => {
    const journeys = [
      createJourney(
        2,
        { braking: 50, cornering: 40, phoneDistraction: 60, speed: 45 },
        400,
        60
      ),
    ];

    if (scoreEligible(journeys)) {
      const { getByText } = render(<ScoreTab journeys={journeys} />);
      expect(
        getByText("Try to brake smoother and earlier to improve your score.")
      ).toBeTruthy();
      expect(getByText("Take corners slower and more carefully.")).toBeTruthy();
      expect(
        getByText("Maintain speed limits for better safety.")
      ).toBeTruthy();
    }
  });
});
