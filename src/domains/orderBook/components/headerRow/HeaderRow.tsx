import { View } from "react-native";

import styles from "./HeaderRow.styles";
import Cell from "../cell";
const HeaderRow = () => {
  return (
    <View style={styles.row}>
      <Cell value="PRICE" type="header" />
      <Cell value="SIZE" type="header" />
      <Cell value="TOTAL" type="header" />
    </View>
  );
};
export default HeaderRow;
