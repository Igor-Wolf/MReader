import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useLayoutEffect, useState } from "react";
import Carrousel from "../../components/Carrousel/Carrousel";
import { Container } from "./Styles";
import {
  MangaCoverModel,
  MangaPage,
  ReaderChapters,
} from "../../Models/MangaModel";
import { GetNextPagesList, GetPagesList } from "./actions";

export default function Reader() {
  const navigation = useNavigation();
  const route = useRoute();
  const manga: any = route.params?.objeto;

  const [currentMangaChapter, setCurrentMangaChapter] = useState<MangaPage[]>(
    []
  );
  const [nextMangaChapter, setNextMangaChapter] = useState<MangaPage[]>([]);
  const [prevMangaChapter, setPrevMangaChapter] = useState<MangaPage[]>([]);

  const [mangaAll, setMangaAll] = useState<ReaderChapters>(manga);

  const fetchMangaPage = async () => {
    const responseCurrent = await GetPagesList(
      mangaAll.currentChapter.idFont,
      mangaAll.currentChapter.id
    );
    if (responseCurrent) {
      setCurrentMangaChapter(responseCurrent);
    }

    const responseNext = await GetPagesList(
      mangaAll.nextChapter.idFont,
      mangaAll.nextChapter.id
    );
    if (responseNext) {
      setNextMangaChapter(responseNext);
    }

    const responsePrev = await GetPagesList(
      mangaAll.prevChapter.idFont,
      mangaAll.prevChapter.id
    );
    if (responsePrev) {
      setPrevMangaChapter(responsePrev);
    }
  };

  const fetchMangaNextChapterPage = async () => {
    setPrevMangaChapter([...currentMangaChapter]);
setCurrentMangaChapter([...nextMangaChapter]);
    const response = await GetNextPagesList(
      mangaAll.nextChapter.idFont,
      mangaAll.nextChapter.id,
      mangaAll.nextChapter.idManga
    );
    if (response) {
      setNextMangaChapter(response.list);

      setMangaAll((prev) => {
        const old = prev.prevChapter;
        const current = prev.currentChapter;
        const newChap = prev.nextChapter;

        return {
          ...prev,
          prevChapter: {
            ...current, // substitui todo o prevChapter pelo conteúdo completo do currentChapter
          },
          currentChapter: {
            ...newChap, // substitui o currentChapter pelo conteúdo completo do nextChapter
          },
          nextChapter: {
            ...newChap,
            id: response.id,
            title: response.title,
            chapterNumber: response.chapterNumber,
          },
        };
      });
    }
    console.log(mangaAll.currentChapter.chapterNumber);
  };

  useEffect(() => {
    const load = async () => {
      // console.log(`Prev:${manga.prevChapter.chapterNumber}, Current:${manga.currentChapter.chapterNumber}, next:${manga.nextChapter.chapterNumber}`)
      await fetchMangaPage();
      // console.log(`Prev:${mangaAll.prevChapter.chapterNumber}, Current:${mangaAll.currentChapter.chapterNumber}, next:${mangaAll.nextChapter.chapterNumber}`)
    };
    load();
  }, []);

  useLayoutEffect(() => {
    const parent = navigation.getParent(); //pegando o tab navigation
    parent?.setOptions({ tabBarStyle: { display: "none" } });
    return () => {
      parent?.setOptions({
        tabBarStyle: {
          backgroundColor: "black", // cor de fundo da barra inferior
          borderTopColor: "black", // remover borda superior, se quiser
          height: 100, // opcional: altura da barra
        },
      });
    };
  }, [navigation]);

  return (
    <Container>
      <Carrousel
        nextPage={fetchMangaNextChapterPage}
        list={currentMangaChapter}
        mangaAll={mangaAll}
      ></Carrousel>
    </Container>
  );
}
