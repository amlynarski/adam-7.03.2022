import { Pressable, PressableProps, Text, View } from "react-native";
import { FC } from "react";

import styles from "./Button.styles";

interface Props extends PressableProps {
  title: string;
}

export const Button: FC<Props> = ({ title, style, ...rest }) => {
  return (
    <View style={{ ...styles.buttonContainer, ...(style as object) }}>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
        {...rest}
      >
        <Text style={styles.text}>{title}</Text>
      </Pressable>
    </View>
  );
};
