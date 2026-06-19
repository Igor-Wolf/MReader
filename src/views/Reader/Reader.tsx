import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useLayoutEffect, useState } from "react";
import Carrousel from "../../components/Carrousel/Carrousel";
import { Container } from "./Styles";
import {
  MangaCoverModel,
  MangaPage,
  ReaderChapters,
} from "../../Models/MangaModel";
import { GetNextPagesList, GetPagesList, GetPrevPagesList } from "./actions";
import { createChapter } from "../../database/Crud/chapter";
import { createReadChapter } from "../../database/Crud/readChapter";
import { useRealm } from "../../context/RealmContext";

export default function Reader() {
  const { realm, isLoading } = useRealm();
  const navigation = useNavigation();
  const route = useRoute();
  const manga: any = route.params?.objeto;

  const [currentMangaChapter, setCurrentMangaChapter] = useState<MangaPage[]>(
    []
  );
  const [nextMangaChapter, setNextMangaChapter] = useState<MangaPage[]>([]);
  const [prevMangaChapter, setPrevMangaChapter] = useState<MangaPage[]>([]);

  // O estado inicial de mangaAll agora reflete a estrutura de ReaderChapters
  const [mangaAll, setMangaAll] = useState<ReaderChapters>(manga);
  const [chapterDataLoaded, setChapterDataLoaded] = useState(false); // Novo estado para controlar o carregamento

  const fetchMangaPage = async () => {
    // 🛡️ Segurança: Evita disparar as ações se o Realm ainda não carregou no Contexto
    if (!realm || isLoading) return;

    // Dispara todas as chamadas passando a instância ativa do realm
    const [responseCurrent, responseNext, responsePrev] = await Promise.all([
      GetPagesList(realm, mangaAll.currentChapter.idFont, mangaAll.currentChapter.id),
      GetNextPagesList(
        realm,
        mangaAll.currentChapter.idFont,
        mangaAll.currentChapter.id,
        mangaAll.currentChapter.idManga
      ),
      GetPrevPagesList(
        realm,
        mangaAll.currentChapter.idFont,
        mangaAll.currentChapter.id,
        mangaAll.currentChapter.idManga
      ),
    ]);

    // Atualiza o estado com as respostas
    if (responseCurrent) {
      setCurrentMangaChapter(responseCurrent);
    }

    setMangaAll((prevMangaAllState) => {
      let newNextChapterInfo = null;
      if (responseNext) {
        newNextChapterInfo = {
          id: responseNext.id,
          title: responseNext.title,
          chapterNumber: responseNext.chapterNumber,
          idFont: prevMangaAllState.currentChapter?.idFont,
          idManga: prevMangaAllState.currentChapter?.idManga,
        };
      } else {
        newNextChapterInfo = {
          id: null,
          title: null,
          chapterNumber: null,
          idFont: null,
          idManga: null,
        };
      }

      let newPrevChapterInfo = null;
      if (responsePrev) {
        newPrevChapterInfo = {
          id: responsePrev.id,
          title: responsePrev.title,
          chapterNumber: responsePrev.chapterNumber,
          idFont: prevMangaAllState.currentChapter?.idFont,
          idManga: prevMangaAllState.currentChapter?.idManga,
        };
      } else {
        newPrevChapterInfo = {
          id: null,
          title: null,
          chapterNumber: null,
          idFont: null,
          idManga: null,
        };
      }

      return {
        ...prevMangaAllState,
        prevChapter: newPrevChapterInfo,
        currentChapter: prevMangaAllState.currentChapter,
        nextChapter: newNextChapterInfo,
      };
    });

    if (responseNext) {
      setNextMangaChapter(responseNext.list);
    } else {
      setNextMangaChapter([]);
    }

    if (responsePrev) {
      setPrevMangaChapter(responsePrev.list);
    } else {
      setPrevMangaChapter([]);
    }
    setChapterDataLoaded(true); // Marca que os dados do capítulo foram carregados
  };

  //--------------------------------------------- Fetch NextPrev Index

  const fetchMangaNextChapterPage = async () => {
    setChapterDataLoaded(false);

    if (!mangaAll.nextChapter?.id) {
      console.log("Não há próximo capítulo para buscar.");
      setChapterDataLoaded(true);
      return;
    }

    setPrevMangaChapter(currentMangaChapter); // O capítulo atual se torna o anterior
    setCurrentMangaChapter(nextMangaChapter); // O próximo se torna o atual
    setNextMangaChapter([]); // Limpa o próximo enquanto buscamos o novo

    const response = await GetNextPagesList(
      realm,
      mangaAll.nextChapter.idFont,
      mangaAll.nextChapter.id,
      mangaAll.nextChapter.idManga
    );

    setMangaAll((prevMangaAllState) => {
      let newNextChapterInfo = null;

      if (response) {
        newNextChapterInfo = {
          id: response.id,
          title: response.title,
          chapterNumber: response.chapterNumber,
          idFont: prevMangaAllState.nextChapter?.idFont,
          idManga: prevMangaAllState.nextChapter?.idManga,
        };
      } else {
        newNextChapterInfo = {
          id: null,
          title: null,
          chapterNumber: null,
          idFont: null,
          idManga: null,
        };
      }

      return {
        ...prevMangaAllState,
        prevChapter: prevMangaAllState.currentChapter,
        currentChapter: prevMangaAllState.nextChapter,
        nextChapter: newNextChapterInfo,
      };
    });

    if (response) {
      setNextMangaChapter(response.list);
    } else {
      setNextMangaChapter([]);
    }
    setChapterDataLoaded(true);
  };

  const fetchMangaPrevChapterPage = async () => {
    setChapterDataLoaded(false);

    if (!mangaAll.prevChapter?.id) {
      console.log("Não há um ID de capítulo anterior para buscar.");
      setChapterDataLoaded(true);
      return;
    }

    setNextMangaChapter(currentMangaChapter); // O capítulo atual se torna o próximo
    setCurrentMangaChapter(prevMangaChapter); // O anterior se torna o atual
    setPrevMangaChapter([]); // Limpa o anterior enquanto buscamos o novo

    const response = await GetPrevPagesList(
      realm,
      mangaAll.prevChapter.idFont,
      mangaAll.prevChapter.id,
      mangaAll.prevChapter.idManga
    );

    setMangaAll((prevMangaAllState) => {
      let newPrevChapterInfo = null;

      if (response) {
        newPrevChapterInfo = {
          id: response.id,
          title: response.title,
          chapterNumber: response.chapterNumber,
          idFont: prevMangaAllState.prevChapter?.idFont,
          idManga: prevMangaAllState.prevChapter?.idManga,
        };
      } else {
        newPrevChapterInfo = {
          id: null,
          title: null,
          chapterNumber: null,
          idFont: null,
          idManga: null,
        };
      }

      return {
        ...prevMangaAllState,
        nextChapter: prevMangaAllState.currentChapter,
        currentChapter: prevMangaAllState.prevChapter,
        prevChapter: newPrevChapterInfo,
      };
    });

    if (response) {
      setPrevMangaChapter(response.list);
    } else {
      setPrevMangaChapter([]);
    }
    setChapterDataLoaded(true);
  };

  // 🔥 Esse useEffect agora aguarda explicitamente o banco carregar para não disparar chamadas nulas
  useEffect(() => {
    if (realm && !isLoading) {
      fetchMangaPage();
    }
  }, [mangaAll.currentChapter.id, realm, isLoading]); 

  const handleCarouselReady = () => {};

  useLayoutEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { display: "none" } });
    return () => {
      parent?.setOptions({
        tabBarStyle: {
          backgroundColor: "black",
          borderTopColor: "black",
          height: 100,
        },
      });
    };
  }, [navigation]);

  useEffect(() => {
    if (realm && mangaAll.currentChapter?.id && !isLoading) {
      handlePressAddChapter();
    }
  }, [realm, isLoading, mangaAll.currentChapter?.id]);

  const handlePressAddChapter = async () => {
    const chapterData = {
      idChap: mangaAll.currentChapter.id?.toString(),
      idFont: mangaAll.currentChapter.idFont,
      idManga: mangaAll.currentChapter.idManga.toString(),
      coverImage: manga.currentChapter.coverImage,
      titleManga: manga.currentChapter.titleManga,
      chapterNumber: mangaAll.currentChapter.chapterNumber?.toString(),
      title: mangaAll.currentChapter.title,
    };

    await Promise.all([
      createChapter(realm, chapterData),
      createReadChapter(realm, chapterData),
    ]);
  };

  return (
    <Container>
      <Carrousel
        nextPage={fetchMangaNextChapterPage}
        prevPage={fetchMangaPrevChapterPage}
        list={currentMangaChapter} 
        mangaAll={mangaAll}
        navigation={navigation}
        chapterDataLoaded={chapterDataLoaded} 
        onCarouselReady={handleCarouselReady} 
      ></Carrousel>
    </Container>
  );
}