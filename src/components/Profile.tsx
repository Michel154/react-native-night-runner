import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  DimensionValue,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useIsFocused } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { getWorkouts, SavedWorkout } from "../utils/storage";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";


const calculateWeeklyKm = (workouts: SavedWorkout[]): number[] => {
  const kmPerDay = [0, 0, 0, 0, 0, 0, 0];
  const now = new Date();

  const dayOfWeek = now.getDay();
  const distanceToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  const monday = new Date(now);
  monday.setDate(now.getDate() - distanceToMonday);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  workouts.forEach((w) => {
    if (!w.date) return;
    const workoutDate = new Date(w.date);

    if (workoutDate >= monday && workoutDate <= sunday) {
      let dayIndex = workoutDate.getDay() - 1;
      if (dayIndex === -1) dayIndex = 6;

      const km = (Number(w.distanceMeters) || 0) / 1000;
      kmPerDay[dayIndex] += km;
    }
  });

  return kmPerDay.map((val) => Number(val.toFixed(1)));
};

const calculateMonthlyWorkoutsCount = (workouts: SavedWorkout[]): number => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  return workouts.filter((w) => {
    if (!w.date) return false;
    const d = new Date(w.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  }).length;
};

const calculateWeeklyAverageKm = (workouts: SavedWorkout[]): string => {
  if (workouts.length === 0) return "0.0";

  const dates = workouts.map((w) => new Date(w.date).getTime()).filter((t) => !isNaN(t));
  if (dates.length === 0) return "0.0";

  const oldestDate = new Date(Math.min(...dates));
  const now = new Date();

  const diffInDays = Math.max(1, (now.getTime() - oldestDate.getTime()) / (1000 * 3600 * 24));
  const totalWeeks = Math.max(1, diffInDays / 7);

  const totalMeters = workouts.reduce((sum, w) => sum + (Number(w.distanceMeters) || 0), 0);
  const totalKm = totalMeters / 1000;

  return (totalKm / totalWeeks).toFixed(1);
};


const WeeklyBarChart = ({ data }: { data: number[] }) => {
  const { theme } = useTheme();
  const maxVal = Math.max(...data, 1);
  const days = ["M", "T", "O", "T", "F", "L", "S"];

  return (
    <View style={chartStyles.container}>
      {data.map((val, idx) => {
        const heightPercent: DimensionValue = `${(val / maxVal) * 100}%`;
        return (
          <View key={idx} style={chartStyles.column}>
            <Text style={[chartStyles.valText, { color: theme.textSecondary }]}>
              {val > 0 ? val : ""}
            </Text>
            <View style={[chartStyles.barTrack, { backgroundColor: theme.border }]}>
              <View
                style={[
                  chartStyles.barFill,
                  { height: heightPercent, backgroundColor: theme.accent },
                ]}
              />
            </View>
            <Text style={[chartStyles.dayText, { color: theme.textSecondary }]}>
              {days[idx]}
            </Text>
          </View>
        );
      })}
    </View>
  );
};


