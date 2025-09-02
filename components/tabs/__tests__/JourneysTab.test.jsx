/**
 * JourneysTab.test.jsx
 * ----------------
 * Created: 01-09-2025
 * Author: Amelia Goldsby
 * Project : A Dual-Focus Redesign of MyDrive: Enhancing Interfaces and Scoring Architecture
 * Course : Major Project, Level 6, QA
 *
 * Purpose:
 *    Functional tests for JourneysTab.jsx
 *
 * (Rani et al., 2021)
 */

import { formatDate } from "@/utils";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";
import JourneysTab from "../JourneysTab";

jest.mock("react-native-vector-icons/MaterialCommunityIcons", () => "Icon");

jest.mock("../../../styles/TabStyles", () => ({
  dropdownHeader: {},
  dropdownButton: {},
  dropdownButtonText: {},
  modalOverlay: {},
  modalContent: {},
  modalItem: {},
  modalItemText: {},
  modalItemTextActive: {},
  noDataContainer: {},
  noDataText: {},
  container: {},
  card: {},
  cardTitle: {},
  progressBar: {},
  progressFill: {},
}));

const mockNavigate = jest.fn();
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
}));

const journeys = [
  { date: "2025-06-20", scores: { total: 90 }, length: 30 },
  { date: "2025-04-15", scores: { total: 70 }, length: 45 },
  { date: "2024-12-01", scores: { total: 40 }, length: 20 },
];

describe("JourneysTab", () => {
  afterEach(() => jest.clearAllMocks());

  it("renders no journeys message if journeys is empty", () => {
    const { getByText } = render(
      <JourneysTab journeys={[]} filter="all" setFilter={() => {}} />
    );
    expect(getByText("No journeys recorded yet.")).toBeTruthy();
  });

  it("renders dropdown button only if journeys exist", () => {
    const { queryByText, rerender } = render(
      <JourneysTab journeys={[]} filter="all" setFilter={() => {}} />
    );
    expect(queryByText(/Months|All/)).toBeNull();

    rerender(
      <JourneysTab journeys={journeys} filter="all" setFilter={() => {}} />
    );
    expect(queryByText("All ▼")).toBeTruthy();
  });

  it("opens and closes dropdown modal when dropdown button is pressed", async () => {
    const { getByText, queryByText } = render(
      <JourneysTab journeys={journeys} filter="all" setFilter={() => {}} />
    );

    fireEvent.press(getByText("All ▼"));
    expect(queryByText("2 Months")).toBeTruthy();

    fireEvent.press(queryByText("2 Months").parent);
    await waitFor(() => {
      expect(queryByText("2 Months")).toBeNull();
    });
  });

  it("filters journeys by 2mo, 6mo, and all correctly", () => {
    const now = new Date("2025-06-30").getTime();
    jest.spyOn(global.Date, "now").mockImplementation(() => now);

    const setFilter = jest.fn();
    const { queryByText, rerender } = render(
      <JourneysTab journeys={journeys} filter="2mo" setFilter={setFilter} />
    );

    expect(queryByText(formatDate("2025-06-20"))).toBeTruthy();
    expect(queryByText(formatDate("2025-04-15"))).toBeNull();
    expect(queryByText(formatDate("2024-12-01"))).toBeNull();

    rerender(
      <JourneysTab journeys={journeys} filter="6mo" setFilter={setFilter} />
    );
    expect(queryByText(formatDate("2025-06-20"))).toBeTruthy();
    expect(queryByText(formatDate("2025-04-15"))).toBeTruthy();
    expect(queryByText(formatDate("2024-12-01"))).toBeNull();

    rerender(
      <JourneysTab journeys={journeys} filter="all" setFilter={setFilter} />
    );
    expect(queryByText(formatDate("2025-06-20"))).toBeTruthy();
    expect(queryByText(formatDate("2025-04-15"))).toBeTruthy();
    expect(queryByText(formatDate("2024-12-01"))).toBeTruthy();

    global.Date.now.mockRestore();
  });

  it("changes filter and closes modal on dropdown option select", () => {
    const setFilter = jest.fn();
    const { getByText, queryByText } = render(
      <JourneysTab journeys={journeys} filter="all" setFilter={setFilter} />
    );

    fireEvent.press(getByText("All ▼"));
    fireEvent.press(getByText("2 Months"));

    expect(setFilter).toHaveBeenCalledWith("2mo");
    expect(queryByText("2 Months")).toBeNull();
  });

  it("applies correct progress bar color based on score", () => {
    const { getAllByText } = render(
      <JourneysTab journeys={journeys} filter="all" setFilter={() => {}} />
    );

    const scoreTexts = getAllByText(/Score: \d+\/100/);

    expect(scoreTexts.length).toBe(3);
    expect(scoreTexts[0].props.children.join("")).toBe("Score: 90/100");
    expect(scoreTexts[1].props.children.join("")).toBe("Score: 70/100");
    expect(scoreTexts[2].props.children.join("")).toBe("Score: 40/100");
  });

  it("navigates to JourneyScreen with correct params when card is pressed", () => {
    const { getByText } = render(
      <JourneysTab journeys={journeys} filter="all" setFilter={() => {}} />
    );

    const dateText = getByText(formatDate("2024-12-01"));
    fireEvent.press(dateText.parent);

    expect(mockNavigate).toHaveBeenCalledWith("JourneyScreen", {
      journey: journeys[2],
    });
  });
});
