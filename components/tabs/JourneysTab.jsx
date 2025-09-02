/**
 * JourneysTab.jsx
 * ----------------
 * Created: 01-08-2025
 * Author: Amelia Goldsby
 * Project : A Dual-Focus Redesign of MyDrive: Enhancing Interfaces and Scoring Architecture
 * Course : Major Project, Level 6, QA
 *
 * Purpose:
 *    Tab to display past journeys for the current user.
 *    - Allows journeys to be filtered by time windows
 *    - Displays journeys in a card which navigates to a screen displaying all journey details
 *
 * (Rani et al., 2021)
 */

import { formatDate, getScoreColor } from "@/utils";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import TabStyles from "../../styles/TabStyles";

const DROPDOWN_OPTIONS = [
  { key: "2mo", label: "2 Months" },
  { key: "6mo", label: "6 Months" },
  { key: "all", label: "All" },
];

export default function JourneysTab({ journeys, filter, setFilter }) {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigation = useNavigation();

  // Time-based filtering
  const now = Date.now();
  const filteredJourneys = journeys.filter((j) => {
    const daysAgo = (now - new Date(j.date).getTime()) / (1000 * 3600 * 24);
    if (filter === "2mo") return daysAgo <= 60;
    if (filter === "6mo") return daysAgo <= 180;
    return true;
  });

  const selectedLabel =
    DROPDOWN_OPTIONS.find((o) => o.key === filter)?.label || "All";

  return (
    <View style={{ flex: 1 }}>
      {/* Dropdown shown only if there are journeys */}
      {journeys.length > 0 && (
        <View style={TabStyles.dropdownHeader}>
          <TouchableOpacity
            style={TabStyles.dropdownButton}
            onPress={() => setDropdownVisible(true)}
          >
            <Text style={TabStyles.dropdownButtonText}>{selectedLabel} ▼</Text>
          </TouchableOpacity>
        </View>
      )}
      {/* Modal to allow filter for journeys to be shown */}
      <Modal
        transparent
        visible={dropdownVisible}
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <View style={TabStyles.modalOverlay}>
          <View style={TabStyles.modalContent}>
            <TouchableOpacity
              style={TabStyles.closeButtonContainer}
              onPress={() => setDropdownVisible(false)}
            >
              <MaterialCommunityIcons
                name="close"
                style={TabStyles.closeButtonIcon}
              />
            </TouchableOpacity>
            <FlatList
              data={DROPDOWN_OPTIONS}
              keyExtractor={(item) => item.key}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={TabStyles.modalItem}
                  onPress={() => {
                    setFilter(item.key);
                    setDropdownVisible(false);
                  }}
                >
                  <Text
                    style={[
                      TabStyles.modalItemText,
                      filter === item.key && TabStyles.modalItemTextActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
      {/* No journeys message */}
      {filteredJourneys.length === 0 ? (
        <View style={TabStyles.noDataContainer}>
          <Text style={TabStyles.noDataText}>No journeys recorded yet.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={TabStyles.container}>
          {filteredJourneys.map((j, i) => (
            <TouchableOpacity
              key={i}
              style={TabStyles.card}
              activeOpacity={0.7}
              onPress={() =>
                navigation.navigate("JourneyScreen", { journey: j })
              }
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <MaterialCommunityIcons
                  name="calendar-outline"
                  size={20}
                  color="#333"
                  style={{ marginRight: 6 }}
                />
                <Text style={TabStyles.cardTitle}>{formatDate(j.date)}</Text>
              </View>
              {/* Scores bar */}
              {j.scores?.total !== undefined && (
                <View style={{ marginVertical: 6 }}>
                  <Text style={{ marginBottom: 4, fontWeight: "600" }}>
                    Score: {j.scores.total}/100
                  </Text>
                  <View style={TabStyles.progressBar}>
                    <View
                      style={[
                        TabStyles.progressFill,
                        {
                          width: `${j.scores.total}%`,
                          backgroundColor: getScoreColor(j.scores.total),
                        },
                      ]}
                    />
                  </View>
                </View>
              )}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 5,
                }}
              >
                <MaterialCommunityIcons
                  name="clock-time-four-outline"
                  size={18}
                  color="#333"
                  style={{ marginRight: 5 }}
                />
                <Text style={{ fontSize: 16, color: "#444" }}>
                  {j.length} mins
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
