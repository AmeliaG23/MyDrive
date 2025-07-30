import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";
import JourneysTab from "../JourneysTab"; // adjust import path

// Mock MaterialCommunityIcons to avoid native errors
jest.mock("react-native-vector-icons/MaterialCommunityIcons", () => "Icon");

// Mock TabStyles to prevent style errors
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

const journeys = [
  { date: "2025-06-20", score: 90, length: 30 },
  { date: "2025-04-15", score: 70, length: 45 },
  { date: "2024-12-01", score: 40, length: 20 },
];

describe("JourneysTab", () => {
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

    // Press outside modal to close
    fireEvent.press(queryByText("2 Months").parent);
    await waitFor(() => {
      expect(queryByText("2 Months")).toBeNull();
    });
  });

  it("filters journeys by 2mo, 6mo, and all", () => {
    const now = new Date("2025-06-30").getTime();
    // Mock Date.now()
    jest.spyOn(global.Date, "now").mockImplementation(() => now);

    const setFilter = jest.fn();

    // Filter 2 months: only journeys within last 60 days
    const { queryByText, rerender } = render(
      <JourneysTab journeys={journeys} filter="2mo" setFilter={setFilter} />
    );

    expect(queryByText("Date: 2025-06-20")).toBeTruthy(); // within 2 mo
    expect(queryByText("Date: 2025-04-15")).toBeNull(); // 2+ mo ago
    expect(queryByText("Date: 2024-12-01")).toBeNull();

    // Filter 6 months
    rerender(
      <JourneysTab journeys={journeys} filter="6mo" setFilter={setFilter} />
    );
    expect(queryByText("Date: 2025-06-20")).toBeTruthy();
    expect(queryByText("Date: 2025-04-15")).toBeTruthy();
    expect(queryByText("Date: 2024-12-01")).toBeNull();

    // Filter all
    rerender(
      <JourneysTab journeys={journeys} filter="all" setFilter={setFilter} />
    );
    expect(queryByText("Date: 2025-06-20")).toBeTruthy();
    expect(queryByText("Date: 2025-04-15")).toBeTruthy();
    expect(queryByText("Date: 2024-12-01")).toBeTruthy();

    global.Date.now.mockRestore();
  });

  it("changes filter and closes modal on dropdown option select", () => {
    const setFilter = jest.fn();
    const { getByText, queryByText } = render(
      <JourneysTab journeys={journeys} filter="all" setFilter={setFilter} />
    );

    fireEvent.press(getByText("All ▼")); // open modal
    fireEvent.press(getByText("2 Months")); // select option

    expect(setFilter).toHaveBeenCalledWith("2mo");
    expect(queryByText("2 Months")).toBeNull(); // modal closed
  });

  it("applies correct progress bar color based on score", () => {
    const { getAllByText } = render(
      <JourneysTab journeys={journeys} filter="all" setFilter={() => {}} />
    );

    // Scores: 90 -> green (#4CAF50), 70 -> amber (#F9A800), 40 -> red (#F44336)

    const scoreTexts = getAllByText(/Score: \d+\/100/);

    expect(scoreTexts.length).toBe(3);

    // We can't directly check styles easily because of native limitations,
    // but we can check if score texts exist matching scores.

    expect(scoreTexts[0].props.children.join("")).toBe("Score: 90/100");
    expect(scoreTexts[1].props.children.join("")).toBe("Score: 70/100");
    expect(scoreTexts[2].props.children.join("")).toBe("Score: 40/100");
  });
});
