import { Box, HStack } from '@gluestack-ui/themed';
import React, { ComponentProps } from 'react';
import { StyleSheet } from 'react-native';

interface StepperProps {
  stepsCount: number;
  currentStep: number;
  space?: ComponentProps<typeof HStack>['space'];
}

export default function Stepper({
  currentStep,
  stepsCount,
  space = 'lg',
}: StepperProps) {
  return (
    <HStack space={space} h={4} w="$full" pt={25} paddingHorizontal={25}>
      {[...Array(stepsCount)].map((_, idx) => {
        const active = idx <= currentStep;

        return (
          <Box
            key={idx}
            bg={active ? '$primary' : 'rgba(217, 217, 217, 1)'}
            style={styles.step}
          />
        );
      })}
    </HStack>
  );
}

const styles = StyleSheet.create({
  step: {
    height: 4,
    flex: 1,
  },
});
