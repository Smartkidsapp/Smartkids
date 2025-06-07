import React from 'react';
import { ColorValue, Text, TextProps, TextStyle } from 'react-native';

const fontFamily = {
  bold: 'Urbanist-Bold',
  'semi-bold': 'Urbanist-SemiBold',
  medium: 'Urbanist-Medium',
};

export function StyledText(
  props: TextProps & {
    weight?: 'bold' | 'semi-bold' | 'medium';
    size?: number;
    color?: ColorValue;
    center?: boolean;
  },
) {
  const font = (props.weight && fontFamily[props.weight]) ?? 'Urbanist-Regular';
  const styles = {
    fontFamily: font,
    fontSize: props.size ?? 12,
    fontStyle: 'normal',
    includeFontPadding: false,
    // verticalAlign: "middle",
    color: props.color
      ? props.color
      : (props.style as TextStyle)?.color ?? 'rgba(8, 33, 45, 1)',
  } as TextStyle;

  if (props.center) {
    styles.textAlign = 'center';
  }

  return <Text {...props} style={[props.style, styles]} />;
}
