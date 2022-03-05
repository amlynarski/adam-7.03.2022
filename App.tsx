import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

import { OrderBookSocketContextProvider } from "./src/domains/orderBook/contexts/orderBookSocketContext";
import OrderBookScreen from "./src/domains/orderBook/OrderBookScreen";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default function App() {
  return (
    <OrderBookSocketContextProvider>
      <OrderBookScreen />
      <View style={styles.container} testID="App-container">
        <Text>Open up App.js to start working on your app!</Text>
        <StatusBar />
      </View>
    </OrderBookSocketContextProvider>
  );
}