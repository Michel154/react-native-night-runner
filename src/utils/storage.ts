import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "./supabase";
import { Coordinate } from "./metrics";

export interface SavedWorkout {
  id: string;
  distanceMeters: number;
  durationSeconds: number;
  date: string;
  steps?: number;
  route?: Coordinate[];
}

const STORAGE_KEY = "@saved_workouts";


export const getWorkouts = async (): Promise<SavedWorkout[]> => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData?.session?.user;

    if (user) {
      const { data, error } = await supabase
        .from("workouts")
        .select("*")
        .order("date", { ascending: false });

      if (error) {
        console.error("Supabase-fel vid hämtning:", error);
      } else if (data) {
        return data.map((w) => ({
          id: w.id,
          distanceMeters: Number(w.distance_meters),
          durationSeconds: Number(w.duration_seconds),
          date: w.date,
          steps: Number(w.steps || 0),
          route: w.route || [],
        }));
      }
    }

    
    const local = await AsyncStorage.getItem(STORAGE_KEY);
    return local ? JSON.parse(local) : [];
  } catch (err) {
    console.error("Fel vid hämtning av pass:", err);
    return [];
  }
};


export const saveWorkout = async (workout: Omit<SavedWorkout, "id">) => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData?.session?.user;

    if (user) {
      const { error } = await supabase.from("workouts").insert({
        user_id: user.id,
        distance_meters: workout.distanceMeters,
        duration_seconds: workout.durationSeconds,
        steps: workout.steps || 0,
        route: workout.route || [],
        date: workout.date || new Date().toISOString(),
      });

      if (error) {
        console.error("Fel vid sparning till Supabase:", error);
        throw error;
      }
    } else {
      
      const existing = await getWorkouts();
      const newWorkout = { ...workout, id: Date.now().toString() };
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([newWorkout, ...existing]),
      );
    }
  } catch (err) {
    console.error("Fel vid sparning av pass:", err);
    throw err;
  }
};

export const deleteWorkout = async (id: string): Promise<void> => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData?.session?.user;

    if (user) {
      const { error } = await supabase.from("workouts").delete().eq("id", id);

      if (error) {
        console.error("Supabase-fel vid borttagning:", error);
        throw error;
      }
    } else {
      const existing = await getWorkouts();
      const updated = existing.filter((w) => w.id !== id);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  } catch (err) {
    console.error("Fel vid radering av pass:", err);
    throw err;
  }
};
