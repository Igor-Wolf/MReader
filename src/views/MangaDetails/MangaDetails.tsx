import { useNavigation, useRoute } from "@react-navigation/native";
import { Button, Image, Text } from "react-native";
import HeaderExtention from "../../components/HeaderExtentionFont";
import {
  ButtonsSetings,
  ChapterBottomBox,
  ChapterBox,
  ChapterTextBottom,
  ChapterTextTop,
  ChapterTopBox,
  Container,
  ImageManga,
  InfoContainer,
  MidleContainer,
  NewLangBox,
  NormalText,
  NormalTextTop,
  ScrollContainer,
  StyledPicker,
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
import {
  GetChapterList,
  GetChapterListAnotherLanguage,
  GetMangaDetails,
} from "./action";
import { useEffect, useState } from "react";
import { DateConvert } from "../../utils/convertDate";
import HeaderChapters from "../../components/HeaderChapters";
import { createManga } from "../../database/Crud/manga";
import { useRealm } from "../../context/RealmContext";
import ChapterPopup from "../../components/ChapterPopup";
import { toggleReadChapter } from "../../database/Crud/readChapter"; 
import { Picker } from "@react-native-picker/picker";

export default function MangaDetails() {
  const navigation = useNavigation();
  const { realm, isLoading } = useRealm();

  const route = useRoute();
  const manga: MangaCoverModel = route.params?.objeto;
  const [selectedLanguage, setSelectedLanguage] = useState();
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
  const fetchChapterListByLang = async (lang: string) => {
    const response = await GetChapterListAnotherLanguage(
      manga.idFont,
      manga.id,
      lang
    );
    if (response) {
      setChapterList(response);
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
        titleManga: manga.slug,
        coverImage: manga.coverImage,
        chapterNumber: chapterList[indexList].chapter,
        title: chapterList[indexList].title,
      },
    };

    navigation.navigate("Reader", { objeto });
  };

  const onLongPressChapter = async (chapter: string, indexList: number) => {
    const chapterData = {
      idChap: chapter?.toString(),
      idFont: manga.idFont,
      idManga: manga.id?.toString(),
      titleManga: manga.slug,
      coverImage: manga.coverImage,
      chapterNumber: chapterList[indexList].chapter?.toString(),
      title: chapterList[indexList].title,
    };

    const message = await toggleReadChapter(realm, chapterData);
  };

  const handlePressAdd = async () => {
    const response: string = await createManga(realm, {
      id: manga.id,
      idFont: manga.idFont,
      slug: manga.slug,
      coverImage: manga.coverImage,
    });

    if (response) {
      alert(response);
    }
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
          <ImageManga
            source={{
              uri: manga.coverImage
                ? manga.coverImage
                : mangaDetails?.coverImage ?? undefined,
            }}
            contentFit="cover"
          />
          <InfoContainer>
            <TitleManga>{manga.slug}</TitleManga>
            <NormalTextTop>Artist: {mangaDetails?.artist}</NormalTextTop>
            <NormalTextTop>Autor: {mangaDetails?.author}</NormalTextTop>
            <NormalTextTop>Year: {mangaDetails?.year}</NormalTextTop>
            <NormalTextTop>Status: {mangaDetails?.status}</NormalTextTop>
          </InfoContainer>
        </TopContainer>
        <ButtonsSetings>
          <Button title="Add" onPress={handlePressAdd}></Button>
        </ButtonsSetings>

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

        <NewLangBox>
          <ChapterTextTop style={{ paddingLeft: 5 }}>
            {chapterList?.length ? chapterList.length : null} Capítulos
          </ChapterTextTop>
          <StyledPicker
            selectedValue={selectedLanguage}
            onValueChange={(value) => {
              setSelectedLanguage(value); // se quiser atualizar o estado também
              fetchChapterListByLang(value); // chama a função com o valor selecionado
            }}
            mode="dropdown"
            dropdownIconColor="#FF6347"
          >
            <Picker.Item label="EN" value="en" />
            <Picker.Item label="PT" value="pt-br" />
            <Picker.Item label="ES" value="es" />
          </StyledPicker>
        </NewLangBox>
        {chapterList?.map((item, index) => (
          <ChapterBox
            key={index}
            onPress={() => onPressChapter(item.id, index)}
            onLongPress={() => onLongPressChapter(item.id, index)}
          >
            <ChapterPopup
              idFont={manga.idFont}
              idManga={manga.id}
              idChap={item.id}
            ></ChapterPopup>
            <ChapterTopBox>
              {item.volume && (
                <ChapterTextTop>Vol.{item.volume}</ChapterTextTop>
              )}
              {item.chapter && (
                <ChapterTextTop>Ch.{item.chapter}</ChapterTextTop>
              )}
              {item.title && (
                <ChapterTextTop numberOfLines={1} ellipsizeMode="tail" style={{flex: 1}}>{item.title}</ChapterTextTop>
              )}
            </ChapterTopBox>
            <ChapterBottomBox>
              <ChapterTextBottom>
                {item.date ? DateConvert(item.date) : null}
              </ChapterTextBottom>
              <ChapterTextBottom> - </ChapterTextBottom>
              <ChapterTextBottom numberOfLines={1} ellipsizeMode="tail" style={{flex: 1}}>{item.scanName}</ChapterTextBottom>
            </ChapterBottomBox>
          </ChapterBox>
        ))}
      </ScrollContainer>
    </Container>
  );
}
