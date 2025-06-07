import React, { ComponentProps } from "react";
import ContentLoader, { Rect } from "react-content-loader/native";
import { useWindowDimensions } from "react-native";

const CardLoader = (props: ComponentProps<typeof ContentLoader>) => {
  const { width } = useWindowDimensions();

  const cardWidth = 0.45 * width;
  const textWidth = parseInt(`${0.7 * cardWidth}`);
  const cardHeight = 190;

  return (
    <ContentLoader
      animate={true}
      speed={4}
      width={cardWidth}
      height={cardHeight}
      viewBox={`"0 0 ${parseInt(`${cardWidth}`)} ${cardHeight}`}
      // @ts-ignore
      backgroundColor={"#dfdfdf"}
      // @ts-ignore
      foregroundColor={"#eeeeee"}
      {...props}
    >
      <Rect x="0" y="0" rx="16" ry="16" width={cardWidth} height={150} />
      <Rect x="5" y="155" rx="5" ry="5" width={textWidth} height="10" />
      <Rect x="5" y="170" rx="5" ry="5" width={textWidth} height="10" />
    </ContentLoader>
  );
};

export default CardLoader;
