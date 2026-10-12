import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView from "react-native-maps";
import { useKeepAwake } from "expo-keep-awake";
import * as Location from "expo-location";
import { Pedometer } from "expo-sensors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

import { Dashboard } from "./Dashboard";
import { Coordinate, calculateDistance } from "../utils/metrics";
import { nightMapStyle, lightMapStyle } from "../utils/mapStyle";
import { saveWorkout } from "../utils/storage";
import { SummaryModal } from "../components/SummaryModal";
import { useTheme } from "../context/ThemeContext";

export const Home = () => {
  const navigation = useNavigation<any>();
  const { theme, themeMode } = useTheme();
  useKeepAwake();

  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [route, setRoute] = useState<Coordinate[]>([]);
  const [steps, setSteps] = useState<number>(0);
  const [timeSeconds, setTimeSeconds] = useState<number>(0);
  const [distanceMeters, setDistanceMeters] = useState<number>(0);

  const [showSummary, setShowSummary] = useState<boolean>(false);
  const [summaryData, setSummaryData] = useState({
    distanceMeters: 0,
    steps: 0,
    timeSeconds: 0,
    route: [] as Coordinate[],
  });

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isTracking) {
      interval = setInterval(() => setTimeSeconds((prev) => prev + 1), 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTracking]);

  useEffect(() => {
    let locationSub: Location.LocationSubscription | null = null;
    let pedometerSub: Pedometer.Subscription | null = null;

    if (isTracking) {
      (async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Behörighet saknas",
            "Platstjänster behövs för att spåra löpningen.",
          );
          return;
        }

        locationSub = await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.High, distanceInterval: 3 },
          (location) => {
            const newPoint: Coordinate = {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            };

            setRoute((prevRoute) => {
              if (prevRoute.length > 0) {
                const lastPoint = prevRoute[prevRoute.length - 1];
                const addedDistance = calculateDistance(lastPoint, newPoint);
                setDistanceMeters((prevDist) => prevDist + addedDistance);
              }
              return [...prevRoute, newPoint];
            });
          },
        );
      })();

      const currentBase = steps;
      pedometerSub = Pedometer.watchStepCount((result) => {
        setSteps(currentBase + result.steps);
      });
    }

    return () => {
      if (locationSub) locationSub.remove();
      if (pedometerSub) pedometerSub.remove();
    };
  }, [isTracking]);

  const handleStart = () => {
    setHasStarted(true);
    setIsTracking(true);
  };

  const handleFinishPrompt = () => {
    setIsTracking(false);
    setSummaryData({ distanceMeters, steps, timeSeconds, route });
    setShowSummary(true);
  };

  const resetRun = () => {
    setShowSummary(false);
    setHasStarted(false);
    setIsTracking(false);
    setRoute([]);
    setSteps(0);
    setTimeSeconds(0);
    setDistanceMeters(0);
  };

  const handleSaveRun = async () => {
    try {
      await saveWorkout({
        date: new Date().toISOString(),
        distanceMeters: summaryData.distanceMeters,
        durationSeconds: summaryData.timeSeconds,
        steps: summaryData.steps,
        route: summaryData.route,
      });

      resetRun();

      navigation.navigate("Träning");
    } catch (error) {
      console.error("Kunde inte spara:", error);
      Alert.alert("Fel", "Ett fel uppstod när passet skulle sparas.");
    }
  };

  const handleDeleteRun = () => {
    resetRun();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <MapView
        key={themeMode}
        style={styles.map}
        showsUserLocation
        followsUserLocation
        customMapStyle={themeMode === "dark" ? nightMapStyle : lightMapStyle}
        userInterfaceStyle={themeMode}
      />

      <SafeAreaView style={styles.startOverlay} pointerEvents="box-none">
        <TouchableOpacity
          onPress={handleStart}
          activeOpacity={0.8}
          style={[
            styles.startButton,
            { backgroundColor: theme.accent, shadowColor: theme.accent },
          ]}
        >
          <Text style={styles.buttonText}>STARTA PASS</Text>
        </TouchableOpacity>
      </SafeAreaView>

      <Modal
        visible={hasStarted && !showSummary}
        animationType="slide"
        transparent={false}
      >
        <SafeAreaView
          style={[
            styles.fullScreenContainer,
            { backgroundColor: theme.background },
          ]}
        >
          <View style={styles.headerBox}>
            <Text style={[styles.badge, { color: theme.accent }]}>
              PASS PÅGÅR
            </Text>
          </View>

          <View style={styles.dashboardContainer}>
            <Dashboard
              distanceMeters={distanceMeters}
              steps={steps}
              timeSeconds={timeSeconds}
            />
          </View>

          <View style={styles.controlsRow}>
            {isTracking ? (
              <TouchableOpacity
                onPress={() => setIsTracking(false)}
                activeOpacity={0.8}
                style={[styles.roundIcon, styles.pauseColor]}
              >
                <Ionicons name="pause" size={32} color="#ffffff" />
              </TouchableOpacity>
            ) : (
              <View style={styles.rowContainer}>
                <TouchableOpacity
                  onPress={() => setIsTracking(true)}
                  activeOpacity={0.8}
                  style={[styles.roundIcon, styles.playColor]}
                >
                  <Ionicons name="play" size={30} color="#000000" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleFinishPrompt}
                  activeOpacity={0.8}
                  style={[styles.roundIcon, styles.finishColor]}
                >
                  <Ionicons name="checkmark" size={34} color="#ffffff" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </SafeAreaView>
      </Modal>

      <SummaryModal
        visible={showSummary}
        distanceMeters={summaryData.distanceMeters}
        steps={summaryData.steps}
        timeSeconds={summaryData.timeSeconds}
        route={summaryData.route}
        onSave={handleSaveRun}
        onDelete={handleDeleteRun}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  startOverlay: {
    position: "absolute",
    bottom: 0,
    left: 24,
    right: 24,
    justifyContent: "flex-end",
    paddingBottom: 70,
  },
  startButton: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 40,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "900",
    fontSize: 16,
    letterSpacing: 1.5,
  },
  fullScreenContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between",
    paddingBottom: 40,
  },
  headerBox: {
    marginTop: 20,
    alignItems: "center",
  },
  badge: {
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 3,
  },
  dashboardContainer: {
    flex: 1,
    justifyContent: "center",
  },
  controlsRow: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    alignItems: "center",
  },
  roundIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  pauseColor: {
    backgroundColor: "#3b82f6",
  },
  playColor: {
    backgroundColor: "#22c55e",
  },
  finishColor: {
    backgroundColor: "#ef4444",
  },
});
