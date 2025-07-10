import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Text,
} from "react-native";
import { Zoomable, ZOOM_TYPE } from "@likashefqet/react-native-image-zoom";
import { Indicator } from "./styled";

type ZoomableImageProps = {
  uri: string;
  simultaneousHandlers?: any;
  onInteractionChange?: (zoomed: boolean) => void;
};

export default function ZoomableImage({
  uri,
  simultaneousHandlers,
  onInteractionChange,
}: ZoomableImageProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reloadKey, setReloadKey] = useState(Date.now());

  const handleZoom = (zoomType: ZOOM_TYPE) => {
    if (onInteractionChange) {
      const isZoomed = zoomType === ZOOM_TYPE.ZOOM_IN;
      onInteractionChange(isZoomed);
    }
  };

  const finalUri = `${uri}?t=${reloadKey}`; // <- força recarregamento

  return (
    <>
      <Indicator>
        {loading && !error && <ActivityIndicator size="large" color="gray" />}
        {error && <Text style={{ color: "white" }}>Erro ao carregar imagem</Text>}
      </Indicator>

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
        onDoubleTap={handleZoom}
        onSingleTap={() => {
          alert("um pressionamento");
        }}
      >
        <Image
          key={reloadKey} // força rerender do componente
          source={{ uri: finalUri }}
          style={styles.image}
          resizeMode="contain"
          onLoadStart={() => {
            setLoading(true);
            setError(false);
          }}
          onLoad={() => setLoading(false)}
          onError={() => {
            if (!error) {
              setReloadKey(Date.now()); // tenta recarregar
            } else {
              setError(true); // se falhar de novo, assume erro
            }
          }}
          onLoadEnd={() => setLoading(false)}
        />
      </Zoomable>
    </>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  image: {
    width,
    height,
  },
});
