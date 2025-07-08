import React from "react";
import { Image, StyleSheet, Dimensions } from "react-native";
import { Zoomable, ZOOM_TYPE } from "@likashefqet/react-native-image-zoom";
import { MangaPage } from "../../Models/MangaModel";

type ZoomableImageProps = {
  uri: any;
  simultaneousHandlers?: any;
  onInteractionChange?: (zoomed: boolean) => void; // <- para controlar swipe
};

export default function ZoomableImage({
  uri,
  simultaneousHandlers,
  onInteractionChange,
}: ZoomableImageProps) {
  const handleZoom = (zoomType: ZOOM_TYPE) => {
    if (onInteractionChange) {
      const isZoomed = zoomType === ZOOM_TYPE.ZOOM_IN;
      onInteractionChange(isZoomed);
    }
  };

  return (
    <Zoomable
      minScale={1}
      maxScale={4}
      doubleTapScale={2}
      simultaneousHandlers={simultaneousHandlers}
      isSingleTapEnabled
      isDoubleTapEnabled
      extendGestures
      onInteractionStart={() => onInteractionChange?.(true)}
      onInteractionEnd={() => onInteractionChange?.(false)}
          onDoubleTap={(zoomType) => handleZoom(zoomType)}
          onSingleTap={() => {alert("um pressionamento")}}
    >
      <Image source={{ uri }} style={styles.image} resizeMode="contain" />
    </Zoomable>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  image: {
    width,
    height,
  },
});
