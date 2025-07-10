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

    if (mangaAll.nextChapter.id) {
      const responseNext = await GetPagesList(
        mangaAll.nextChapter.idFont,
        mangaAll.nextChapter.id
      );
      if (responseNext) {
        setNextMangaChapter(responseNext);
      }
    }

    if (mangaAll.nextChapter.id) {
      const responsePrev = await GetPagesList(
        mangaAll.prevChapter.idFont,
        mangaAll.prevChapter.id
      );
      if (responsePrev) {
        setPrevMangaChapter(responsePrev);
      }
    }
  };

  const fetchMangaNextChapterPage = async () => {
    if (!mangaAll.nextChapter?.id) {
      return;
    }

    setPrevMangaChapter(currentMangaChapter);
    setCurrentMangaChapter(nextMangaChapter);
    setNextMangaChapter([]);

    const response = await GetNextPagesList(
      mangaAll.nextChapter.idFont,
      mangaAll.nextChapter.id,
      mangaAll.nextChapter.idManga
    );

    setMangaAll((prevMangaAllState) => {
      let newNextChapterInfo = null;

      if (response) {
        // Se a API retornou um novo próximo capítulo
        newNextChapterInfo = {
          id: response.id,
          title: response.title,
          chapterNumber: response.chapterNumber,

          idFont: prevMangaAllState.nextChapter?.idFont,
          idManga: prevMangaAllState.nextChapter?.idManga,
        };
      } else {
      }

      // Retorna o novo estado completo do `mangaAll`
      return {
        ...prevMangaAllState, // Mantém as propriedades de nível superior do mangá (como mangaId, title, cover)
        prevChapter: prevMangaAllState.currentChapter, // O capítulo atual anterior se torna o novo anterior
        currentChapter: prevMangaAllState.nextChapter, // O antigo próximo capítulo se torna o atual (o que foi lido)
        nextChapter: newNextChapterInfo, // O NOVO próximo capítulo (será null se não houver mais)
      };
    });

    if (response) {
      setNextMangaChapter(response.list);
    } else {
      // Se não há mais capítulos, garanta que a lista de páginas futuras seja vazia.
      setNextMangaChapter([]);
    }
  };

  const fetchMangaPrevChapterPage = async () => {
    // 1. Verificação inicial: existe um ID para o capítulo anterior?
    // Se não houver, simplesmente retornamos (o alerta será tratado no Carrousel).
    if (!mangaAll.prevChapter?.id) {
      console.log("Não há um ID de capítulo anterior para buscar.");
      return;
    }

    // 2. Atualiza as listas de páginas no nível do Reader ANTES da requisição.
    // Isso prepara o terreno para o Carrossel exibir o 'prevMangaChapter' atual como 'current'.
    setNextMangaChapter(currentMangaChapter); // O atual se torna o novo próximo
    setCurrentMangaChapter(prevMangaChapter); // O anterior se torna o atual
    setPrevMangaChapter([]); // Limpa o anterior enquanto buscamos o novo

    // 3. Tenta buscar as páginas do "anterior" capítulo real.
    // Você precisará de uma função GetPrevPagesList similar à GetNextPagesList.
    // Se GetPrevPagesList não existir, use GetPagesList e ajuste a lógica de currentIndex.
    const response = await GetPrevPagesList(
      // Supondo que você tenha ou crie esta função
      mangaAll.prevChapter.idFont,
      mangaAll.prevChapter.id,
      mangaAll.prevChapter.idManga
    );

    // 4. Atualiza o estado `mangaAll` com base na resposta.
    // É crucial que `setMangaAll` seja executado sempre, para que o estado de `prevChapter`
    // seja atualizado MESMO se `response` for null.
    setMangaAll((prevMangaAllState) => {
      let newPrevChapterInfo = null; // Assume que não há capítulo anterior por padrão

      if (response) {
        // Se a API retornou um novo capítulo anterior, construa o objeto.
        newPrevChapterInfo = {
          id: response.id,
          title: response.title,
          chapterNumber: response.chapterNumber,
          // Inclua TODAS as outras propriedades necessárias do capítulo (idFont, idManga, etc.).
          idFont: prevMangaAllState.prevChapter?.idFont, // Usa a fonte do antigo prevChapter
          idManga: prevMangaAllState.prevChapter?.idManga, // Usa o ID do mangá do antigo prevChapter
        };
      } else {
      }

      // Retorna o novo estado completo do `mangaAll`
      return {
        ...prevMangaAllState, // Mantém as propriedades de nível superior do mangá
        nextChapter: prevMangaAllState.currentChapter, // O capítulo atual anterior se torna o novo próximo
        currentChapter: prevMangaAllState.prevChapter, // O antigo capítulo anterior se torna o atual (o que foi lido)
        prevChapter: newPrevChapterInfo, // O NOVO capítulo anterior (será null se não houver mais)
      };
    });

    // 5. Atualiza a lista de páginas para o Carrossel APÓS o `setMangaAll`.
    if (response) {
      setPrevMangaChapter(response.list); // Atualiza a lista de páginas do capítulo anterior
    } else {
      // Se não há mais capítulos anteriores, garanta que a lista de páginas anteriores seja vazia.
      setPrevMangaChapter([]);
    }
  };

  useEffect(() => {
    const load = async () => {
      await fetchMangaPage();
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
        prevPage={fetchMangaPrevChapterPage}
        list={currentMangaChapter}
        mangaAll={mangaAll}
      ></Carrousel>
    </Container>
  );
}
