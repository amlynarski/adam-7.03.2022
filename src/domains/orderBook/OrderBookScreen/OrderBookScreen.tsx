import { useCallback, useContext, useEffect, useMemo } from "react";
import { Button, Text, View } from "react-native";

import { OrderBookSocketContext } from "../contexts/orderBookSocketContext";
import Row from "../components/row";
import { PRICE, TOTAL } from "../types";
import { sortAsc, sortDesc } from "../utils/utils";

const MAX_ELEMENTS = 20;

export const OrderBookScreen = () => {
  const { connect, asksBidsData } = useContext(OrderBookSocketContext);

  useEffect(() => {
    connect();
  }, [connect]);

  useEffect(() => {}, [asksBidsData]);

  const sortedAsks = useMemo(
    () => asksBidsData.asks.sort(sortDesc).slice(-MAX_ELEMENTS),
    [asksBidsData.asks]
  );

  const sortedBids = useMemo(
    () => asksBidsData.bids.sort(sortDesc).slice(0, MAX_ELEMENTS),
    [asksBidsData.bids]
  );

  const maxTotal = useMemo(
    () => Math.max(sortedAsks[0][TOTAL], sortedBids[MAX_ELEMENTS - 1][TOTAL]),
    [sortedAsks, sortedBids]
  );

  const getTotalFillPercentage = useCallback(
    (rowTotal: number) => (maxTotal ? rowTotal / maxTotal : 0),
    [maxTotal]
  );

  // lowest ask most important
  const renderAsks = useCallback(() => {
    return sortedAsks.map((row) => (
      <Row
        key={row[PRICE]}
        rowData={row}
        totalFill={getTotalFillPercentage(row[TOTAL])}
        type="ask"
      />
    ));
  }, [sortedAsks]);

  // highest bids most important
  const renderBids = useCallback(() => {
    return sortedBids.map((row) => (
      <Row
        key={row[PRICE]}
        rowData={row}
        totalFill={getTotalFillPercentage(row[TOTAL])}
        type="bid"
      />
    ));
  }, [sortedBids]);

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
