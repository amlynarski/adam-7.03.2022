import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  totalFill: {
    position: "absolute",
    height: "100%",
  },
  ask: {
    backgroundColor: "rgba(255,0,0,0.5)",
  },
  bid: {
    backgroundColor: "rgba(0,255,0,0.5)",
  },
});

export default styles;
