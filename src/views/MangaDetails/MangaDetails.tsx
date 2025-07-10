import { useNavigation, useRoute } from "@react-navigation/native";
import { Image, Text } from "react-native";
import HeaderExtention from "../../components/HeaderExtentionFont";
import {
  ChapterBottomBox,
  ChapterBox,
  ChapterTextBottom,
  ChapterTextTop,
  ChapterTopBox,
  Container,
  ImageManga,
  InfoContainer,
  MidleContainer,
  NormalText,
  NormalTextTop,
  ScrollContainer,
  TagsBox,
  TagsContainer,
  TitleManga,
  TopContainer,
} from "./styles";
import {
  MangaChapterModel,
  MangaCoverModel,
  MangaDetailsModel,
} from "../../Models/MangaModel";
import { GetChapterList, GetMangaDetails } from "./action";
import { useEffect, useState } from "react";
import { DateConvert } from "../../utils/convertDate";
import { CharCount } from "../../utils/caracterCounter";
import HeaderChapters from "../../components/HeaderChapters";

export default function MangaDetails() {
  const navigation = useNavigation();

  const route = useRoute();
  const manga: MangaCoverModel = route.params?.objeto;
  const [mangaDetails, setMangaDetails] = useState<MangaDetailsModel | null>(
    null
  );
  const [chapterList, setChapterList] = useState<MangaChapterModel[]>([]);
  const fetchManga = async () => {
    const response = await GetMangaDetails(manga.idFont, manga.id);
    if (response) {
      return response;
    }
  };

  const fetchChapterList = async () => {
    const response = await GetChapterList(manga.idFont, manga.id);
    if (response) {
      return response;
    }
  };

  const refreshPage = async () => {
    try {
      const [response, responseChapter] = await Promise.all([
        fetchManga(),
        fetchChapterList(),
      ]);

      if (response) {
        setMangaDetails(response);
      }
      if (responseChapter) {
        setChapterList(responseChapter);
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };

  const onPressChapter = (chapter: string, indexList: number) => {
    
    
    const objeto = {
      currentChapter: {
        id: chapter,
        idFont: manga.idFont,
        idManga: manga.id,
        chapterNumber: chapterList[indexList].chapter,
        title: chapterList[indexList].title
      },
      nextChapter: {
        id: chapterList[indexList - 1]?.id || null,
        idFont: manga.idFont,
        idManga: manga.id,
        chapterNumber: chapterList[indexList - 1]?.chapter || null,
        title: chapterList[indexList -1]?.title || null
      },
      prevChapter: {
        id: chapterList[indexList + 1]?.id || null,
        idFont: manga.idFont,
        idManga: manga.id,
        chapterNumber: chapterList[indexList + 1]?.chapter || null,
        title: chapterList[indexList +1]?.title || null
      },
    };

    navigation.navigate("Reader", { objeto });
  };

  useEffect(() => {
    refreshPage();
  }, []);

  return (
    <Container>
      <HeaderChapters
        name={manga.slug}
        navigation={navigation}
      ></HeaderChapters>

      <ScrollContainer>
        <TopContainer>
          <ImageManga source={{ uri: manga.coverImage }} resizeMode="cover" />
          <InfoContainer>
            <TitleManga>{manga.slug}</TitleManga>
            <NormalTextTop>Artist: {mangaDetails?.artist}</NormalTextTop>
            <NormalTextTop>Autor: {mangaDetails?.author}</NormalTextTop>
            <NormalTextTop>Status: {mangaDetails?.status}</NormalTextTop>
          </InfoContainer>
        </TopContainer>
        <MidleContainer>
          <NormalText>{mangaDetails?.description}</NormalText>
          <NormalText>{mangaDetails?.description}</NormalText>
          <TagsContainer>
            {mangaDetails?.tags?.map((item, index) => (
              <TagsBox key={index}>
                <NormalText>{item}</NormalText>
              </TagsBox>
            ))}
          </TagsContainer>
        </MidleContainer>
        <ChapterTextTop>
          {chapterList?.length ? chapterList.length : null} Capítulos
        </ChapterTextTop>
        {chapterList?.map((item, index) => (
          <ChapterBox
            key={index}
            onPress={() => onPressChapter(item.id, index)}
          >
            <ChapterTopBox>
              <ChapterTextTop>Vol.{item.volume}</ChapterTextTop>
              <ChapterTextTop>Ch.{item.chapter}</ChapterTextTop>
              <ChapterTextTop>
                {item.title && CharCount(item.title)}
              </ChapterTextTop>
            </ChapterTopBox>
            <ChapterBottomBox>
              <ChapterTextBottom>
                {item.date ? DateConvert(item.date) : null}
              </ChapterTextBottom>
              <ChapterTextBottom> - </ChapterTextBottom>
              <ChapterTextBottom>{item.scanName}</ChapterTextBottom>
            </ChapterBottomBox>
          </ChapterBox>
        ))}
      </ScrollContainer>
    </Container>
  );
}
