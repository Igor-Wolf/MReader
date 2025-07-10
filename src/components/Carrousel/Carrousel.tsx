import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { ActivityIndicator, Button, Dimensions } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
  useSharedValue,
} from "react-native-reanimated";
import {
  AuxiPage,
  ButtonNextPrevChapter,
  ButtonText,
  ChapterIndicator,
  ChapterTopBox,
  ImageContainer,
  Indicator,
  PageIndicatorBox,
  PageIndicatorText,
  TitleText,
} from "./styled";
import ZoomableImage from "../Zoom/Zoom";
import { PanGesture } from "react-native-gesture-handler";
import { MangaPage, ReaderChapters } from "../../Models/MangaModel";
import Ionicons from '@expo/vector-icons/Ionicons';


const { width, height } = Dimensions.get("window");

// Configura o logger do Reanimated para exibir apenas warnings
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

interface CarrouselProps {
  list: MangaPage[];
  nextPage: () => Promise<void>;
  prevPage: () => Promise<void>;
  mangaAll: ReaderChapters;
}

export default function Carrousel({
  list,
  nextPage,
  prevPage,
  mangaAll,
}: CarrouselProps) {
  // Estado compartilhado para controle de zoom, usado para desabilitar o scroll do carrossel
  const isZoomedShared = useSharedValue(false);
  // Estado local para controle de zoom
  const [isZoomed, setIsZoomed] = useState(false);
  // Estado para o índice atual do carrossel
  const [currentIndex, setCurrentIndex] = useState(0);
  // Referência para o componente Carousel
  const carouselRef = useRef(null);
  // Referência para o manipulador de gesto de pan, para uso com ZoomableImage
  const panRef = useRef(null);

  // Ref para controlar o estado de carregamento e evitar múltiplas chamadas a nextPage
  const isLoadingRef = useRef(false);

  // Usa useMemo para criar a lista estendida apenas quando a 'list' de entrada muda.
  // Isso garante que a lista seja consistente e ajuda na renderização inicial do carrossel.
  const extendedList = useMemo(() => {
    // Retorna uma lista vazia se 'list' for nula ou vazia para evitar erros.
    if (!list || list.length === 0) {
      return [];
    }
    return [
      { type: "auxi-start" }, // Página auxiliar de início do capítulo
      ...list.map((item) => ({ type: "page", uri: item })), // Páginas reais do mangá
      { type: "auxi-end" }, // Página auxiliar de fim do capítulo
    ];
  }, [list]); // Dependência: recalcula se 'list' mudar

  // Use um estado para controlar se a lista de capítulos mudou.
  // Isso nos permite forçar o carrossel a resetar sua posição.
  const [chapterChanged, setChapterChanged] = useState(false);

  // Efeito para sincronizar o estado local 'isZoomed' com o shared value 'isZoomedShared'.
  // O shared value é usado dentro do 'worklet' do Reanimated.
  useEffect(() => {
    isZoomedShared.value = isZoomed;
  }, [isZoomed, isZoomedShared]);

  // Efeito para detectar mudança de capítulo e redefinir o carrossel
  useEffect(() => {
    // Verifica se há dados na lista e se a flag chapterChanged está ativada.
    if (list && list.length > 0 && chapterChanged) {
      // Usa um pequeno atraso para garantir que o carrossel tenha tempo de
      // processar a nova `data` antes de tentar rolar.
      setTimeout(() => {
        carouselRef.current?.scrollTo({
          index: 1, // Rola para a primeira página real (índice 1) do novo capítulo
          animated: false, // Pode ser 'true' para uma transição suave
        });
        setChapterChanged(false); // Reseta a flag após a rolagem
      }, 100); // Atraso em milissegundos para maior confiabilidade
    }
  }, [list, chapterChanged]);

  // Callback memorizado para lidar com o carregamento da próxima página.
  // Usa isLoadingRef para evitar chamadas duplicadas enquanto uma requisição está pendente.
  const nextPageHandler = useCallback(async () => {
    

    if (isLoadingRef.current || !mangaAll.nextChapter) {
      alert("acabou")
      return; // Já está carregando, então não faz nada
    }
    isLoadingRef.current = true; // Define o estado de carregamento para true

    try {
      setCurrentIndex(1);
      await nextPage(); // Chama a função nextPage passada via props, que deve atualizar a 'list' prop
      setChapterChanged(true); // Ativa a flag para indicar que um novo capítulo foi carregado
    } catch (error) {
      console.error("Erro ao carregar a próxima página:", error);
    } finally {
      isLoadingRef.current = false; // Restaura o estado de carregamento para false
    }
  }, [nextPage, mangaAll.nextChapter]); // Dependência: nextPage
  const prevPageHandler = useCallback(async () => {
    

    if (isLoadingRef.current || !mangaAll.nextChapter) {
      alert("acabou")
      return; // Já está carregando, então não faz nada
    }
    isLoadingRef.current = true; // Define o estado de carregamento para true

    try {
      setCurrentIndex(1);
      await prevPage(); // Chama a função nextPage passada via props, que deve atualizar a 'list' prop
      setChapterChanged(true); // Ativa a flag para indicar que um novo capítulo foi carregado
    } catch (error) {
      console.error("Erro ao carregar a próxima página:", error);
    } finally {
      isLoadingRef.current = false; // Restaura o estado de carregamento para false
    }
  }, [prevPage, mangaAll.nextChapter]); // Dependência: nextPage

  return (
    <>
      {/* Condição de renderização: O Carousel só será montado quando extendedList tiver dados.
          Isso garante que defaultIndex seja respeitado na primeira renderização com dados. */}
      {extendedList.length > 0 ? (
        <Carousel
          ref={carouselRef}
          // Define o índice inicial. Começamos em 1 para pular a página 'auxi-start'.
          // Este defaultIndex só é relevante na montagem inicial do Carrossel.
          defaultIndex={1}
          loop={false} // Não permite looping (avançar do fim para o começo e vice-versa)
          width={width} // Largura total da tela
          height={height} // Altura total da tela
          panGestureHandlerProps={{ ref: panRef }} // Passa a ref do panGestureHandler para a imagem zoomable
          onConfigurePanGesture={(panGesture: PanGesture) => {
            "worklet"; // Marca como worklet para execução na thread UI do Reanimated
            // Desabilita o gesto de pan do carrossel se a imagem estiver com zoom
            panGesture.enabled(!isZoomedShared.value);
          }}
          data={extendedList} // A lista de itens a serem exibidos
          snapEnabled // Permite o ajuste para a página mais próxima ao final do gesto
          pagingEnabled // Permite a paginação (uma página por vez)
          onSnapToItem={(index: number) => {
            // Este evento é disparado quando o carrossel se ajusta a um item
            setCurrentIndex(index); // Atualiza o índice atual
            // A chamada de nextPageHandler por deslize na última página auxiliar foi removida daqui.
            // Agora, o avanço de capítulo é apenas pelo botão.
          }}
          renderItem={({ item, index }) => {
            if (item.type === "auxi-start") {
              // Renderiza a página auxiliar de início do capítulo
              return (
                <AuxiPage>
                  <ChapterIndicator>
                    <TitleText>Current Chapter</TitleText>
                    {mangaAll?.currentChapter?.title && (
                      <TitleText>{mangaAll.currentChapter.title}</TitleText>
                    )}
                    {mangaAll?.currentChapter.chapterNumber && (
                      <TitleText>
                        ch. {mangaAll.currentChapter.chapterNumber}
                      </TitleText>
                    )}
                  </ChapterIndicator>
                  <ChapterIndicator>
                    <TitleText>Prev. Chapter</TitleText>
                    {mangaAll?.prevChapter?.title && (
                      <TitleText>{mangaAll.prevChapter.title}</TitleText>
                    )}
                    {mangaAll?.prevChapter?.chapterNumber && (
                      <TitleText>
                        ch. {mangaAll.prevChapter.chapterNumber}
                      </TitleText>
                    )}
                  </ChapterIndicator>
                  <ButtonNextPrevChapter onPress={prevPageHandler}>
                    <ButtonText>
                      Prev Chapter
                    </ButtonText>
                    <Ionicons name="arrow-undo" size={24} color="white" />
                  </ButtonNextPrevChapter>
                  
                </AuxiPage>
              );
            }

            if (item.type === "auxi-end") {
              // Renderiza a página auxiliar de fim do capítulo
              return (
                <AuxiPage>
                  <ChapterIndicator>
                    <TitleText>Current Chapter</TitleText>
                    {mangaAll?.currentChapter.title && (
                      <TitleText>{mangaAll.currentChapter.title}</TitleText>
                    )}
                    {mangaAll?.currentChapter.chapterNumber && (
                      <TitleText>
                        ch. {mangaAll.currentChapter.chapterNumber}
                      </TitleText>
                    )}
                  </ChapterIndicator>
                  <ChapterIndicator>
                    <TitleText>Next. Chapter</TitleText>
                    {mangaAll?.nextChapter?.title && (
                      <TitleText>{mangaAll.nextChapter.title}</TitleText>
                    )}
                    {mangaAll?.nextChapter?.chapterNumber && (
                      <TitleText>
                        ch. {mangaAll.nextChapter.chapterNumber}
                      </TitleText>
                    )}
                    {/* Botões para avançar a página. Chamam nextPageHandler. */}
                    {/* Mantemos múltiplos botões apenas por consistência com o seu código anterior. */}

                  </ChapterIndicator>
                  <ButtonNextPrevChapter onPress={nextPageHandler}>
                    <ButtonText>
                      Next Chapter
                    </ButtonText>
                    <Ionicons name="arrow-redo" size={24} color="white" />
                    </ButtonNextPrevChapter>
                    
                </AuxiPage>
              );
            }

            // Renderiza as páginas de imagem do mangá
            return (
              <ImageContainer>
                <ZoomableImage
                  uri={item.uri}
                  simultaneousHandlers={panRef} // Permite que o gesto de zoom seja reconhecido junto com o pan do carrossel
                  onInteractionChange={(zoomed: boolean) => {
                    setIsZoomed(zoomed); // Atualiza o estado de zoom
                  }}
                />
              </ImageContainer>
            );
          }}
        />
      ) : (
        // Opcional: Exibe um indicador de carregamento enquanto a lista de dados não está pronta
        <Indicator>
          <ActivityIndicator size="large" color="gray" />
        </Indicator>
      )}

      {/* Indicador de página, visível apenas nas páginas reais do mangá (excluindo as auxiliares) */}
      {currentIndex > 0 && currentIndex < extendedList.length - 1 && (
        <>
          <ChapterTopBox>
            <TitleText>{mangaAll?.currentChapter.chapterNumber}</TitleText>
            {mangaAll?.currentChapter.title && (
              <TitleText>{mangaAll.currentChapter.title}</TitleText>
            )}
          </ChapterTopBox>

          <PageIndicatorBox>
            <PageIndicatorText>
              {/* Ajusta o cálculo da página para desconsiderar as páginas auxiliares */}
              {currentIndex} / {extendedList.length - 2}
            </PageIndicatorText>
          </PageIndicatorBox>
        </>
      )}
    </>
  );
}
