import React, { useState } from "react";
import { StyleSheet, Dimensions, ActivityIndicator, Text } from "react-native";
import { Zoomable, ZOOM_TYPE } from "@likashefqet/react-native-image-zoom";
import { Indicator } from "./styled"; 
import { Image } from "expo-image"; 
type ZoomableImageProps = {
  uri: string;
  simultaneousHandlers?: any;
  onInteractionChange?: (zoomed: boolean) => void;
  showTitleBox: () => void;
  onImageLoaded?: () => void; // Callback para quando a imagem é carregada com sucesso
};

export default function ZoomableImage({
  uri,
  simultaneousHandlers,
  onInteractionChange,
  showTitleBox,
  onImageLoaded,
}: ZoomableImageProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reloadKey, setReloadKey] = useState(Date.now()); // Para forçar recarregamento em caso de erro

  const handleZoom = (zoomType: ZOOM_TYPE) => {
    if (onInteractionChange) {
      const isZoomed = zoomType === ZOOM_TYPE.ZOOM_IN;
      onInteractionChange(isZoomed);
    }
  };

  // Adiciona um timestamp para forçar recarregamento e evitar cache em retentativas
  const finalUri = `${uri}?t=${reloadKey}`; 

  return (
    <>
      <Indicator>
        {/* Mostra o ActivityIndicator apenas enquanto carrega e não há erro */}
        {loading && !error && <ActivityIndicator size="large" color="gray" />}
        {/* Mostra mensagem de erro se houver falha */}
        {error && (
          <Text style={{ color: "white" }}>Erro ao carregar imagem</Text>
        )}
      </Indicator>

      <Zoomable
        minScale={1}
        maxScale={4}
        doubleTapScale={2}
        simultaneousHandlers={simultaneousHandlers}
        isSingleTapEnabled
        isDoubleTapEnabled
        extendGestures
        onInteractionStart={() => onInteractionChange?.(true)} // Sinaliza início da interação
        onInteractionEnd={() => onInteractionChange?.(false)} // Sinaliza fim da interação
        onDoubleTap={handleZoom}
        onSingleTap={() => {
          showTitleBox(); // Alterna a visibilidade da caixa de título
        }}
      >
        <Image
          key={reloadKey} // Força o remonte da imagem quando reloadKey muda
          source={{ uri: finalUri }}
          style={styles.image}
          contentFit="contain"
          onLoadStart={() => {
            setLoading(true);
            setError(false);
          }}
          onLoad={() => {
            setLoading(false);
            if (onImageLoaded) {
              onImageLoaded(); // **CHAMADA CRUCIAL**: Notifica o pai que a imagem carregou
            }
          }}
          onError={() => {
            // Lógica de retentativa: tenta recarregar uma vez
            if (!error) { // Se é a primeira vez que falha
              setReloadKey(Date.now()); // Muda a chave para forçar recarregamento
              setError(true); // Define error como true para o próximo ciclo, indicando que já falhou uma vez
            } else { // Se já tentou recarregar e falhou de novo
              setError(true); // Mantém o estado de erro persistente
              setLoading(false); // Esconde o loading, pois não vai tentar de novo
            }
          }}
          onLoadEnd={() => setLoading(false)} // Garante que o loading seja false no final (sucesso ou erro)
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