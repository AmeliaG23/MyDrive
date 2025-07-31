import React from "react";
import { StatusBar, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { UserProvider } from "../context/UserContext";
import RootNavigator from "../navigation/RootNavigator";

// // Component responsible for managing location & driving tracking lifecycle
// function TrackingManager() {
//   // Get current user info from context
//   const { user } = useContext(UserContext);

//   useEffect(() => {
//     // If no logged-in user, warn and skip tracking
//     if (!user?.username) {
//       console.warn("No user logged in, tracking will not start");
//       return;
//     }

//     let isMounted = true; // flag to prevent state updates after unmount

//     (async () => {
//       try {
//         // Start tracking with the user's username as an identifier
//         await startTracking(user.username);
//       } catch (e) {
//         // Log any error starting the tracking service
//         console.error("Failed to start tracking:", e);
//       }
//     })();

//     // Cleanup function on component unmount or username change
//     return () => {
//       if (isMounted) {
//         // Stop tracking when component unmounts or user changes
//         stopTracking(user.username);
//       }
//       isMounted = false;
//     };
//   }, [user?.username]); // Effect re-runs only when username changes

//   // This component renders nothing visible
//   return null;
// }

// Main app component wraps app in providers and renders navigation + tracking manager
export default function App() {
  return (
    <UserProvider>
      <SafeAreaProvider>
        {/* Root container view */}
        <View style={{ flex: 1, backgroundColor: "#008080" }}>
          {/* Configure status bar appearance */}
          <StatusBar
            translucent
            backgroundColor="transparent"
            barStyle="light-content"
          />
          {/* Render the main app navigation */}
          <RootNavigator />
          {/* Initialize and manage tracking lifecycle */}
          {/* <TrackingManager /> */}
        </View>
      </SafeAreaProvider>
    </UserProvider>
  );
}
