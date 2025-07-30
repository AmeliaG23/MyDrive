import React, { useEffect } from "react";
import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { UserProvider } from "../context/UserContext";
import RootNavigator from "../navigation/RootNavigator";
import { addSampleData } from "../utils"; // make sure the path is correct

export default function App() {
  useEffect(() => {
    const initializeAppData = async () => {
      try {
        await addSampleData();
      } catch (error) {
        console.error("Failed to initialize sample data:", error);
      }
    };

    initializeAppData();
  }, []);

  return (
    <UserProvider>
      <SafeAreaProvider>
        <StatusBar
          translucent={false}
          backgroundColor="#008080"
          barStyle="light-content"
        />
        <RootNavigator />
      </SafeAreaProvider>
    </UserProvider>
  );
}
