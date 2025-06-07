import React, { ComponentProps } from "react";
import ContentLoader, { Rect } from "react-content-loader/native";
import { useWindowDimensions } from "react-native";

const DetailLoader = (props: ComponentProps<typeof ContentLoader>) => {
    return (
        <ContentLoader
            speed={4}
            width={"100%"}
            height={600}
            viewBox="0 0 100% 600"
            backgroundColor="#dfdfdf"
            foregroundColor="#eeeeee"
            {...props}
        >
            {/* Image */}
            <Rect x="0" y="60" rx="10" ry="10" width="400" height="350" />

            {/* Title */}
            <Rect x="20" y="430" rx="4" ry="4" width="40%" height="14" />

            {/* Distance */}
            <Rect x="320" y="430" rx="4" ry="4" width="60" height="14" />

            {/* Category */}
            <Rect x="20" y="460" rx="4" ry="4" width="200" height="14" />
        </ContentLoader>
    );
};

export default DetailLoader;
