import { HqNowApi } from "../api/HqNowApi";
import {
  MangaChapterModel,
  MangaCoverModel,
  MangaDetailsModel,
  MangaPage,
  NextPrevMangaPage,
} from "../Models/MangaModel";

// Definindo tipagem da resposta da API
interface HqNowApiResponse {
  data: {
    getRecentlyUpdatedHqs: {
      id: number;
      name: string;
      hqCover: string;
      synopsis?: string;
      updatedAt: string;
      updatedChapters: any[];
    }[];
  };
}

interface HqNowPopularResponse {
  data: {
    getHqsByFilters: {
      id: number;
      name: string;
      hqCover: string;
      synopsis: string;
      updatedAt: string;
    }[];
  };
}

export const GetAllMangaHqNow = async (
  pagination: number,
  idFont: number,
  publisherId?: number
): Promise<MangaCoverModel[]> => {
  const limit = 100;
  const query = `
    query getHqsByFilters(
      \$orderByViews: Boolean,
      \$limit: Int,
      \$publisherId: Int,
      \$loadCovers: Boolean
    ) {
      getHqsByFilters(
        orderByViews: \$orderByViews,
        limit: \$limit,
        publisherId: \$publisherId,
        loadCovers: \$loadCovers
      ) {
        id
        name
        hqCover
        synopsis
        updatedAt
      }
    }
  `;

  const payload = {
    operationName: "getHqsByFilters",
    query,
    variables: {
      orderByViews: false, // você pode colocar true se quiser ordenar pelos mais vistos
      loadCovers: true,
      limit,
      ...(publisherId && { publisherId }),
    },
  };

  try {
    const response = await HqNowApi.post("", payload);
    const mangaList = response.data.data.getHqsByFilters;
    return mangaList.map((manga: any) => ({
      id: manga.id,
      idFont,
      slug: manga.name ?? "No Title",
      coverImage: manga.hqCover ?? "",
    }));
  } catch (error) {
    console.error("Erro ao buscar HQs com filtros:", error);
    return [];
  }
};

export const GetPopularMangaHqNow = async (
  pagination: number,
  idFont: number,
  publisherId?: number
): Promise<MangaCoverModel[]> => {
  const limit = 200;
  const query = `
    query getHqsByFilters(
      \$orderByViews: Boolean,
      \$limit: Int,
      \$publisherId: Int,
      \$loadCovers: Boolean
    ) {
      getHqsByFilters(
        orderByViews: \$orderByViews,
        limit: \$limit,
        publisherId: \$publisherId,
        loadCovers: \$loadCovers
      ) {
        id
        name
        editoraId
        status
        publisherName
        hqCover
        synopsis
        updatedAt
      }
    }
  `;

  const payload = {
    operationName: "getHqsByFilters",
    query,
    variables: {
      orderByViews: true,
      loadCovers: true,
      limit,
      ...(publisherId && { publisherId }), // inclui publisherId se for fornecido
    },
  };

  try {
    const response = await HqNowApi.post<HqNowPopularResponse>("", payload);
    if (response.status === 200 && response.data.data?.getHqsByFilters) {
      return response.data.data.getHqsByFilters.map((manga) => ({
        id: manga.id,
        idFont: idFont,
        slug: manga.name ?? "No Title",
        coverImage: manga.hqCover ?? "",
      }));
    }

    return [];
  } catch (error) {
    console.error("Erro ao buscar HQs populares:", error);
    return [];
  }
};

