import { AppConfig } from "./src/config";

export default {};

declare global {
  declare module "*.svg" {
    import React from "react";
    import { SvgProps } from "react-native-svg";
    const content: React.FC<SvgProps>;
    export default content;
  }
}
