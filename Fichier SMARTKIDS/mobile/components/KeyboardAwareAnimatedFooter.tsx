import { Easing, Keyboard, StyleSheet } from 'react-native';
import React, { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';
import Reanimated, {
  FadeIn,
  FadeOut,
  Easing as ReEasing,
} from 'react-native-reanimated';

export default function KeyboardAwareAnimatedFooter({
  children,
}: PropsWithChildren<{ totalHeight?: number }>) {
  const translateY = useRef(new Animated.Value(0)).current;
  const [keyBoardVisible, setKeyBoardVisible] = useState<boolean>(false);
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyBoardVisible(true);
        Animated.timing(translateY, {
          toValue: 250,
          duration: 1,
          easing: Easing.ease,
          useNativeDriver: true,
        }).start();
      },
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyBoardVisible(false);
        Animated.timing(translateY, {
          toValue: 0,
          duration: 1,
          easing: Easing.ease,
          useNativeDriver: true,
        }).start();
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [translateY]);

  return (
    <Animated.View
      style={[styles.container, { transform: [{ translateY: translateY }] }]}>
      {!keyBoardVisible ? (
        <Reanimated.View
          style={styles.container}
          entering={FadeIn.duration(2).easing(ReEasing.ease)}
          exiting={FadeOut.duration(2).easing(ReEasing.ease)}>
          {children}
        </Reanimated.View>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    // position: 'absolute',
    // left: 0,
    // right: 0,
    // bottom: 0,
    backgroundColor: 'rgba(0,0,0,0)',
  },
});