export const GetMangaByNameHqNow = async (
  pagination: number,
  idFont: number,
  slug: string
): Promise<MangaCoverModel[]> => {
  const query = `
    query getHqsByName(\$name: String!) {
      getHqsByName(name: \$name) {
        id
        name
        hqCover
        synopsis
        updatedAt
      }
    }
  `;

  const payload = {
    operationName: "getHqsByName",
    query,
    variables: {
      name: slug,
      limit: 20,
    },
  };

  try {
    const response = await HqNowApi.post("", payload);
    const results = response.data.data?.getHqsByName;

    if (!results || !Array.isArray(results)) {
      return [];
    }

    // Usar Promise.all para esperar todas as requisições assíncronas
    const mangas = await Promise.all(
      results.map(async (manga: any) => {
        const res = await GetMangaByIDHqNow(manga.id);

        return {
          id: manga.id,
          idFont,
          slug: manga.name ?? "No Title",
          coverImage: res?.coverImage ?? manga.hqCover ?? "",
          // Aqui você pode incluir outras informações que venha de `res` após a chamada assíncrona
        };
      })
    );

    return mangas;
  } catch (error) {
    console.error("Erro na busca de HQs:", error);
    return [];
  }
};

export const GetMangaByIDHqNow = async (
  idManga: number // Garantir que seja um número, como o GraphQL espera
): Promise<MangaDetailsModel | null> => {
  const query = `
    query getHqsById($id: Int!) { 
      getHqsById(id: $id) { 
        id 
        name 
        synopsis 
        hqCover 
        publisherName 
        status 
        updatedAt 
        capitulos { id name number } 
      } 
    }
  `;

  const payload = {
    operationName: "getHqsById",
    query,
    variables: { id: parseInt(idManga) }, // Garantir que o ID é um número
  };

  try {
    const response = await HqNowApi.post("", payload);
    const data = response.data.data?.getHqsById[0];

    if (!data) return null;

    // Corrigir a URL do coverImage
    const baseUrl = "https://static.hq-now.com"; // O domínio base

    // Se hqCover não começar com "http", concatene o domínio base
    const coverImage = data.hqCover?.startsWith("http")
      ? data.hqCover // Já contém a URL completa
      : `${baseUrl}/${data.hqCover}`; // Concatena o domínio com o caminho

    const returnManga: MangaDetailsModel = {
      id: data.id,
      description: data.synopsis ?? "",
      status: data.status ?? "",
      year: data.updatedAt ? data.updatedAt.split("-")[0] : null, // Ano a partir da data de atualização
      author: data.publisherName ?? "Desconhecido", // Caso não tenha autor, use "Desconhecido"
      artist: data.publisherName ?? "Desconhecido", // Caso não tenha artista, use "Desconhecido"
      tags: [], // Caso tenha tags, você pode preencher essa lista conforme necessário
      coverImage: coverImage ?? "", // A URL corrigida do coverImage
    };
    return returnManga;
  } catch (error) {
    console.error("Erro ao buscar detalhes da HQ:", error);
    return null;
  }
};

export const GetMangaChapterListHqNow = async (idManga: string) => {
  const query = `
    query getHqsById($id: Int!) {
      getHqsById(id: $id) {
        capitulos {
          id
          name
          number
        }
      }
    }
  `;

  // 1. Converter idManga para número
  const idMangaNumber = parseInt(idManga, 10);

  if (isNaN(idMangaNumber)) {
    console.error("ID do mangá inválido.");
    return null;
  }

  const payload = {
    operationName: "getHqsById",
    query,
    // 2. Usar o nome de variável correto ($id) e o tipo corrigido (number)
    variables: { id: idMangaNumber },
  };

  try {
    const response = await HqNowApi.post("", payload);

    // Verificar o status da resposta antes de processar
    if (response.status !== 200) {
      console.error("Erro na resposta da API:", response.status);
      return null;
    }

    // Acessar a lista de capítulos corretamente (getHqsById retorna um array)
    const mangaData = response.data.data?.getHqsById?.[0];

    if (!mangaData || !mangaData.capitulos) {
      console.error("Dados de capítulos não encontrados na resposta.");
      return null;
    }

    // 3. Mapear a lista de capítulos para MangaChapterModel
    const newChapterList: MangaChapterModel[] = mangaData.capitulos.map(
      (chap: any) => {
        return {
          id: chap.id,
          volume: null,
          chapter: chap.number ?? null,
          title: chap.name ?? null,
          date: null, // A API não fornece data de atualização do capítulo individualmente neste endpoint
          scanName: null,
        };
      }
    );

    // O código Kotlin reverte a ordem da lista.
    // Se você quer a ordem dos capítulos como no Tachiyomi (geralmente do mais recente para o mais antigo), use o sort:

    // Ordenar do capítulo mais recente para o mais antigo (descendente)
    newChapterList.sort((a, b) => {
      const chapterA = parseFloat(a.chapter);
      const chapterB = parseFloat(b.chapter);

      // Lógica de ordenação existente (garantindo que capítulos inválidos fiquem no final)
      if (isNaN(chapterA)) return 1;
      if (isNaN(chapterB)) return -1;
      return chapterB - chapterA;
    });

    return newChapterList;
  } catch (error) {
    console.error("Erro ao buscar os capítulos da HQ:", error);
    return null;
  }
};

