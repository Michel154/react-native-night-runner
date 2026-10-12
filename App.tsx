import React from "react";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { ThemeProvider, useTheme } from "./src/context/ThemeContext";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";

import StartScreen from "./src/components/StartScreen";
import { Home } from "./src/components/Home";
import { Workouts } from "./src/components/Workouts";
import { Profile } from "./src/components/Profile";
import { AuthProvider, useAuth } from "./src/context/AuthContext";

const Tab = createBottomTabNavigator();

function TabNavigator() {
  const { isLoggedIn } = useAuth();
  const { theme } = useTheme(); 

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        animation: "fade",
        animationDuration: 800,
        tabBarActiveTintColor: theme.accent, 
        tabBarInactiveTintColor: theme.textSecondary, 
        tabBarStyle: [
          styles.tabBar,
          {
            backgroundColor: theme.cardBackground, 
            borderColor: theme.border, 
          },
        ],
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "help-outline";

          if (route.name === "Hem") iconName = "home-outline";
          if (route.name === "Start") iconName = "location-outline";
          if (route.name === "Träning") iconName = "analytics-outline";
          if (route.name === "Profil") {
            iconName = isLoggedIn ? "happy-outline" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Hem">
        {({ navigation }) => (
          <StartScreen onStartRunning={() => navigation.navigate("Start")} />
        )}
      </Tab.Screen>

      <Tab.Screen name="Start" component={Home} />
      <Tab.Screen name="Träning" component={Workouts} />
      <Tab.Screen name="Profil" component={Profile} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <NavigationContainer>
          <TabNavigator />
        </NavigationContainer>
      </ThemeProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 0,
    left: 40,
    right: 40,
    elevation: 0,
    height: 85,
    paddingTop: 10,
    paddingBottom: 0,
    borderWidth: 1, 
    borderRadius: 20, 
  },
});