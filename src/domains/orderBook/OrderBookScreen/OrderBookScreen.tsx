import { useCallback, useContext, useEffect, useMemo } from "react";
import { Button, Text, View } from "react-native";

import { OrderBookSocketContext } from "../contexts/orderBookSocketContext";
import Row from "../components/row";
import { PRICE, TOTAL } from "../types";
import { sortDesc } from "../utils";
import { useAppState } from "../../../hooks";

const MAX_ELEMENTS = 20;

// todo think about dedicated screens / props for different crypto
export const OrderBookScreen = () => {
  const { connect, asksBidsData, toggleMsg, close } =
    useContext(OrderBookSocketContext);

  const appState = useAppState();

  useEffect(() => {
    if (appState.match(/inactive|background/)) {
      console.log("-appstate stop");
      close();
    }
  }, [appState, close]);

  useEffect(() => {
    if (appState === "re-active") {
      console.log("show modal");
    }
  }, [appState]);

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

  const bidsLength = useMemo(
    () => Math.min(MAX_ELEMENTS, sortedBids.length) || 1,
    [MAX_ELEMENTS, sortedBids]
  );

  const maxTotal = useMemo(
    () =>
      sortedAsks[0] && sortedBids[bidsLength - 1]
        ? Math.max(sortedAsks[0][TOTAL], sortedBids[bidsLength - 1][TOTAL])
        : 0,
    [sortedAsks, sortedBids, bidsLength]
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

  // todo skeleton
  // todo bottom and top paddings from library
  return (
    <View>
      <Text>Order Book</Text>
      {renderAsks()}
      <Text>----</Text>
      {renderBids()}
      {/*todo disable when action*/}
      <Button title="toggle" onPress={toggleMsg} />
    </View>
  );
};
