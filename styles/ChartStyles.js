// styles/ChartStyles.js
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
        top: "40%", // center it better vertically
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
