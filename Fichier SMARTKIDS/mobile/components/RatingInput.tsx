import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Center, HStack, Pressable } from '@gluestack-ui/themed';
import React from 'react';

export default function RatingInput({
  onChange,
  value,
  maxRate = 5,
}: {
  maxRate?: number;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <HStack justifyContent="space-between" alignItems="center" w="$full" h={64}>
      {[...Array(maxRate)].map((_, idx) => {
        const starIcon =
          value > idx ? (
            <Ionicons name='star' size={64} color={Colors.light.primary} />
          ) : (
            <Ionicons name='star-outline' size={64} color={Colors.light.primary} />
          );

        return (
          <Pressable onPress={() => onChange(idx + 1)} key={idx}>
            <Center flex={1}>{starIcon}</Center>
          </Pressable>
        );
      })}
    </HStack>
  );
}
