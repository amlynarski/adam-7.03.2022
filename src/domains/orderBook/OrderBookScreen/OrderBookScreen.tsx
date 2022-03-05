import { useCallback, useContext, useEffect } from "react";
import { Button, Text, View } from "react-native";

import { OrderBookSocketContext } from "../contexts/orderBookSocketContext";
import Row from "../components/row";
import { PRICE } from "../types";
import { sortAsc, sortDesc } from "../utils/utils";

const MAX_ELEMENTS = 20;

export const OrderBookScreen = () => {
  const { connect, asksBidsData } = useContext(OrderBookSocketContext);

  useEffect(() => {
    connect();
  }, [connect]);

  // lowest ask most important
  const renderAsks = useCallback(() => {
    return asksBidsData.asks
      .sort(sortDesc)
      .slice(-MAX_ELEMENTS)
      .map((row) => <Row key={row[PRICE]} rowData={row} />);
  }, [asksBidsData.asks]);

  // highest bids most important
  const renderBids = useCallback(() => {
    return asksBidsData.bids
      .sort(sortDesc)
      .slice(0, MAX_ELEMENTS)
      .map((row) => <Row key={row[PRICE]} rowData={row} />);
  }, [asksBidsData.bids]);

  const handleClick = () => {
    console.log("asks", asksBidsData.asks.sort(sortAsc)[0]);
    console.log("bids", asksBidsData.bids.sort(sortDesc)[0]);
  };

  // todo bottom and top paddings from library
  return (
    <View>
      <Text>Order Book</Text>
      {renderAsks()}
      <Text>----</Text>
      {renderBids()}
      <Button title={"check"} onPress={handleClick} />
    </View>
  );
};
