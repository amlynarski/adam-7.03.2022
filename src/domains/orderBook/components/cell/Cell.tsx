import { Text, View } from "react-native";
import { FC, memo } from "react";

interface Props {
  value: number | string;
  type?: "ask" | "bid" | "header";
  withDigits?: boolean;
}

import styles from "./Cell.styles";

const Cell: FC<Props> = ({ value, type, withDigits }) => {
  const localeOptions = withDigits ? { minimumFractionDigits: 2 } : {};

  /**
   * author comment:
   * value.toLocaleString('en') is done as on designs but passing `en` is IMO wrong decision,
   * because we should follow device / user preferences and store it somewhere
   * */
  return (
    <View style={styles.container}>
      <Text style={{ ...styles.text, ...styles[type] }}>
        {value.toLocaleString("en", localeOptions)}
      </Text>
    </View>
  );
};

export default memo(Cell);
