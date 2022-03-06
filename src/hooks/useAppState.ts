import { useEffect, useRef, useState } from "react";
import { AppState, AppStateStatus } from "react-native";

// add new status to follow background changes
type AppStateStatusExtended = AppStateStatus | "re-active";

/**
 * copy of https://github.com/react-native-community/hooks/blob/master/src/useAppState.ts
 * with custom extension
 * */
export const useAppState = () => {
  const currentState = useRef(AppState.currentState);
  const [appState, setAppState] = useState<AppStateStatusExtended>(
    currentState.current
  );

  useEffect(() => {
    function onChange(newState: AppStateStatus) {
      if (
        currentState.current.match(/inactive|background/) &&
        newState === "active"
      ) {
        console.log("set reactive");
        setAppState("re-active");
      } else {
        setAppState(newState);
      }
      currentState.current = newState;
    }

    const subscription = AppState.addEventListener("change", onChange);

    return () => {
      // @ts-expect-error - React Native >= 0.65
      if (typeof subscription?.remove === "function") {
        // @ts-expect-error - need update @types/react-native@0.65.x
        subscription.remove();
      } else {
        // React Native < 0.65
        AppState.removeEventListener("change", onChange);
      }
    };
  }, []);

  return appState;
};

export { AppStateStatus };
