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
    // Dispara todas as chamadas de API em paralelo
    const [responseCurrent, responseNext, responsePrev] = await Promise.all([
      GetPagesList(mangaAll.currentChapter.idFont, mangaAll.currentChapter.id),
      GetNextPagesList(
        mangaAll.currentChapter.idFont,
        mangaAll.currentChapter.id,
        mangaAll.currentChapter.idManga
      ),
      GetPrevPagesList(
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
          // Garante que idFont e idManga sejam passados se o capítulo existir
          idFont: prevMangaAllState.currentChapter?.idFont, // Ou responseNext.idFont se sua API retornar
          idManga: prevMangaAllState.currentChapter?.idManga, // Ou responseNext.idManga se sua API retornar
        };
      } else {
        // Se não há responseNext, define todas as propriedades do próximo capítulo como null
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
          // Garante que idFont e idManga sejam passados se o capítulo existir
          idFont: prevMangaAllState.currentChapter?.idFont, // Ou responsePrev.idFont se sua API retornar
          idManga: prevMangaAllState.currentChapter?.idManga, // Ou responsePrev.idManga se sua API retornar
        };
      } else {
        // Se não há responsePrev, define todas as propriedades do capítulo anterior como null
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
        currentChapter: prevMangaAllState.currentChapter, // O currentChapter permanece o mesmo após o fetch inicial
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
    // Reset o estado de carregamento para que o carrossel possa re-inicializar
    setChapterDataLoaded(false);

    // Se não há próximo capítulo, apenas alerta e não faz nada
    if (!mangaAll.nextChapter?.id) {
      console.log("Não há próximo capítulo para buscar.");
      setChapterDataLoaded(true); // Se não há próximo, consideramos "carregado" para evitar spinner infinito
      return;
    }

    // Move as listas de páginas ANTES de fazer a requisição do próximo
    setPrevMangaChapter(currentMangaChapter); // O capítulo atual se torna o anterior
    setCurrentMangaChapter(nextMangaChapter); // O próximo se torna o atual
    setNextMangaChapter([]); // Limpa o próximo enquanto buscamos o novo

    const response = await GetNextPagesList(
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
        // Se não há response, define todas as propriedades do próximo capítulo como null
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
        prevChapter: prevMangaAllState.currentChapter, // O capítulo que era atual se torna o anterior
        currentChapter: prevMangaAllState.nextChapter, // O capítulo que era o próximo se torna o atual
        nextChapter: newNextChapterInfo, // O NOVO próximo capítulo (pode ser null)
      };
    });

    if (response) {
      setNextMangaChapter(response.list);
    } else {
      setNextMangaChapter([]);
    }
    setChapterDataLoaded(true); // Marca que os dados do novo capítulo foram carregados
  };

  const fetchMangaPrevChapterPage = async () => {
    // Reset o estado de carregamento
    setChapterDataLoaded(false);

    if (!mangaAll.prevChapter?.id) {
      console.log("Não há um ID de capítulo anterior para buscar.");
      setChapterDataLoaded(true); // Se não há anterior, consideramos "carregado"
      return;
    }

    // Move as listas de páginas ANTES de fazer a requisição do anterior
    setNextMangaChapter(currentMangaChapter); // O capítulo atual se torna o próximo
    setCurrentMangaChapter(prevMangaChapter); // O anterior se torna o atual
    setPrevMangaChapter([]); // Limpa o anterior enquanto buscamos o novo

    const response = await GetPrevPagesList(
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
        // Se não há response, define todas as propriedades do capítulo anterior como null
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
        nextChapter: prevMangaAllState.currentChapter, // O capítulo que era atual se torna o próximo
        currentChapter: prevMangaAllState.prevChapter, // O capítulo que era o anterior se torna o atual
        prevChapter: newPrevChapterInfo, // O NOVO capítulo anterior (pode ser null)
      };
    });

    if (response) {
      setPrevMangaChapter(response.list);
    } else {
      setPrevMangaChapter([]);
    }
    setChapterDataLoaded(true); // Marca que os dados do novo capítulo foram carregados
  };

  useEffect(() => {
    const load = async () => {
      await fetchMangaPage();
    };
    load();
  }, [mangaAll.currentChapter.id]); // Adicionei dependency para recarregar se o currentChapter.id mudar externamente (ex: de MangaDetails)

  // Função para ser chamada quando o carrossel estiver pronto e posicionado
  const handleCarouselReady = () => {};

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

  useEffect(() => {
    // Verifica se realm e currentChapter estão disponíveis antes de tentar salvar
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
        list={currentMangaChapter} // Passa a lista de páginas do capítulo atual
        mangaAll={mangaAll}
        navigation={navigation}
        chapterDataLoaded={chapterDataLoaded} // Passa o estado de carregamento
        onCarouselReady={handleCarouselReady} // Passa a função de callback
      ></Carrousel>
    </Container>
  );
}
