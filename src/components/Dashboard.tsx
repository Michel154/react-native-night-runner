import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { formatTime, calculatePace } from "../utils/metrics";
import { useTheme } from "../context/ThemeContext";

interface DashboardProps {
  distanceMeters: number;
  steps: number;
  timeSeconds: number;
}

export const Dashboard: React.FC<DashboardProps> = ({
  distanceMeters,
  steps,
  timeSeconds,
}) => {
  const { theme } = useTheme();
  const distanceKm = (distanceMeters / 1000).toFixed(2);
  const pace = calculatePace(distanceMeters, timeSeconds);

  return (
    <View style={styles.container}>
      
      <View style={styles.topSection}>
        <View style={styles.labelRow}>
          <Ionicons name="location-outline" size={16} color={theme.accent} />
          <Text style={[styles.label, { color: theme.textSecondary }]}>DISTANS</Text>
        </View>
        <Text style={[styles.distanceValue, { color: theme.textPrimary }]}>
          {distanceKm} <Text style={[styles.unit, { color: theme.accent }]}>KM</Text>
        </Text>
      </View>

      <View style={[styles.divider, { backgroundColor: theme.border }]} />

      
      <View style={styles.bottomRow}>
        <View style={styles.column}>
          <View style={styles.labelRow}>
            <Ionicons name="time-outline" size={15} color={theme.textSecondary} />
            <Text style={[styles.label, { color: theme.textSecondary }]}>TID</Text>
          </View>
          <Text style={[styles.subValue, { color: theme.textPrimary }]}>
            {formatTime(timeSeconds)}
          </Text>
        </View>

        <View style={[styles.verticalDivider, { backgroundColor: theme.border }]} />

        <View style={styles.column}>
          <View style={styles.labelRow}>
            <Ionicons name="speedometer-outline" size={15} color={theme.textSecondary} />
            <Text style={[styles.label, { color: theme.textSecondary }]}>TEMPO</Text>
          </View>
          <Text style={[styles.subValue, { color: theme.textPrimary }]}>
            {pace} <Text style={[styles.subUnit, { color: theme.textSecondary }]}>/KM</Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    paddingVertical: 20,
  },
  topSection: {
    alignItems: "center",
    paddingBottom: 30,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 30,
  },
  column: {
    flex: 1,
    alignItems: "center",
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2,
  },
  distanceValue: {
    fontSize: 64,
    fontWeight: "900",
    fontVariant: ["tabular-nums"],
  },
  subValue: {
    fontSize: 34,
    fontWeight: "800",
    fontVariant: ["tabular-nums"],
  },
  unit: {
    fontSize: 24,
    fontWeight: "800",
  },
  subUnit: {
    fontSize: 16,
    fontWeight: "700",
  },
  divider: {
    height: 1,
    width: "100%",
  },
  verticalDivider: {
    width: 1,
    height: "70%",
    alignSelf: "center",
  },
});