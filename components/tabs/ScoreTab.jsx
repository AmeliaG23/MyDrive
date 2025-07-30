import React from "react";
import { ScrollView, View, Text } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import TabStyles from "../../styles/TabStyles"; // new styles

const getScoreColor = (score) => {
  if (score >= 80) return "#4CAF50"; // green
  if (score >= 50) return "#FFC107"; // amber
  return "#F44336"; // red
};

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

export default function ScoreTab({ journeys }) {
  const now = Date.now();
  const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

  const recentJourneys = journeys.filter(
    (j) => now - new Date(j.date).getTime() <= THIRTY_DAYS_MS
  );

  if (recentJourneys.length === 0) {
    return (
      <View style={TabStyles.noDataContainer}>
        <Text style={TabStyles.noDataText}>
          No journeys in the last 30 days.
        </Text>
      </View>
    );
  }

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

  const count = recentJourneys.length;

  const avgBraking = Math.round(averageScores.braking / count);
  const avgCornering = Math.round(averageScores.cornering / count);
  const avgPhoneDistraction = Math.round(
    averageScores.phoneDistraction / count
  );
  const avgSpeed = Math.round(averageScores.speed / count);
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
        {warning && (
          <View style={TabStyles.warningBox} borderColor={getScoreColor(score)}>
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
    </ScrollView>
  );
}
