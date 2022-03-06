import { FC } from "react";
import { Modal as RNModal, Pressable, View, Text } from "react-native";

import styles from "./Modal.styles";
import { Button } from "../button";

interface Props {
  show: boolean;
  message: string;
  onButtonClick: Function;
  buttonTitle: string;
}

export const Modal: FC<Props> = ({
  show,
  message,
  onButtonClick,
  buttonTitle,
}) => {
  return (
    <RNModal animationType="slide" transparent={true} visible={show}>
      <View style={styles.viewPosition}>
        <View style={styles.container}>
          <Text style={styles.text}>{message}</Text>
          <Button
            style={styles.button}
            title={buttonTitle}
            onPress={() => onButtonClick()}
          />
        </View>
      </View>
    </RNModal>
  );
};
