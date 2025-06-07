import React from "react";
import CardLoader from "./CardLoader";
import { HStack } from "@gluestack-ui/themed";
import { Box } from "@gluestack-ui/themed";
import { DimensionValue } from "react-native";

export default function VScrollLoader({
  count = 4,
  itemWidth = "48%",
  flexWrap = "wrap"
}: {count?: number, itemWidth?: DimensionValue, flexWrap?: "wrap" | "nowrap" | "wrap-reverse"}) {
  return (
    <HStack justifyContent="space-between" flexWrap={flexWrap}>
      {[...Array(count)].map((_, id) => (
        <Box w={itemWidth} key={id} alignItems="center" mt={16}>
          <CardLoader />
        </Box>
      ))}
    </HStack>
  );
}
