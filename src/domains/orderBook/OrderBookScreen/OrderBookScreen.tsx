import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Button, Text, View } from "react-native";

import { OrderBookSocketContext } from "../contexts/orderBookSocketContext";
import Row from "../components/row";
import { PRICE, TOTAL } from "../types";
import { sortDesc } from "../utils";
import { useAppState } from "../../../hooks";
import { Modal } from "../../../components";

import styles from "./OrderBookScreen.styles";

const MAX_ELEMENTS = 15;

// todo think about dedicated screens / props for different crypto
export const OrderBookScreen = () => {
  const { connect, asksBidsData, toggleMsg, close } = useContext(
    OrderBookSocketContext
  );

  const [isConnectModalVisible, setIsConnectModalVisible] = useState(false);

  const appState = useAppState();

  useEffect(() => {
    if (appState.match(/inactive|background/)) {
      console.log("-appstate stop");
      close();
    }
  }, [appState, close]);

  useEffect(() => {
    if (appState === "re-active") {
      setIsConnectModalVisible(true);
    }
  }, [appState]);

  useEffect(() => {
    console.log("connect");
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
    [sortedBids]
  );

  const asksLength = useMemo(
    () => Math.min(MAX_ELEMENTS, sortedAsks.length) || 1,
    [sortedAsks]
  );

  const maxTotal = useMemo(
    () =>
      sortedAsks[0] && sortedBids[bidsLength - 1]
        ? Math.max(sortedAsks[0][TOTAL], sortedBids[bidsLength - 1][TOTAL])
        : 0,
    [sortedAsks, sortedBids, bidsLength]
  );

  const spread = useMemo(
    () =>
      sortedAsks[asksLength - 1] && sortedBids[0]
        ? sortedAsks[asksLength - 1][PRICE] - sortedBids[0][PRICE]
        : 0,
    [sortedBids, sortedAsks, asksLength]
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
  }, [sortedAsks, getTotalFillPercentage]);

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
  }, [sortedBids, getTotalFillPercentage]);

  const handleModalClose = useCallback(() => {
    setIsConnectModalVisible(false);
    connect();
  }, [connect]);

  // todo skeleton
  return (
    <View>
      <Text>Order Book</Text>
      {renderAsks()}
      <View style={styles.spreadContainer}>
        <Text style={styles.spread}>
          Spread:{" "}
          {spread.toLocaleString("en", {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
          })}
        </Text>
      </View>
      {renderBids()}
      {/*todo disable when action*/}
      <Button title="toggle" onPress={toggleMsg} />
      <Modal
        show={isConnectModalVisible}
        message="To prevent unnecessary usage of your transfer data are not collected
            during app inactivity."
        buttonTitle="Ok, re-connect!"
        onButtonClick={handleModalClose}
      />
    </View>
  );
};
