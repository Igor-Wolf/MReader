import React, { useRef, useState, useEffect } from "react";
import { Dimensions } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { configureReanimatedLogger, ReanimatedLogLevel, useSharedValue } from "react-native-reanimated";
import { ImageContainer } from "./styled";
import ZoomableImage from "../Zoom/Zoom";
import { PanGesture } from "react-native-gesture-handler";
import { MangaPage } from "../../Models/MangaModel";

const { width, height } = Dimensions.get("window");


configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Reanimated runs in strict mode by default
});

export default function Carrousel({ list }: { list: MangaPage[] }) {
  const scrollOffsetValue = useSharedValue(0);
  const panRef = useRef(null);

  // Compartilha o estado de zoom com o worklet
  const isZoomedShared = useSharedValue(false);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    isZoomedShared.value = isZoomed;
  }, [isZoomed]);

  return (
    <Carousel
      loop={false}
      width={width}
      height={height}
      panGestureHandlerProps={{ ref: panRef }}
      onConfigurePanGesture={(panGesture: PanGesture) => {
        "worklet";
        panGesture.enabled(!isZoomedShared.value); // Desativa swipe se estiver com zoom
      }}
      data={list}
      defaultScrollOffsetValue={scrollOffsetValue}
      snapEnabled
      pagingEnabled
      renderItem={({ item }) => (
        <ImageContainer>
          <ZoomableImage
            uri={item}
            simultaneousHandlers={panRef}
            onInteractionChange={(zoomed: boolean) => {
              setIsZoomed(zoomed);
            }}
          />
        </ImageContainer>
      )}
    />
  );
}
