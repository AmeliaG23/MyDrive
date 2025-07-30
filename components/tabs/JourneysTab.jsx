import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import TabStyles from "../../styles/TabStyles";

const DROPDOWN_OPTIONS = [
  { key: "2mo", label: "2 Months" },
  { key: "6mo", label: "6 Months" },
  { key: "all", label: "All" },
];

function getScoreColor(score) {
  if (score >= 80) return "#4CAF50"; // green
  if (score >= 60) return "#F9A800"; // amber
  return "#F44336"; // red
}

export default function JourneysTab({ journeys, filter, setFilter }) {
  const [dropdownVisible, setDropdownVisible] = useState(false);

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

      {/* Dropdown Modal */}
      <Modal
        transparent
        visible={dropdownVisible}
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <TouchableOpacity
          style={TabStyles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setDropdownVisible(false)}
        >
          <View style={TabStyles.modalContent}>
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
        </TouchableOpacity>
      </Modal>

      {/* No journeys message outside ScrollView */}
      {filteredJourneys.length === 0 ? (
        <View style={TabStyles.noDataContainer}>
          <Text style={TabStyles.noDataText}>No journeys recorded yet.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={TabStyles.container}>
          {filteredJourneys.map((j, i) => (
            <View key={i} style={TabStyles.card}>
              <Text style={TabStyles.cardTitle}>Date: {j.date}</Text>

              {/* Score progress bar */}
              <View style={{ marginVertical: 6 }}>
                <Text style={{ marginBottom: 4, fontWeight: "600" }}>
                  Score: {j.score}/100
                </Text>
                <View style={TabStyles.progressBar}>
                  <View
                    style={[
                      TabStyles.progressFill,
                      {
                        width: `${j.score}%`,
                        backgroundColor: getScoreColor(j.score),
                      },
                    ]}
                  />
                </View>
              </View>

              {/* Duration row with icon */}
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
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
