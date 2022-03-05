import { useContext, useEffect } from "react";
import { View } from "react-native";

import { OrderBookSocketContext } from "../contexts/orderBookSocketContext";

export const OrderBookScreen = () => {
  const { connect } = useContext(OrderBookSocketContext);

  useEffect(() => {
    connect();
  }, [connect]);

  return <View />;
};
