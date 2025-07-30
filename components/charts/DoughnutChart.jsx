// components/charts/DoughnutChart.jsx
import React from "react";
import { View, Text } from "react-native";
import Svg, { Circle, G } from "react-native-svg";
import HomeStyles from "../../styles/HomeStyles";

const size = 220;
const strokeWidth = 20;
const radius = (size - strokeWidth) / 2;
const circumference = 2 * Math.PI * radius;

export default function DoughnutChart({ score }) {
  const percentage = Math.min(Math.max(score, 0), 100);
  const strokeDashoffset = circumference - (circumference * percentage) / 100;

  let color = "#F44336"; // red
  if (percentage >= 80) color = "#4CAF50"; // green
  else if (percentage >= 60) color = "#F9A800"; // yellow

  return (
    <View style={HomeStyles.chartContainer}>
      <Svg width={size} height={size}>
        <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
          {/* Background Circle */}
          <Circle
            stroke="#E0E0E0"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
          />
          {/* Progress Circle */}
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
        {/* White inner circle to cover stroke edges */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius - strokeWidth / 2 + 10}
          fill="#fff"
        />
      </Svg>
      <View style={HomeStyles.gauge}>
        <Text style={[HomeStyles.scoreText, { color }]}>{percentage}</Text>
        <Text style={[HomeStyles.outOfText, { color }]}>/100</Text>
      </View>
    </View>
  );
}
