import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

const supabaseUrl = "https://qsimcdqfjlwnskvndpjj.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzaW1jZHFmamx3bnNrdm5kcGpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA2OTcwMjgsImV4cCI6MjEwNjI3MzAyOH0.2G3RF3iPYWKuG_uz-CiEkKoyHoG75HqbRDmk2qgvoek";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});