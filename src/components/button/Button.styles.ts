import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  buttonContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "rgb(87,57,217)",
    paddingVertical: 8,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
  },
  text: {
    color: "white",
  },
  buttonPressed: {
    backgroundColor: "rgba(87,57,217, 0.6)",
  },
});

export default styles;
