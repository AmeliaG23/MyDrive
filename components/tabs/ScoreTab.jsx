/**
 * ScoreTab.jsx
 * ----------------
 * Created: 01-08-2025
 * Author: Amelia Goldsby
 * Project : A Dual-Focus Redesign of MyDrive: Enhancing Interfaces and Scoring Architecture
 * Course : Major Project, Level 6, QA
 *
 * Purpose:
 *    Tab to display past 30 day average score.
 *    Provides contextual messages where and how user should improve their score.
 *    Summarises the total time, miles and duration of journeys in last 30 days.
 *
 * (Rani et al., 2021)
 */

import { getScoreColor } from "@/utils";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import TabStyles from "../../styles/TabStyles";

// Warning message function to display data specific reccomendations on how to improve their score
const getWarningMessage = (score, category) => {
  if (score >= 80) return null;
  switch (category) {
    case "Braking":
      return "Try to brake smoother and earlier to improve your score.";
    case "Cornering":
      return "Take corners slower and more carefully.";
    case "Phone Distraction":
      return "Avoid phone use while driving for a safer journey.";
    case "Speed":
      return "Maintain speed limits for better safety.";
    default:
      return null;
  }
};

// Simple horizontal bar visualizing score performance
const ProgressBar = ({ score }) => (
  <View style={TabStyles.progressBar}>
    <View
      style={[
        TabStyles.progressFill,
        { width: `${score}%`, backgroundColor: getScoreColor(score) },
      ]}
    />
  </View>
);

// Displays a metric summary (miles, hours, trips)
const SummaryCard = ({ iconName, label, value }) => (
  <View style={TabStyles.summaryCard}>
    <MaterialCommunityIcons name={iconName} size={28} color="#008080" />
    <Text style={TabStyles.summaryValue}>{value}</Text>
    <Text style={TabStyles.summaryLabel}>{label}</Text>
  </View>
);

export default function ScoreTab({ journeys }) {
  const now = Date.now();
  const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

  // Filter journeys to include only those within the last 30 days
  const recentJourneys = journeys.filter(
    (j) => now - new Date(j.date).getTime() <= THIRTY_DAYS_MS
  );

  // Message when no journeys are available
  if (recentJourneys.length === 0) {
    return (
      <View style={TabStyles.noDataContainer}>
        <Text style={TabStyles.noDataText}>
          No journeys in the last 30 days.
        </Text>
      </View>
    );
  }

  // Compiles scores across journeys
  const averageScores = recentJourneys.reduce(
    (acc, journey) => {
      const scores = journey.scores || {};
      acc.braking += scores.braking || 0;
      acc.cornering += scores.cornering || 0;
      acc.phoneDistraction += scores.phoneDistraction || 0;
      acc.speed += scores.speed || 0;
      return acc;
    },
    { braking: 0, cornering: 0, phoneDistraction: 0, speed: 0 }
  );

  // Average for each category
  const count = recentJourneys.length;
  const avgBraking = Math.round(averageScores.braking / count);
  const avgCornering = Math.round(averageScores.cornering / count);
  const avgPhoneDistraction = Math.round(
    averageScores.phoneDistraction / count
  );
  const avgSpeed = Math.round(averageScores.speed / count);

  // Calculate total miles, hours and trips in last 30 days
  const totalDistanceMiles = recentJourneys.reduce(
    (acc, journey) => acc + parseFloat(journey.distance || 0),
    0
  );
  const totalTimeHours = recentJourneys.reduce((acc, journey) => {
    return acc + journey.length / 60; // convert minutes to hours
  }, 0);
  const totalTrips = recentJourneys.length;

  // Card component to display score, progress bar, and messages
  const ScoreCard = ({ title, score, iconName }) => {
    const warning = getWarningMessage(score, title);
    return (
      <View style={TabStyles.card}>
        <View style={TabStyles.cardHeader}>
          <MaterialCommunityIcons
            name={iconName}
            size={24}
            color={getScoreColor(score)}
          />
          <Text style={TabStyles.cardTitle}>{title}</Text>
          <Text style={[TabStyles.cardScore, { color: getScoreColor(score) }]}>
            {score}/100
          </Text>
        </View>
        <ProgressBar score={score} />
        {/* Only render a message if score < 80 */}
        {warning && (
          <View
            style={[
              TabStyles.warningBox,
              { borderColor: getScoreColor(score) },
            ]}
          >
            <MaterialCommunityIcons
              name="alert-circle-outline"
              size={20}
              color={getScoreColor(score)}
              style={{ marginRight: 6 }}
            />
            <Text style={TabStyles.warningText}>{warning}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={TabStyles.container}>
      <Text style={TabStyles.title}>Your 30 Day Average Score Breakdown:</Text>
      <ScoreCard
        title="Braking"
        score={avgBraking}
        iconName="car-brake-alert"
      />
      <ScoreCard title="Cornering" score={avgCornering} iconName="road" />
      <ScoreCard
        title="Phone Distraction"
        score={avgPhoneDistraction}
        iconName="cellphone-off"
      />
      <ScoreCard title="Speed" score={avgSpeed} iconName="speedometer" />
      <View style={TabStyles.summaryContainer}>
        <SummaryCard
          iconName="map-marker-distance"
          label="Total Miles"
          value={totalDistanceMiles.toFixed(1)}
        />
        <SummaryCard
          iconName="timer-sand"
          label="Total Hours"
          value={totalTimeHours.toFixed(1)}
        />
        <SummaryCard iconName="car" label="Trips" value={totalTrips} />
      </View>
    </ScrollView>
  );
}
