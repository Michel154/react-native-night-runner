import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Polyline } from "react-native-maps";
import { useIsFocused } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import { getWorkouts, deleteWorkout, SavedWorkout } from "../utils/storage";
import { calculatePace, formatTime } from "../utils/metrics";
import { nightMapStyle, lightMapStyle } from "../utils/mapStyle";
import { useTheme } from "../context/ThemeContext";


const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString; 

  return date.toLocaleDateString("sv-SE", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const Workouts = () => {
  const [workouts, setWorkouts] = useState<SavedWorkout[]>([]);
  const isFocused = useIsFocused();
  const { theme, themeMode } = useTheme();

  const loadWorkouts = () => {
    getWorkouts().then(setWorkouts);
  };

  useEffect(() => {
    if (isFocused) {
      loadWorkouts();
    }
  }, [isFocused]);

  const handleDelete = (id: string) => {
    Alert.alert(
      "Radera pass",
      "Är du säker på att du vill ta bort det här passet?",
      [
        { text: "Avbryt", style: "cancel" },
        {
          text: "Radera",
          style: "destructive",
          onPress: async () => {
            await deleteWorkout(id);
            loadWorkouts();
          },
        },
      ],
    );
  };

  const renderWorkoutCard = ({ item }: { item: SavedWorkout }) => {
    const distanceKm = (item.distanceMeters / 1000).toFixed(2);
    const pace = calculatePace(item.distanceMeters, item.durationSeconds);

    const hasRoute = item.route && item.route.length > 0;

    const initialRegion = hasRoute
      ? {
          latitude: item.route![Math.floor(item.route!.length / 2)].latitude,
          longitude: item.route![Math.floor(item.route!.length / 2)].longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }
      : undefined;

    return (
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.cardBackground,
            borderColor: theme.border,
          },
        ]}
      >
        <View style={styles.cardHeader}>
          <Text style={[styles.date, { color: theme.textSecondary }]}>
            {formatDate(item.date)}
          </Text>
          <TouchableOpacity
            onPress={() => handleDelete(item.id)}
            style={[styles.deleteButton, { backgroundColor: theme.background, borderColor: theme.border }]}
            activeOpacity={0.7}
          >
            <Ionicons name="trash-outline" size={16} color="#4d44ef" />
          </TouchableOpacity>
        </View>

        <View style={[styles.mapContainer, { borderColor: theme.border }]}>
          <MapView
            style={styles.map}
            customMapStyle={themeMode === "dark" ? nightMapStyle : lightMapStyle} 
            userInterfaceStyle={themeMode}
            initialRegion={initialRegion}
            scrollEnabled={false}
            zoomEnabled={false}
          >
            {hasRoute && item.route!.length > 1 && (
              <Polyline
                coordinates={item.route!}
                strokeColor={theme.accent} 
                strokeWidth={4}
              />
            )}
          </MapView>
        </View>

        <View style={styles.metricsRow}>
          <View style={styles.statColumn}>
            <Text style={[styles.mainMetric, { color: theme.accent }]}>
              {distanceKm}
            </Text>
            <Text style={[styles.label, { color: theme.textSecondary }]}>
              km
            </Text>
          </View>

          <View style={styles.statColumn}>
            <Ionicons name="time-outline" size={14} color={theme.accent} />
            <Text style={[styles.subText, { color: theme.textPrimary }]}>
              {formatTime(item.durationSeconds)}
            </Text>
            <Text style={[styles.label, { color: theme.textSecondary }]}>
              tid
            </Text>
          </View>

          <View style={styles.statColumn}>
            <Ionicons
              name="speedometer-outline"
              size={14}
              color={theme.accent}
            />
            <Text style={[styles.subText, { color: theme.textPrimary }]}>
              {pace}
            </Text>
            <Text style={[styles.label, { color: theme.textSecondary }]}>
              min/km
            </Text>
          </View>

          <View style={styles.statColumn}>
            <Ionicons name="footsteps-outline" size={14} color={theme.accent} />
            <Text style={[styles.subText, { color: theme.textPrimary }]}>
              {item.steps || 0}
            </Text>
            <Text style={[styles.label, { color: theme.textSecondary }]}>
              Steg
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <Text style={[styles.title, { color: theme.textPrimary }]}>
        Träningslogg
      </Text>
      <FlatList
        data={workouts}
        keyExtractor={(item) => item.id}
        renderItem={renderWorkoutCard}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            Inga sparade pass ännu.
          </Text>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: {
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  date: { fontSize: 12, fontWeight: "700" },
  deleteButton: {
    padding: 6,
    borderRadius: 8,
    borderColor: "transparent",
  },
  mapContainer: {
    height: 120,
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 12,
    borderWidth: 1,
  },
  map: { flex: 1 },
  metricsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statColumn: {
    flex: 1,
    alignItems: "center",
  },
  mainMetric: { fontSize: 22, fontWeight: "900" },
  label: { fontSize: 9, fontWeight: "700" },
  subText: { fontSize: 13, fontWeight: "600" },
  emptyText: { textAlign: "center", marginTop: 40 },
});