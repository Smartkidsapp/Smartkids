import React from 'react';
import { Animated } from 'react-native';

import { StyleSheet } from 'react-native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';

export const CELL_SIZE = 60;
export const CELL_BORDER_RADIUS = 5;
export const DEFAULT_CELL_BORDER_COLOR = 'rgba(8, 33, 45, 0.3)';
export const NOT_EMPTY_CELL_BORDER_COLOR = 'rgba(8, 33, 45, 1)';
export const ACTIVE_CELL_BORDER_COLOR = 'rgba(8, 33, 45, 1)';
const CELL_COUNT = 6;

const { Value, Text: AnimatedText } = Animated;

const animationsColor = [...new Array(CELL_COUNT)].map(() => new Value(0));
const animationsScale = [...new Array(CELL_COUNT)].map(() => new Value(1));
const animateCell = ({ hasValue, index, isFocused }) => {
  Animated.parallel([
    Animated.timing(animationsColor[index], {
      useNativeDriver: false,
      toValue: isFocused ? 1 : 0,
      duration: 250,
    }),
    Animated.spring(animationsScale[index], {
      useNativeDriver: false,
      toValue: hasValue ? 0 : 1,
      duration: hasValue ? 300 : 250,
    }),
  ]).start();
};

interface ConfirmationCodeInputProps {
  setValue: (code: string) => void;
  value: string;
}

export default function ConfirmationCodeInput({
  setValue,
  value,
}: ConfirmationCodeInputProps) {
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const renderCell = ({ index, symbol, isFocused }) => {
    const hasValue = Boolean(symbol);
    const animatedCellStyle = {
      borderColor: hasValue
        ? animationsScale[index].interpolate({
            inputRange: [0, 1],
            outputRange: [
              NOT_EMPTY_CELL_BORDER_COLOR,
              ACTIVE_CELL_BORDER_COLOR,
            ],
          })
        : animationsColor[index].interpolate({
            inputRange: [0, 1],
            outputRange: [DEFAULT_CELL_BORDER_COLOR, ACTIVE_CELL_BORDER_COLOR],
          }),
    };

    setTimeout(() => {
      animateCell({ hasValue, index, isFocused });
    }, 0);

    return (
      <AnimatedText
        key={index}
        style={[styles.cell, animatedCellStyle]}
        onLayout={getCellOnLayoutHandler(index)}>
        {symbol || (isFocused ? <Cursor /> : '-')}
      </AnimatedText>
    );
  };

  return (
    <CodeField
      ref={ref}
      {...props}
      value={value}
      onChangeText={v => {
        console.log(v.length && isNaN(parseInt(v[v.length - 1], 10)));
        if (v.length && isNaN(parseInt(v[v.length - 1], 10))) {
          setValue(v.slice(0, v.length - 1));
          return;
        }

        setValue(v);
      }}
      cellCount={CELL_COUNT}
      rootStyle={styles.codeFieldRoot}
      keyboardType="numeric"
      textContentType="oneTimeCode"
      renderCell={renderCell}
    />
  );
}

const styles = StyleSheet.create({
  codeFieldRoot: {
    height: CELL_SIZE,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cell: {
    marginHorizontal: 3,
    height: CELL_SIZE,
    flex: 1,
    fontSize: 20,
    lineHeight: CELL_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Inter',
    textAlign: 'center',
    borderRadius: CELL_BORDER_RADIUS,
    color: 'rgba(8, 33, 45, 1)',
    borderWidth: 1,
  },
  title: {
    paddingTop: 50,
    color: '#000',
    fontSize: 25,
    fontWeight: '700',
    textAlign: 'center',
    paddingBottom: 40,
  },
});
