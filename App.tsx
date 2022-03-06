import React from "react";
import { SafeAreaView } from "react-native";

import { OrderBookSocketContextProvider } from "./src/domains/orderBook/contexts/orderBookSocketContext";
import OrderBookScreen from "./src/domains/orderBook/OrderBookScreen";

import styles from "./App.styles";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <OrderBookSocketContextProvider>
        <OrderBookScreen />
      </OrderBookSocketContextProvider>
    </SafeAreaView>
  );
}
