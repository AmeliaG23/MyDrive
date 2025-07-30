import React from "react";
import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { UserProvider } from "../context/UserContext";
import RootNavigator from "../navigation/RootNavigator";

export default function App() {
  return (
    <UserProvider>
      <SafeAreaProvider>
        <StatusBar
          translucent={false} // IMPORTANT: false so bgColor applies
          backgroundColor="#008080" // your teal color
          barStyle="light-content"
        />
        <RootNavigator />
      </SafeAreaProvider>
    </UserProvider>
  );
}
