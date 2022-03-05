import { Text } from "react-native";
import { FC, memo } from "react";

interface Props {
  value: number;
}

const Cell: FC<Props> = ({ value }) => {
  // todo add props for colors

  return <Text>{value.toLocaleString()}</Text>;
};

export default memo(Cell);
