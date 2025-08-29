import React, { useEffect /*, useContext */ } from "react";
import { StatusBar, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { UserProvider /*, UserContext */ } from "../context/UserContext";
import RootNavigator from "../navigation/RootNavigator";

// Import your sample data helpers
import { addSampleData, testUsersExist } from "../utils/database";

// NOTE: Tracking code is commented out because it won't work in Expo Go.
// Uncomment when using a physical device with a custom dev build or production build.
// import { startTracking, stopTracking } from "../utils/tracking";

/* -------------------------------------------------------------------------- */
/* TrackingManager: manages background location tracking for logged-in users. */
/* Uncomment this block when running on a physical device outside Expo Go.    */
/*
function TrackingManager() {
  // Get current user info from context
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (!user?.username) {
      console.warn("No user logged in, tracking will not start");
      return;
    }

    let isMounted = true;

    (async () => {
      try {
        await startTracking(user.username);
      } catch (e) {
        console.error("Failed to start tracking:", e);
      }
    })();

    return () => {
      if (isMounted) {
        stopTracking(user.username);
      }
      isMounted = false;
    };
  }, [user?.username]);

  return null;
}
*/

export default function App() {
  useEffect(() => {
    const init = async () => {
      try {
        const exists = await testUsersExist();
        if (!exists) {
          await addSampleData();
        } else {
        }
      } catch (err) {
        console.error("Error initializing sample data:", err);
      }
    };

    init();
  }, []);

  return (
    <UserProvider>
      <SafeAreaProvider>
        <View style={{ flex: 1, backgroundColor: "#008080" }}>
          <StatusBar
            translucent
            backgroundColor="transparent"
            barStyle="light-content"
          />
          <RootNavigator />
          {/* 
            Initialize and manage tracking lifecycle. 
            NOTE: Uncomment <TrackingManager /> when running on a physical device 
            with a custom dev client or production build.
          */}
          {/* <TrackingManager /> */}
        </View>
      </SafeAreaProvider>
    </UserProvider>
  );
}
