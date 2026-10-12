import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  StatusBar,
  
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface StartScreenProps {
  onStartRunning: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStartRunning }) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle={"light-content"} />
      
      <ImageBackground
        source={require("../../assets/images/running-cover1.jpg")}
        style={styles.heroImage}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <SafeAreaView style={styles.content}>
            <View style={styles.headerBox}>
              <Text style={styles.badge}>NIGHT RUNNER</Text>
            </View>
            <TouchableOpacity
              style={styles.ctaButton}
              activeOpacity={0.8}
              onPress={onStartRunning}
            >
              <Text style={styles.ctaButtonText}>GET STARTED</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </View>
      </ImageBackground>
    </View>
  );
};

export default StartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  heroImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    paddingHorizontal: 24,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: 40,
    paddingBottom:70,
  },
  headerBox: {
    marginTop: 20,
    alignItems: "center",
  },
  badge: {
    color: "#2e0bf5",
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: 4,
    marginBottom: 8,
    textAlign: "center",
  },
  title: {
    color: "#2e0bf5",
    fontSize: 36,
    fontWeight: "900",
    letterSpacing: -0.5,
    lineHeight: 42,
    textAlign: "center",
  },
  ctaButton: {
    backgroundColor: "#2e0bf5",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
    shadowColor: "#2e0bf5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  ctaButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 1.5,
  },
});