export const Profile = () => {
  const { user, login, signup, logout } = useAuth();
  const { theme, themeMode, toggleTheme } = useTheme();
  const [workouts, setWorkouts] = useState<SavedWorkout[]>([]);
  const isFocused = useIsFocused();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (isFocused && user) {
      getWorkouts().then(setWorkouts);
    }
  }, [isFocused, user]);

  
  const totalMeters = workouts.reduce((sum, w) => sum + (Number(w.distanceMeters) || 0), 0);
  const totalKm = (totalMeters / 1000).toFixed(1);
  const totalSec = workouts.reduce((sum, w) => sum + (Number(w.durationSeconds) || 0), 0);
  const totalHours = (totalSec / 3600).toFixed(1);

  const monthlyCount = calculateMonthlyWorkoutsCount(workouts);
  const avgKmPerWeek = calculateWeeklyAverageKm(workouts);
  const weeklyData = calculateWeeklyKm(workouts);

  const handleLogin = async () => {
    setErrorMsg("");
    const err = await login(email, password);
    if (err) setErrorMsg(err);
  };

  const handleSignup = async () => {
    setErrorMsg("");
    const err = await signup(email, password);
    if (err) setErrorMsg(err);
  };

  
  const renderThemeSwitch = () => (
    <View style={styles.themeSwitchContainer}>
      <Ionicons
        name="sunny-outline"
        size={16}
        color={themeMode === "light" ? theme.accent : theme.textSecondary}
      />
      <Switch
        value={themeMode === "dark"}
        onValueChange={toggleTheme}
        trackColor={{ false: theme.border, true: theme.accent }}
        thumbColor="#ffffff"
        style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
      />
      <Ionicons
        name="moon-outline"
        size={16}
        color={themeMode === "dark" ? theme.accent : theme.textSecondary}
      />
    </View>
  );

  
  if (!user) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.headerRow}>
          <Text style={[styles.title, { color: theme.textPrimary }]}>Logga in</Text>
          {renderThemeSwitch()}
        </View>

        <View style={[styles.form, { marginTop: 20 }]}>
          {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.cardBackground,
                borderColor: theme.border,
                color: theme.textPrimary,
              },
            ]}
            placeholder="E-post"
            placeholderTextColor={theme.textSecondary}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.cardBackground,
                borderColor: theme.border,
                color: theme.textPrimary,
              },
            ]}
            placeholder="Lösenord"
            placeholderTextColor={theme.textSecondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.primaryBtn, { backgroundColor: theme.accent }]}
            onPress={handleLogin}
          >
            <Text style={styles.btnText}>LOGGA IN</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryBtn} onPress={handleSignup}>
            <Text style={[styles.secondaryBtnText, { color: theme.textSecondary }]}>
              SKAPA KONTO
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Text style={[styles.title, { color: theme.textPrimary }]}>Profil & Statistik</Text>
          {renderThemeSwitch()}
        </View>

        
        <View style={styles.subHeaderRow}>
          <TouchableOpacity onPress={logout} style={styles.logoutBtn} activeOpacity={0.7}>
            <Text style={styles.logoutText}>Logga ut</Text>
          </TouchableOpacity>
        </View>

        
        <View style={[styles.statsGrid, { marginTop: 10 }]}>
          <View style={styles.rowStats}>
            <View
              style={[
                styles.statBox,
                {
                  backgroundColor: theme.cardBackground,
                  borderColor: theme.border,
                  flex: 1,
                },
              ]}
            >
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>TOTAL DISTANS</Text>
              <Text style={[styles.statValue, { color: theme.accent }]}>{totalKm} KM</Text>
            </View>

            <View
              style={[
                styles.statBox,
                {
                  backgroundColor: theme.cardBackground,
                  borderColor: theme.border,
                  flex: 1,
                },
              ]}
            >
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>SNITT / VECKA</Text>
              <Text style={[styles.statValue, { color: theme.accent }]}>{avgKmPerWeek} KM</Text>
            </View>
          </View>

          <View style={styles.rowStats}>
            <View
              style={[
                styles.statBox,
                {
                  backgroundColor: theme.cardBackground,
                  borderColor: theme.border,
                  flex: 1,
                },
              ]}
            >
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>PASS DENNA MÅNAD</Text>
              <Text style={[styles.smallStatValue, { color: theme.textPrimary }]}>
                {monthlyCount} st
              </Text>
            </View>

            <View
              style={[
                styles.statBox,
                {
                  backgroundColor: theme.cardBackground,
                  borderColor: theme.border,
                  flex: 1,
                },
              ]}
            >
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>TOTAL TID</Text>
              <Text style={[styles.smallStatValue, { color: theme.textPrimary }]}>
                {totalHours} tim
              </Text>
            </View>
          </View>
        </View>

        {/* Veckodiagram */}
        <View
          style={[
            styles.chartCard,
            { backgroundColor: theme.cardBackground, borderColor: theme.border },
          ]}
        >
          <Text style={[styles.chartTitle, { color: theme.textSecondary }]}>
            DISTANS DENNA VECKA (KM)
          </Text>
          <WeeklyBarChart data={weeklyData} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 40, 
  },
  title: { fontSize: 24, fontWeight: "900" },
  subHeaderRow: {
    marginTop: 4,
    marginBottom: 16,
  },
  logoutBtn: { alignSelf: "flex-start", paddingVertical: 2, paddingHorizontal: 0 },
  logoutText: { color: "#ef4444", fontWeight: "700", fontSize: 13 },
  themeSwitchContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statsGrid: { gap: 12 },
  rowStats: { flexDirection: "row", gap: 12 },
  statBox: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
  },
  statLabel: { fontSize: 11, fontWeight: "700" },
  statValue: { fontSize: 26, fontWeight: "900", marginTop: 4 },
  smallStatValue: { fontSize: 22, fontWeight: "900", marginTop: 4 },
  form: { gap: 12 },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  primaryBtn: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  btnText: { color: "#ffffff", fontWeight: "900", letterSpacing: 1 },
  secondaryBtn: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  secondaryBtnText: { fontWeight: "700" },
  errorText: { color: "#ef4444", fontSize: 14, marginBottom: 4 },
  chartCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 16,
    marginBottom: 20,
  },
  chartTitle: { fontSize: 12, fontWeight: "700", marginBottom: 16 },
});

const chartStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 130,
    paddingTop: 10,
  },
  column: { alignItems: "center", flex: 1, height: "100%" },
  valText: { fontSize: 10, fontWeight: "600", marginBottom: 4, height: 14 },
  barTrack: {
    flex: 1,
    width: 14,
    borderRadius: 7,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  barFill: {
    width: "100%",
    borderRadius: 7,
  },
  dayText: { fontSize: 12, marginTop: 8, fontWeight: "700" },
});