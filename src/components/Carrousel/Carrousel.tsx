import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {
  ActivityIndicator,
  Dimensions,
  Text,
  InteractionManager,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import type { ICarouselInstance } from "react-native-reanimated-carousel";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
  useSharedValue,
} from "react-native-reanimated";
import {
  AuxiPage,
  BackButton,
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
import Ionicons from "@expo/vector-icons/Ionicons";

const { width, height } = Dimensions.get("window");

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

interface CarrouselProps {
  list: MangaPage[];
  nextPage: () => Promise<void>;
  prevPage: () => Promise<void>;
  mangaAll: ReaderChapters;
  navigation: any;
  // Novas props para controle de carregamento
  chapterDataLoaded: boolean;
  onCarouselReady: () => void;
}

export default function Carrousel({
  list,
  nextPage,
  prevPage,
  mangaAll,
  navigation,
  chapterDataLoaded, // Recebe a prop
  onCarouselReady, // Recebe a prop
}: CarrouselProps) {
  const isZoomedShared = useSharedValue(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTitleBox, setShowTitleBox] = useState(false);
  const [firstImageReady, setFirstImageReady] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  const currentChapterIdRef = useRef(mangaAll.currentChapter.id);
  const carouselRef = useRef<ICarouselInstance>(null);
  const panRef = useRef(null);

  // Use useMemo para criar a lista estendida, otimizando renders
  const extendedList = useMemo(() => {
    // Se a lista está vazia, retorna apenas as páginas auxiliares (ou uma vazia)
    if (!list || list.length === 0)
      return [{ type: "auxi-start" }, { type: "auxi-end" }];

    return [
      { type: "auxi-start" },
      ...list.map((item) => ({ type: "page", uri: item })),
      { type: "auxi-end" },
    ];
  }, [list]);

  // Atualiza o shared value para o gesture handler
  useEffect(() => {
    isZoomedShared.value = isZoomed;
  }, [isZoomed, isZoomedShared]);

  // Reseta estados quando o capítulo muda (ID do capítulo atual)
  useEffect(() => {
    if (mangaAll.currentChapter.id !== currentChapterIdRef.current) {
      setFirstImageReady(false);
      setHasScrolled(false); // Reset o controle de scroll para o novo capítulo
      setCurrentIndex(0); // Reset o índice para o início do novo capítulo
      currentChapterIdRef.current = mangaAll.currentChapter.id;
    }
  }, [mangaAll.currentChapter.id]);

  // Efeito para rolar o carrossel para a primeira página real (índice 1)
  useEffect(() => {
    
    if (
      chapterDataLoaded && // Espera o `Reader` sinalizar que os dados estão prontos
      firstImageReady &&
      extendedList.length > 2 && // Garante que há pelo menos uma página real além das auxiliares
      !hasScrolled
    ) {
      const interaction = InteractionManager.runAfterInteractions(() => {
        if (carouselRef.current) {
          carouselRef.current.scrollTo({
            index: 1, // Rola para o primeiro item de conteúdo (depois da página auxiliar de início)
            animated: false, // Não animar para uma transição mais limpa na inicialização
          });
          setCurrentIndex(1); // Define o currentIndex para o primeiro item real
          setHasScrolled(true); // Marca que já rolou
          onCarouselReady(); // Notifica o Reader que o carrossel está pronto
        }
      });
      return () => interaction.cancel();
    }
  }, [
    chapterDataLoaded, // Dependência adicionada
    firstImageReady,
    extendedList.length,
    hasScrolled,
    onCarouselReady,
  ]);

  const handlePressBackButton = () => navigation.goBack();

  const handleShowTitleBox = () => {
    setShowTitleBox(!showTitleBox);
  };

  // Função para ir para o próximo capítulo
  const nextPageHandler = useCallback(async () => {
    if (!mangaAll.nextChapter?.id) {
      alert("Não há próximo capítulo");
    } else {
      await nextPage(); // Chama a função passada pelo Reader
     
    }
  }, [nextPage, mangaAll.nextChapter?.id]); // Adicionado id como dependência

  // Função para ir para o capítulo anterior
  const prevPageHandler = useCallback(async () => {
    if (!mangaAll.prevChapter?.id) {
      alert("Não há capítulo anterior");
    } else {
      await prevPage(); // Chama a função passada pelo Reader
      
    }
  }, [prevPage, mangaAll.prevChapter?.id]); // Adicionado id como dependência

  const handleFirstImageReady = useCallback(() => {
    setFirstImageReady(true);
  }, []);

  return (
    <>
      {/* Exibe o ActivityIndicator se os dados do capítulo não estiverem carregados */}
      {!chapterDataLoaded || extendedList.length === 0 ? (
        <Indicator>
          <ActivityIndicator size="large" color="gray" />
          <Text style={{ color: "white", marginTop: 10 }}>
            Carregando capítulo...
          </Text>
        </Indicator>
      ) : (
        <Carousel
          key={mangaAll.currentChapter.id} // força remount ao trocar capítulo
          ref={carouselRef}
          windowSize={3}
          defaultIndex={1} // Inicia no índice 1 (primeira página real)
          loop={false}
          width={width}
          height={height}
          panGestureHandlerProps={{ ref: panRef }}
          onConfigurePanGesture={(panGesture: PanGesture) => {
            "worklet";
            panGesture.enabled(!isZoomedShared.value);
          }}
          data={extendedList}
          snapEnabled
          pagingEnabled
          onSnapToItem={(index: number) => {
            setCurrentIndex(index);
          }}
          renderItem={({ item, index }) => {
            if (item.type === "auxi-start") {
              return (
                <AuxiPage>
                  <ChapterIndicator>
                    <TitleText>Capítulo Atual</TitleText>
                    {mangaAll?.currentChapter?.title && (
                      <TitleText numberOfLines={1} ellipsizeMode="tail">{mangaAll.currentChapter.title}</TitleText>
                    )}
                    {mangaAll?.currentChapter.chapterNumber && (
                      <TitleText>
                        Cap. {mangaAll.currentChapter.chapterNumber}
                      </TitleText>
                    )}
                  </ChapterIndicator>
                  <ChapterIndicator>
                    <TitleText numberOfLines={1} ellipsizeMode="tail">Capítulo Anterior</TitleText>
                    {mangaAll?.prevChapter?.title && (
                      <TitleText>{mangaAll.prevChapter.title}</TitleText>
                    )}
                    {mangaAll?.prevChapter?.chapterNumber && (
                      <TitleText>
                        Cap. {mangaAll.prevChapter.chapterNumber}
                      </TitleText>
                    )}
                  </ChapterIndicator>
                  <ButtonNextPrevChapter
                    onPress={prevPageHandler}
                    // Desabilita o botão se não houver capítulo anterior
                  >
                    <ButtonText>Capítulo Anterior</ButtonText>
                    <Ionicons name="arrow-undo" size={24} color="white" />
                  </ButtonNextPrevChapter>
                </AuxiPage>
              );
            }

            if (item.type === "auxi-end") {
              return (
                <AuxiPage>
                  <ChapterIndicator>
                    <TitleText>Capítulo Atual</TitleText>
                    {mangaAll?.currentChapter.title && (
                      <TitleText numberOfLines={1} ellipsizeMode="tail">{mangaAll.currentChapter.title}</TitleText>
                    )}
                    {mangaAll?.currentChapter.chapterNumber && (
                      <TitleText>
                        Cap. {mangaAll.currentChapter.chapterNumber}
                      </TitleText>
                    )}
                  </ChapterIndicator>
                  <ChapterIndicator>
                    <TitleText>Próximo Capítulo</TitleText>
                    {mangaAll?.nextChapter?.title && (
                      <TitleText numberOfLines={1} ellipsizeMode="tail">{mangaAll.nextChapter.title}</TitleText>
                    )}
                    {mangaAll?.nextChapter?.chapterNumber && (
                      <TitleText>
                        Cap. {mangaAll.nextChapter.chapterNumber}
                      </TitleText>
                    )}
                  </ChapterIndicator>
                  <ButtonNextPrevChapter
                    onPress={nextPageHandler}
                    // Desabilita o botão se não houver próximo capítulo
                  >
                    <ButtonText>Próximo Capítulo</ButtonText>
                    <Ionicons name="arrow-redo" size={24} color="white" />
                  </ButtonNextPrevChapter>
                </AuxiPage>
              );
            }

            return (
              <ImageContainer>
                <ZoomableImage
                  uri={item.uri}
                  simultaneousHandlers={panRef}
                  showTitleBox={handleShowTitleBox}
                  onInteractionChange={(zoomed: boolean) => {
                    setIsZoomed(zoomed);
                  }}
                  onImageLoaded={
                    index === 1 ? handleFirstImageReady : undefined
                  } // Notifica quando a 1ª imagem de conteúdo carrega
                />
              </ImageContainer>
            );
          }}
        />
      )}

      {/* Condição para mostrar a caixa de título e o indicador de página */}
      {currentIndex > 0 &&
        currentIndex < extendedList.length - 1 &&
        showTitleBox && (
          <>
            <ChapterTopBox>
              <BackButton onPress={handlePressBackButton}>
                <Ionicons name="arrow-back" size={30} color="gray" />
              </BackButton>
              <TitleText>
                Cap. {mangaAll?.currentChapter.chapterNumber}
              </TitleText>
              {mangaAll?.currentChapter.title && (
                <TitleText numberOfLines={1} ellipsizeMode="tail">{mangaAll.currentChapter.title}</TitleText>
              )}
            </ChapterTopBox>

            <PageIndicatorBox>
              <PageIndicatorText>
                {currentIndex} /{" "}
                {extendedList.length > 2 ? extendedList.length - 2 : 0}
              </PageIndicatorText>
            </PageIndicatorBox>
          </>
        )}
    </>
  );
}
