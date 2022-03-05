import { FC, memo } from "react";
import { View } from "react-native";

import { InfoData } from "../../types";
import Cell from "../cell";

import styles from "./Row.styles";

interface Props {
  rowData: InfoData;
}

const Row: FC<Props> = ({ rowData }) => {
  const [price, size, total] = rowData;
  return (
    <View style={styles.row}>
      <Cell value={price} />
      <Cell value={size} />
      <Cell value={total} />
    </View>
  );
};

export default memo(Row);
