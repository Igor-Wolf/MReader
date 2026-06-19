import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {
  ActivityIndicator,
  Text,
  InteractionManager,
  StyleSheet,
  useWindowDimensions,
  Platform, // Adicionado para otimização de renderização cross-platform
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import type { ICarouselInstance } from "react-native-reanimated-carousel";
import Animated, {
  configureReanimatedLogger,
  ReanimatedLogLevel,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import Slider from "@react-native-community/slider";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { GestureDetector, Gesture } from "react-native-gesture-handler";

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
  FilterOverlay,
  GearButton,
  SettingsModal,
  SliderRow,
  SliderLabelBox,
  SliderLabel,
  ButtonFilterGroup,
  FilterButton,
  ModeButtonRow,
  WebtoonImageWrapper,
} from "./styled";
import ZoomableImage from "../Zoom/Zoom";
import type { PanGesture } from "react-native-gesture-handler";
import { MangaPage, ReaderChapters } from "../../Models/MangaModel";

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
  chapterDataLoaded: boolean;
  onCarouselReady: () => void;
}

type ReadingMode = "horizontal" | "webtoon";

const FILTER_COLORS = {
  sepia: "rgb(230, 155, 25)",
  dark: "rgb(0, 0, 0)",
};

export default function Carrousel({
  list,
  nextPage,
  prevPage,
  mangaAll,
  navigation,
  chapterDataLoaded,
  onCarouselReady,
}: CarrouselProps) {
  const { width, height } = useWindowDimensions();

  const isZoomedShared = useSharedValue(false);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTitleBox, setShowTitleBox] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [firstImageReady, setFirstImageReady] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  const [sepiaActive, setSepiaActive] = useState(false);
  const [darkActive, setDarkActive] = useState(false);
  const [filterOpacity, setFilterOpacity] = useState(0.2);
  const [readingMode, setReadingMode] = useState<ReadingMode>("horizontal");

  const currentChapterIdRef = useRef(mangaAll.currentChapter.id);
  const carouselRef = useRef<ICarouselInstance>(null);
  const panRef = useRef(null);

  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);

  const webtoonExtendedList = useMemo(() => {
    if (!list || list.length === 0) return [];
    return [
      { type: "header" },
      ...list.map((uri, idx) => ({ type: "page", uri, index: idx })),
      { type: "footer" },
    ];
  }, [list]);

  const extendedList = useMemo(() => {
    if (!list || list.length === 0)
      return [{ type: "auxi-start" }, { type: "auxi-end" }];

    return [
      { type: "auxi-start" },
      ...list.map((item) => ({ type: "page", uri: item })),
      { type: "auxi-end" },
    ];
  }, [list]);

  useEffect(() => {
    if (mangaAll.currentChapter.id !== currentChapterIdRef.current) {
      setFirstImageReady(false);
      setHasScrolled(false);
      setCurrentIndex(0);
      scale.value = 1;
      savedScale.value = 1;
      currentChapterIdRef.current = mangaAll.currentChapter.id;
    }
  }, [mangaAll.currentChapter.id]);

  useEffect(() => {
    if (
      readingMode === "horizontal" &&
      chapterDataLoaded &&
      firstImageReady &&
      extendedList.length > 2 &&
      !hasScrolled
    ) {
      const interaction = InteractionManager.runAfterInteractions(() => {
        if (carouselRef.current) {
          carouselRef.current.scrollTo({ index: 1, animated: false });
          setCurrentIndex(1);
          setHasScrolled(true);
          onCarouselReady();
        }
      });
      return () => interaction.cancel();
    } else if (readingMode === "webtoon" && chapterDataLoaded) {
      onCarouselReady();
    }
  }, [chapterDataLoaded, firstImageReady, extendedList.length, hasScrolled, onCarouselReady, readingMode]);

  const handlePressBackButton = () => navigation.goBack();

  const handleShowTitleBox = useCallback(() => {
    setShowTitleBox((prev) => {
      if (prev) setShowSettings(false);
      return !prev;
    });
  }, []);

  const webtoonTap = useMemo(() => 
    Gesture.Tap().onEnd(() => {
      runOnJS(handleShowTitleBox)();
    }), [handleShowTitleBox]
  );

  const webtoonDoubleTap = useMemo(() =>
    Gesture.Tap().numberOfTaps(2).onEnd(() => {
      if (scale.value > 1) {
        scale.value = withTiming(1);
        savedScale.value = 1;
      } else {
        scale.value = withTiming(1.8);
        savedScale.value = 1.8;
      }
    }), []
  );

  const webtoonPinch = useMemo(() =>
    Gesture.Pinch()
      .onUpdate((event) => {
        let nextScale = savedScale.value * event.scale;
        if (nextScale < 1) nextScale = 1;
        if (nextScale > 2.5) nextScale = 2.5;
        scale.value = nextScale;
      })
      .onEnd(() => {
        if (scale.value < 1.05) {
          scale.value = withTiming(1);
          savedScale.value = 1;
        } else {
          savedScale.value = scale.value;
        }
      }), []
  );

  const webtoonCombinedGestures = useMemo(() => 
    Gesture.Race(
      webtoonDoubleTap,
      Gesture.Simultaneous(webtoonTap, webtoonPinch)
    ),
    [webtoonTap, webtoonDoubleTap, webtoonPinch]
  );

  const animatedFlatListStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    alignSelf: "center",
    width: width,
  }));

  const nextPageHandler = useCallback(async () => {
    if (!mangaAll.nextChapter?.id) {
      alert("Não há próximo capítulo");
    } else {
      await nextPage();
    }
  }, [nextPage, mangaAll.nextChapter?.id]);

  const prevPageHandler = useCallback(async () => {
    if (!mangaAll.prevChapter?.id) {
      alert("Não há capítulo anterior");
    } else {
      await prevPage();
    }
  }, [prevPage, mangaAll.prevChapter?.id]);

  const handleFirstImageReady = useCallback(() => {
    setFirstImageReady(true);
  }, []);

  const renderHorizontalItem = useCallback(({ item, index }: { item: any; index: number }) => {
    if (item.type === "auxi-start") {
      return (
        <AuxiPage>
          <ChapterIndicator>
            <TitleText>Capítulo Atual</TitleText>
            {mangaAll?.currentChapter?.title && (
              <TitleText numberOfLines={1} ellipsizeMode="tail">{mangaAll.currentChapter.title}</TitleText>
            )}
            {mangaAll?.currentChapter.chapterNumber && (
              <TitleText>Cap. {mangaAll.currentChapter.chapterNumber}</TitleText>
            )}
          </ChapterIndicator>
          <ButtonNextPrevChapter onPress={prevPageHandler}>
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
            <TitleText>Próximo Capítulo</TitleText>
            {mangaAll?.nextChapter?.title && (
              <TitleText numberOfLines={1} ellipsizeMode="tail">{mangaAll.nextChapter.title}</TitleText>
            )}
          </ChapterIndicator>
          <ButtonNextPrevChapter onPress={nextPageHandler}>
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
            isZoomedShared.value = zoomed;
          }}
          onImageLoaded={index === 1 ? handleFirstImageReady : undefined}
        />
        {sepiaActive && <FilterOverlay color={FILTER_COLORS.sepia} opacity={filterOpacity} />}
        {darkActive && <FilterOverlay color={FILTER_COLORS.dark} opacity={filterOpacity} />}
      </ImageContainer>
    );
  }, [mangaAll, nextPageHandler, prevPageHandler, handleShowTitleBox, handleFirstImageReady, isZoomedShared, sepiaActive, darkActive, filterOpacity]);

  const renderWebtoonItem = useCallback(({ item }: { item: any }) => {
    if (item.type === "header") {
      return (
        <AuxiPage style={{ height: 200, borderBottomWidth: 1, borderColor: '#222' }}>
          <ButtonNextPrevChapter onPress={prevPageHandler} style={{ height: 50, width: 180 }}>
            <ButtonText style={{ fontSize: 14 }}>Capítulo Anterior</ButtonText>
          </ButtonNextPrevChapter>
        </AuxiPage>
      );
    }

    if (item.type === "footer") {
      return (
        <AuxiPage style={{ height: 250, borderTopWidth: 1, borderColor: '#222' }}>
          <ButtonNextPrevChapter onPress={nextPageHandler} style={{ height: 50, width: 180 }}>
            <ButtonText style={{ fontSize: 14 }}>Próximo Capítulo</ButtonText>
          </ButtonNextPrevChapter>
        </AuxiPage>
      );
    }

    return (
      <WebtoonImageWrapper windowHeight={height}>
        <React.Fragment>
          <Image
            source={{ uri: item.uri }}
            style={styles.webtoonImage}
            contentFit="contain"
          />
          {sepiaActive && <FilterOverlay color={FILTER_COLORS.sepia} opacity={filterOpacity} />}
          {darkActive && <FilterOverlay color={FILTER_COLORS.dark} opacity={filterOpacity} />}
        </React.Fragment>
      </WebtoonImageWrapper>
    );
  }, [prevPageHandler, nextPageHandler, sepiaActive, darkActive, filterOpacity, height]);

  return (
    <>
      {!chapterDataLoaded || (readingMode === "horizontal" && extendedList.length === 0) ? (
        <Indicator>
          <ActivityIndicator size="large" color="gray" />
          <Text style={{ color: "white", marginTop: 10 }}>Carregando capítulo...</Text>
        </Indicator>
      ) : readingMode === "horizontal" ? (
        <Carousel
          key={`horiz-${mangaAll.currentChapter.id}`}
          ref={carouselRef}
          windowSize={3}
          defaultIndex={1}
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
          onSnapToItem={setCurrentIndex}
          renderItem={renderHorizontalItem}
        />
      ) : (
        <GestureDetector gesture={webtoonCombinedGestures}>
          <Animated.FlatList
            key={`webtoon-list-${mangaAll.currentChapter.id}`}
            data={webtoonExtendedList}
            renderItem={renderWebtoonItem}
            keyExtractor={(item, index) => `wt-item-${index}`}
            showsVerticalScrollIndicator={false}
            style={[styles.flatListBase, animatedFlatListStyle]}
            contentContainerStyle={styles.flatListContent}
            
            // Otimizações de renderização nativa aplicadas para o modo vertical de Webtoon:
            removeClippedSubviews={Platform.OS === 'android'} // Seguro em listas dinâmicas no Android, evita quebra no iOS
            initialNumToRender={4} // Renderização inicial controlada
            maxToRenderPerBatch={4} // Carregamento progressivo para evitar telas brancas
            windowSize={5} // Viewport de carregamento estendido preventivo
            updateCellsBatchingPeriod={30} // Renderização mais ágil em scroll rápido
          />
        </GestureDetector>
      )}

      {showTitleBox && (
        <>
          <ChapterTopBox>
            <BackButton onPress={handlePressBackButton}>
              <Ionicons name="arrow-back" size={30} color="gray" />
            </BackButton>
            <TitleText>Cap. {mangaAll?.currentChapter.chapterNumber}</TitleText>
            {mangaAll?.currentChapter.title && (
              <TitleText numberOfLines={1} ellipsizeMode="tail">{mangaAll.currentChapter.title}</TitleText>
            )}
          </ChapterTopBox>

          {readingMode === "horizontal" && (
            <PageIndicatorBox>
              <PageIndicatorText>
                {currentIndex} / {extendedList.length > 2 ? extendedList.length - 2 : 0}
              </PageIndicatorText>
            </PageIndicatorBox>
          )}

          <GearButton onPress={() => setShowSettings((prev) => !prev)}>
            <Ionicons name="settings-sharp" size={24} color={showSettings ? "tomato" : "white"} />
          </GearButton>

          {showSettings && (
            <SettingsModal>
              <SliderLabelBox>
                <SliderLabel>Filtros de Cor (Ative múltiplos se quiser)</SliderLabel>
              </SliderLabelBox>

              <ButtonFilterGroup>
                <FilterButton 
                  active={!sepiaActive && !darkActive} 
                  onPress={() => {
                    setSepiaActive(false);
                    setDarkActive(false);
                  }}
                >
                  <ButtonText style={{ fontSize: 13 }}>Nenhum</ButtonText>
                </FilterButton>

                <FilterButton active={sepiaActive} onPress={() => setSepiaActive(!sepiaActive)}>
                  <ButtonText style={{ fontSize: 13, color: "#e69b19" }}>Sépia</ButtonText>
                </FilterButton>

                <FilterButton active={darkActive} onPress={() => setDarkActive(!darkActive)}>
                  <ButtonText style={{ fontSize: 13, color: "#888" }}>Escurecer</ButtonText>
                </FilterButton>
              </ButtonFilterGroup>

              {(sepiaActive || darkActive) && (
                <SliderRow>
                  <SliderLabelBox>
                    <SliderLabel>Intensidade da Opacidade</SliderLabel>
                    <SliderLabel>{Math.round(filterOpacity * 100)}%</SliderLabel>
                  </SliderLabelBox>
                  <Slider
                    style={{ width: "100%", height: 40 }}
                    minimumValue={0.05}
                    maximumValue={0.7}
                    minimumTrackTintColor="tomato"
                    maximumTrackTintColor="#444"
                    thumbTintColor="#fff"
                    value={filterOpacity}
                    onValueChange={setFilterOpacity}
                  />
                </SliderRow>
              )}

              <SliderLabelBox style={{ marginTop: 20 }}>
                <SliderLabel>Modo de Visualização</SliderLabel>
              </SliderLabelBox>
              <ModeButtonRow>
                <FilterButton 
                  active={readingMode === "horizontal"} 
                  onPress={() => setReadingMode("horizontal")}
                >
                  <Ionicons name="book-outline" size={16} color="white" style={{ marginBottom: 2 }} />
                  <ButtonText style={{ fontSize: 12 }}>Páginas</ButtonText>
                </FilterButton>

                <FilterButton 
                  active={readingMode === "webtoon"} 
                  onPress={() => setReadingMode("webtoon")}
                >
                  <Ionicons name="phone-portrait-outline" size={16} color="white" style={{ marginBottom: 2 }} />
                  <ButtonText style={{ fontSize: 12 }}>Webtoon</ButtonText>
                </FilterButton>
              </ModeButtonRow>

            </SettingsModal>
          )}
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  flatListBase: {
    flex: 1,
    backgroundColor: "black",
  },
  flatListContent: {
    backgroundColor: "black",
  },
  webtoonImage: {
    width: "100%",
    height: "100%",
  }
});