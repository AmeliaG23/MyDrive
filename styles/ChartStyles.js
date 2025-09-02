/**
 * ChartStyles.js
 * ----------------
 * Created: 29-08-2025
 * Author: Amelia Goldsby
 * Project : A Dual-Focus Redesign of MyDrive: Enhancing Interfaces and Scoring Architecture
 * Course : Major Project, Level 6, QA
 *
 * Purpose:
 *    Stylesheet for the Doughnut Chart
 *
 * (Rani et al., 2021)
 */

import { StyleSheet } from "react-native";

export default StyleSheet.create({
    chartContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 24,
        paddingHorizontal: 12,
    },
    gauge: {
        position: "absolute",
        top: "40%",
        left: 0,
        right: 0,
        alignItems: "center",
        justifyContent: "center",
    },
    scoreText: {
        paddingRight: 40,
        fontSize: 45,
        fontWeight: "bold",
    },
    outOfText: {
        paddingLeft: 45,
        fontSize: 20,
        fontWeight: "600",
    },
});
