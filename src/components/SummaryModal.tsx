import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Polyline } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { Coordinate, formatTime, calculatePace } from "../utils/metrics";
import { nightMapStyle, lightMapStyle } from "../utils/mapStyle";
import { useTheme } from "../context/ThemeContext";

interface SummaryModalProps {
  visible: boolean;
  distanceMeters: number;
  steps: number;
  timeSeconds: number;
  route: Coordinate[];
  onSave: () => void;
  onDelete: () => void;
}

export const SummaryModal: React.FC<SummaryModalProps> = ({
  visible,
  distanceMeters,
  steps,
  timeSeconds,
  route,
  onSave,
  onDelete,
}) => {
  const { theme, themeMode } = useTheme();
  const distanceKm = (distanceMeters / 1000).toFixed(2);
  const pace = calculatePace(distanceMeters, timeSeconds);

  const initialRegion =
    route && route.length > 0
      ? {
          latitude: route[Math.floor(route.length / 2)].latitude,
          longitude: route[Math.floor(route.length / 2)].longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }
      : {
          latitude: 59.3293,
          longitude: 18.0686,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
    >
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.textPrimary }]}>
            PASS SLUTFÖRT
          </Text>

          <TouchableOpacity
            onPress={onDelete}
            style={[
              styles.deleteButton,
              {
                backgroundColor: theme.cardBackground,
                borderColor: theme.border,
              },
            ]}
            activeOpacity={0.7}
          >
            <Ionicons name="trash-outline" size={22} color="#4d44ef" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Kartvy */}
          <View style={[styles.mapContainer, { borderColor: theme.border }]}>
            <MapView
              style={styles.map}
              customMapStyle={
                themeMode === "dark" ? nightMapStyle : lightMapStyle
              }
              userInterfaceStyle={themeMode}
              initialRegion={initialRegion}
              scrollEnabled={false}
              zoomEnabled={false}
            >
              {route.length > 0 && (
                <Polyline
                  coordinates={route}
                  strokeColor={theme.accent}
                  strokeWidth={5}
                />
              )}
            </MapView>
          </View>

          <View
            style={[
              styles.mainMetricCard,
              {
                backgroundColor: theme.cardBackground,
                borderColor: theme.border,
              },
            ]}
          >
            <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>
              TOTAL DISTANS
            </Text>
            <Text style={[styles.mainValue, { color: theme.accent }]}>
              {distanceKm} <Text style={styles.unit}>KM</Text>
            </Text>
          </View>

          <View style={styles.statsGrid}>
            <View
              style={[
                styles.statBox,
                {
                  backgroundColor: theme.cardBackground,
                  borderColor: theme.border,
                },
              ]}
            >
              <Ionicons name="time-outline" size={24} color={theme.accent} />
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                TID
              </Text>
              <Text style={[styles.statValue, { color: theme.textPrimary }]}>
                {formatTime(timeSeconds)}
              </Text>
            </View>

            <View
              style={[
                styles.statBox,
                {
                  backgroundColor: theme.cardBackground,
                  borderColor: theme.border,
                },
              ]}
            >
              <Ionicons
                name="speedometer-outline"
                size={24}
                color={theme.accent}
              />
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                TEMPO
              </Text>
              <Text style={[styles.statValue, { color: theme.textPrimary }]}>
                {pace} /km
              </Text>
            </View>

            <View
              style={[
                styles.statBox,
                {
                  backgroundColor: theme.cardBackground,
                  borderColor: theme.border,
                },
              ]}
            >
              <Ionicons
                name="footsteps-outline"
                size={24}
                color={theme.accent}
              />
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                STEG
              </Text>
              <Text style={[styles.statValue, { color: theme.textPrimary }]}>
                {steps}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: theme.accent }]}
            onPress={onSave}
            activeOpacity={0.8}
          >
            <Text style={styles.saveButtonText}>SPARA PASS</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 1.5,
  },
  deleteButton: {
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    padding: 24,
    alignItems: "center",
  },
  mapContainer: {
    width: "100%",
    height: 220,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    marginBottom: 20,
  },
  map: {
    flex: 1,
  },
  mainMetricCard: {
    width: "100%",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 1,
    marginBottom: 16,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  mainValue: {
    fontSize: 44,
    fontWeight: "900",
    marginTop: 4,
  },
  unit: {
    fontSize: 20,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 30,
    gap: 10,
  },
  statBox: {
    flex: 1,
    padding: 16,
    borderRadius: 18,
    alignItems: "center",
    borderWidth: 1,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: "700",
    marginTop: 6,
  },
  statValue: {
    fontSize: 15,
    fontWeight: "800",
    marginTop: 2,
  },
  saveButton: {
    width: "100%",
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#ffffff",
    fontWeight: "900",
    fontSize: 16,
    letterSpacing: 1.5,
  },
});