export const GetPagesListHqNow = async (
  idChap: string
): Promise<MangaPage[]> => {
  const requestData = {
    operationName: "getChapterById",
    query: `
      query getChapterById($chapterId: Int!) {
        getChapterById(chapterId: $chapterId) {
          name
          number
          oneshot
          pictures {
            pictureUrl
          }
        }
      }
    `,
    variables: {
      chapterId: parseInt(idChap, 10),
    },
  };

  try {
    const response = await HqNowApi.post("", requestData, {
      headers: {
        "Content-Type": "application/json",
        // 'Authorization': 'Bearer seu_token_aqui', // Se necessário
      },
    });

    const pageList: MangaPage[] =
      response.data.data.getChapterById.pictures.map((page: any) => {
        return page.pictureUrl;
      });
    return pageList;
  } catch (error) {
    console.error("Erro ao buscar os dados:", error.message || error);
    throw error; // Re-throw the error if needed
  }
};

export const GetPagesListNextChapterHqNow = async (
  idChap: string,
  idManga: string
): Promise<NextPrevMangaPage | null> => {
  try {
    const responseListChapters = await GetMangaChapterListHqNow(idManga);

    if (!responseListChapters || responseListChapters.length === 0) {
      return null;
    }

    const currentIndex = responseListChapters.findIndex(
      (item) => item.id === idChap
    );

    const nextChapter = responseListChapters[currentIndex - 1];

    if (!nextChapter) {
      console.warn("Nenhum próximo capítulo encontrado.");
      return null;
    }

    const response = await GetPagesListHqNow(nextChapter.id);

    if (response) {
      const pageList: MangaPage[] = response;

      return {
        list: pageList,
        id: nextChapter.id,
        title: nextChapter.title,
        chapterNumber: nextChapter.chapter,
      };
    }

    return null;
  } catch (error) {
    console.error("Erro ao buscar páginas do próximo capítulo:", idChap, error);
    return null;
  }
};
export const GetPagesListPrevChapterHqNow = async (
  idChap: string,
  idManga: string
): Promise<NextPrevMangaPage | null> => {
  try {
    const responseListChapters = await GetMangaChapterListHqNow(idManga);

    if (!responseListChapters || responseListChapters.length === 0) {
      return null;
    }
    const currentIndex = responseListChapters.findIndex(
      (item) => item.id === idChap
    );

    const nextChapter = responseListChapters[currentIndex + 1];
    if (!nextChapter) {
      console.warn("Nenhum próximo capítulo encontrado.");
      return null;
    }

    const response = await GetPagesListHqNow(nextChapter.id);
    if (response) {
      const pageList: MangaPage[] = response;

      return {
        list: pageList,
        id: nextChapter.id,
        title: nextChapter.title,
        chapterNumber: nextChapter.chapter,
      };
    }

    return null;
  } catch (error) {
    console.error("Erro ao buscar páginas do próximo capítulo:", idChap, error);
    return null;
  }
};
