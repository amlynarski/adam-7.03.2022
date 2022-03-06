import { FC, memo } from "react";
import { View } from "react-native";

import { InfoData } from "../../types";
import Cell from "../cell";

import styles from "./Row.styles";

interface Props {
  rowData: InfoData;
  totalFill: number;
  type: "ask" | "bid";
}

const Row: FC<Props> = ({ rowData, totalFill, type }) => {
  const [price, size, total] = rowData;

  return (
    <View style={styles.container}>
      <View
        style={{
          ...styles.totalFill,
          ...styles[type],
          width: `${totalFill * 100}%`,
        }}
      />
      <View style={styles.row}>
        <Cell type={type} value={price} withDigits />
        <Cell value={size} />
        <Cell value={total} />
      </View>
    </View>
  );
};

export default memo(Row);
