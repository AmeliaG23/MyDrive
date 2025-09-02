/**
 * DoughnutChart.jsx
 * ----------------
 * Created: 01-08-2025
 * Author: Amelia Goldsby
 * Project : A Dual-Focus Redesign of MyDrive: Enhancing Interfaces and Scoring Architecture
 * Course : Major Project, Level 6, QA
 *
 * Purpose:
 *   Renders a "doughnut" chart to visually represent a user's score (0-100).
 *   - Dynamically changes color based on thresholds:
 *       - Red for <60
 *       - Yellow for 60-79
 *       - Green for 80+
 *
 * (Rani et al., 2021)
 */

import React from "react";
import { Text, View } from "react-native";
import Svg, { Circle, G } from "react-native-svg";
import ChartStyles from "../../styles/ChartStyles";

// Constants for sizing and geometry
const size = 220; // Overall size of the SVG viewport
const strokeWidth = 20; // Thickness of the doughnut ring
const radius = (size - strokeWidth) / 2; // Radius of the circle
const circumference = 2 * Math.PI * radius; // Circumference for strokeDash calculations

export default function DoughnutChart({ score }) {
  // Set the score between 0 and 100
  const percentage = Math.min(Math.max(score, 0), 100);
  const strokeDashoffset = circumference - (circumference * percentage) / 100;

  // Determine color based on thresholds
  let color = "#F44336"; // Red for low scores
  if (percentage >= 80) color = "#4CAF50"; // Green for high scores
  else if (percentage >= 60) color = "#F9A800"; // Yellow for medium scores

  return (
    <View style={ChartStyles.chartContainer}>
      <Svg width={size} height={size}>
        <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
          {/* Background circle */}
          <Circle
            stroke="#E0E0E0"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
          />
          {/* Foreground stroke showing score */}
          <Circle
            stroke={color}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </G>
        {/* Inner white circle to create doughnut effect */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius - strokeWidth / 2 + 10}
          fill="#fff"
        />
      </Svg>
      {/* Numeric score */}
      <View style={ChartStyles.gauge}>
        <Text
          style={[
            ChartStyles.scoreText,
            { color },
            percentage < 10 && { paddingHorizontal: 10 },
          ]}
        >
          {percentage}
        </Text>
        <Text style={[ChartStyles.outOfText, { color }]}>/100</Text>
      </View>
    </View>
  );
}
