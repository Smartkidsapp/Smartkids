import { Textarea, TextareaInput, VStack } from '@gluestack-ui/themed';
import React, { ComponentProps } from 'react';
import { StyleSheet } from 'react-native';
import { StyledText } from './StyledText';

const BORDER_COLOR_DEFAULT = 'rgba(8, 33, 45, 0.3)';
const BORDER_COLOR_FILLED = 'rgba(8, 33, 45, 1)';
const BORDER_COLOR_DANGER = 'rgba(226, 3, 29, 1)';

interface AppTextAreaProps extends ComponentProps<typeof TextareaInput> {
  maxChar?: number;
  label?: string;
  error?: string;
}

export default function AppTextArea({
  maxChar,
  label,
  h = 60,
  error,
  ...props
}: AppTextAreaProps) {
  let value = props.value;
  if (value && maxChar && value?.length >= maxChar) {
    value = value.slice(0, maxChar);
  }

  return (
    <VStack space="sm">
      {label ? <StyledText weight='semi-bold' size={14}>{label}</StyledText> : null}

      <Textarea
        h={h}
        position="relative"
        borderRadius="$md"
        borderWidth={1}
        //backgroundColor={'$coolGray100'}
        height={80}
        borderColor={"rgba(30, 30, 30, 0.3)"}
      >
        <TextareaInput
          {...props}
          value={value}
          placeholderTextColor="rgba(8, 33, 45, 0.3)"
          fontSize={14}
          fontFamily="Urbanist-Regular"
        />
      </Textarea>
      {maxChar ? (
        <StyledText
          style={styles.charLimit}
          size={12}
          color="rgba(8, 33, 45, 0.3)">
          {value?.length ?? 0}/{maxChar}
        </StyledText>
      ) : null}
      {error ? (
        <StyledText size={10} color={BORDER_COLOR_DANGER}>
          {error}
        </StyledText>
      ) : null}
    </VStack>
  );
}

const styles = StyleSheet.create({
  charLimit: {
    position: 'absolute',
    right: 5,
    bottom: 2,
  },
});
