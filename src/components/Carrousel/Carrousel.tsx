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
  chapterDataLoaded: boolean;
  onCarouselReady: () => void;
}

export default function Carrousel({
  list,
  nextPage,
  prevPage,
  mangaAll,
  navigation,
  chapterDataLoaded,
  onCarouselReady,
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

  const extendedList = useMemo(() => {
    if (!list || list.length === 0) return [];
    return [
      { type: "auxi-start" },
      ...list.map((item) => ({ type: "page", uri: item })),
      { type: "auxi-end" },
    ];
  }, [list]);

  useEffect(() => {
    isZoomedShared.value = isZoomed;
  }, [isZoomed, isZoomedShared]);

  useEffect(() => {
    if (mangaAll.currentChapter.id !== currentChapterIdRef.current) {
      setFirstImageReady(false);
      setHasScrolled(false); // reset scroll control
      currentChapterIdRef.current = mangaAll.currentChapter.id;
    }
  }, [mangaAll.currentChapter.id]);

  useEffect(() => {
    if (
      chapterDataLoaded &&
      firstImageReady &&
      extendedList.length > 0 &&
      !hasScrolled
    ) {
      const interaction = InteractionManager.runAfterInteractions(() => {
        if (carouselRef.current) {
          carouselRef.current.scrollTo({
            index: 1,
            animated: false,
          });
          setCurrentIndex(1);
          setHasScrolled(true);
          onCarouselReady();
          setFirstImageReady(false);
        }
      });
      return () => interaction.cancel();
    }
  }, [
    chapterDataLoaded,
    firstImageReady,
    extendedList.length,
    hasScrolled,
    onCarouselReady,
  ]);

  const handlePressBackButton = () => navigation.goBack();

  const handleShowTitleBox = () => {
    setShowTitleBox(!showTitleBox);
  };

  const nextPageHandler = useCallback(async () => {
    if (!mangaAll.nextChapter?.id) {
      alert("Não há proximo capitulo")
    } else {
      
      await nextPage();
    }
  }, [nextPage]);

  const prevPageHandler = useCallback(async () => {
    if (!mangaAll.prevChapter?.id) {
      alert("Não há capitulo anterior")
    } else {
      await prevPage();
    }
  }, [prevPage]);

  const handleFirstImageReady = useCallback(() => {
    setFirstImageReady(true);
  }, []);

  return (
    <>
      {extendedList.length > 0 ? (
        <Carousel
          key={mangaAll.currentChapter.id} // força remount ao trocar capítulo
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
                      <TitleText>{mangaAll.currentChapter.title}</TitleText>
                    )}
                    {mangaAll?.currentChapter.chapterNumber && (
                      <TitleText>
                        Cap. {mangaAll.currentChapter.chapterNumber}
                      </TitleText>
                    )}
                  </ChapterIndicator>
                  <ChapterIndicator>
                    <TitleText>Capítulo Anterior</TitleText>
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
                      <TitleText>{mangaAll.currentChapter.title}</TitleText>
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
                      <TitleText>{mangaAll.nextChapter.title}</TitleText>
                    )}
                    {mangaAll?.nextChapter?.chapterNumber && (
                      <TitleText>
                        Cap. {mangaAll.nextChapter.chapterNumber}
                      </TitleText>
                    )}
                  </ChapterIndicator>
                  <ButtonNextPrevChapter
                    onPress={nextPageHandler}
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
                  onImageLoaded={index === 1 ? handleFirstImageReady : undefined}
                />
              </ImageContainer>
            );
          }}
        />
      ) : (
        <Indicator>
          <ActivityIndicator size="large" color="gray" />
          <Text style={{ color: "white", marginTop: 10 }}>
            Carregando capítulo...
          </Text>
        </Indicator>
      )}

      {currentIndex > 0 &&
        currentIndex < extendedList.length - 1 &&
        showTitleBox && (
          <>
            <ChapterTopBox>
              <BackButton onPress={handlePressBackButton}>
                <Ionicons name="arrow-back" size={30} color="gray" />
              </BackButton>
              <TitleText>Cap. {mangaAll?.currentChapter.chapterNumber}</TitleText>
              {mangaAll?.currentChapter.title && (
                <TitleText>{mangaAll.currentChapter.title}</TitleText>
              )}
            </ChapterTopBox>

            <PageIndicatorBox>
              <PageIndicatorText>
                {currentIndex} / {extendedList.length > 2 ? extendedList.length - 2 : 0}
              </PageIndicatorText>
            </PageIndicatorBox>
          </>
        )}
    </>
  );
}
