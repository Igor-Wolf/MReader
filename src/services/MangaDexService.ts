import { MangaDexApi } from "../api/MangaDexApi";
import {
  MangaChapterModel,
  MangaCoverModel,
  MangaDetailsModel,
  MangaPage,
  NextPrevMangaPage,
} from "../Models/MangaModel";

export const GetAllMangaMangaDex = async (
  pagination: number,
  idFont: number
) => {
  const page = pagination * 20 - 20;

  const response = await MangaDexApi.get(
    `/manga?includes[]=author&includes[]=artist&includes[]=cover_art&limit=20&offset=40limit=20&offset=${page}`
  );
  if (response.status === 200) {
    let mangaList = response.data.data;
    let returnList: MangaCoverModel[] = [];
    mangaList.forEach((manga: any) => {
      const cover = manga.relationships.find(
        (rel: any) => rel.type === "cover_art"
      );
      const fileName = cover?.attributes?.fileName;
      const imageUrl = `https://uploads.mangadex.org/covers/${manga.id}/${fileName}`;

      returnList.push({
        id: manga.id,
        idFont: idFont,
        slug: manga.attributes.title.en ?? "No Title",
        coverImage: imageUrl,
      });
    });
    return returnList;
  }

  return [];
};
export const GetPopularMangaMangaDex = async (
  pagination: number,
  idFont: number
) => {
  const page = pagination * 20 - 20;

  const response = await MangaDexApi.get("/manga", {
    params: {
      "includes[]": ["author", "artist", "cover_art"],
      limit: 20,
      offset: page * 20,
      // Ordenação
      "order[followedCount]": "desc", // mais recentemente atualizado
    },
  });

  if (response.status === 200) {
    let mangaList = response.data.data;
    let returnList: MangaCoverModel[] = [];
    mangaList.forEach((manga: any) => {
      const cover = manga.relationships.find(
        (rel: any) => rel.type === "cover_art"
      );
      const fileName = cover?.attributes?.fileName;
      const imageUrl = `https://uploads.mangadex.org/covers/${manga.id}/${fileName}`;

      returnList.push({
        id: manga.id,
        idFont: idFont,
        slug: manga.attributes.title.en ?? "No Title",
        coverImage: imageUrl,
      });
    });
    return returnList;
  }

  return [];
};
export const GetMangaByNameMangaDex = async (
  pagination: number,
  idFont: number,
  slug: string
) => {
  const page = pagination * 20 - 20;

  const response = await MangaDexApi.get("/manga", {
    params: {
      title: slug,
      "includes[]": ["author", "artist", "cover_art"],
      limit: 60,
      offset: 0,
      // Ordenação
      "order[followedCount]": "desc", // mais recentemente atualizado
    },
  });

  if (response.status === 200) {
    let mangaList = response.data.data;
    let returnList: MangaCoverModel[] = [];
    mangaList.forEach((manga: any) => {
      const cover = manga.relationships.find(
        (rel: any) => rel.type === "cover_art"
      );
      const fileName = cover?.attributes?.fileName;
      const imageUrl = `https://uploads.mangadex.org/covers/${manga.id}/${fileName}`;

      returnList.push({
        id: manga.id,
        idFont: idFont,
        slug: manga.attributes.title.en ?? "No Title",
        coverImage: imageUrl,
      });
    });
    return returnList;
  }

  return [];
};

export const GetMangaByIDMangaDex = async (
  idManga: string
): Promise<MangaDetailsModel | null> => {
  try {
    const response = await MangaDexApi.get(
      `/manga/${idManga}?includes[]=author&includes[]=artist`
    );
    if (response.status === 200) {
      const mangaData = response.data.data;

      const author = mangaData.relationships.find(
        (r: any) => r.type === "author"
      );
      const artist = mangaData.relationships.find(
        (r: any) => r.type === "artist"
      );
      const tags = mangaData.attributes.tags;
      const newTags: string[] = [];

      tags.forEach((tags: any) => {
        const newTag = tags.attributes.name.en;

        newTags.push(newTag);
      });

      const returnManga: MangaDetailsModel = {
        id: mangaData.id,
        description: mangaData.attributes.description?.en || "",
        status: mangaData.attributes.state,
        year: mangaData.attributes.year,
        author: author.attributes?.name || "Desconhecido",
        artist: artist.attributes?.name || "Desconhecido",
        tags: newTags || [],
        coverImage: null,
      };
      return returnManga;
    }

    return null;
  } catch (error) {
    console.error("Erro ao buscar manga:", error);
    return null;
  }
};

export const GetMangaChapterListMangaDex = async (idManga: string) => {
  const response = await MangaDexApi.get(
    `/manga/${idManga}/feed?translatedLanguage[]=en&includes[]=scanlation_group&limit=100&offset=0`
  );

  const newChapterList: MangaChapterModel[] = [];
  if (response.status === 200) {
    const totalChapters = response.data.total; // Corrigido para pegar total de capítulos
    const totalPages = Math.ceil(totalChapters / 100); // Calculando o número de páginas
    let ChapterList = response.data.data; // Inicializa com a primeira página

    // Loop para iterar pelas páginas restantes
    for (let page = 1; page < totalPages; page++) {
      const responseFor = await MangaDexApi.get(
        `/manga/${idManga}/feed?translatedLanguage[]=en&includes[]=scanlation_group&limit=100&offset=${
          page * 100
        }`
      );

      if (responseFor.status === 200) {
        ChapterList = ChapterList.concat(responseFor.data.data); // Concatena os capítulos da nova página
      }
    }

    // Preenche a lista com os dados no formato desejado
    ChapterList.forEach((chap: any) => {
      newChapterList.push({
        id: chap.id,
        volume: chap.attributes.volume ?? null,
        chapter: chap.attributes.chapter ?? null,
        title: chap.attributes.title ?? null,
        date: chap.attributes.publishAt ?? null,
        scanName:
          chap.relationships?.find(
            (rel: any) => rel.type === "scanlation_group"
          )?.attributes?.name ?? null,
      });
    });

    // Ordena os capítulos por número de capítulo (decrescente)
    newChapterList.sort((a, b) => {
      const chapterA = parseFloat(a.chapter);
      const chapterB = parseFloat(b.chapter);

      if (isNaN(chapterA)) return 1;
      if (isNaN(chapterB)) return -1;

      return chapterB - chapterA;
    });

    return newChapterList;
  } else {
    return [];
  }
};

export const GetMangaChapterListByLangMangaDex = async (
  idManga: string,
  lang: string
) => {
  const response = await MangaDexApi.get(
    `/manga/${idManga}/feed?translatedLanguage[]=${lang}&includes[]=scanlation_group&limit=100&offset=0`
  );

  const newChapterList: MangaChapterModel[] = [];
  if (response.status === 200) {
    const totalChapters = response.data.total; // Corrigido para pegar o total de capítulos
    const totalPages = Math.ceil(totalChapters / 100); // Calculando o número total de páginas
    let ChapterList = response.data.data; // Inicializa com os primeiros capítulos

    // Loop para pegar os capítulos das páginas subsequentes
    for (let page = 1; page < totalPages; page++) {
      const responseFor = await MangaDexApi.get(
        `/manga/${idManga}/feed?translatedLanguage[]=${lang}&includes[]=scanlation_group&limit=100&offset=${
          page * 100
        }`
      );

      if (responseFor.status === 200) {
        ChapterList = ChapterList.concat(responseFor.data.data); // Concatena os capítulos da nova página
      }
    }

    // Processa os capítulos e preenche a lista com os dados necessários
    ChapterList.forEach((chap: any) => {
      newChapterList.push({
        id: chap.id,
        volume: chap.attributes.volume ?? null,
        chapter: chap.attributes.chapter ?? null,
        title: chap.attributes.title ?? null,
        date: chap.attributes.publishAt ?? null,
        scanName:
          chap.relationships?.find(
            (rel: any) => rel.type === "scanlation_group"
          )?.attributes?.name ?? null,
      });
    });

    // Ordena os capítulos por número de capítulo (decrescente)
    newChapterList.sort((a, b) => {
      const chapterA = parseFloat(a.chapter);
      const chapterB = parseFloat(b.chapter);

      if (isNaN(chapterA)) return 1;
      if (isNaN(chapterB)) return -1;

      return chapterB - chapterA;
    });

    return newChapterList;
  } else {
    return [];
  }
};

export const GetPagesListMangaDex = async (
  idChap: string
): Promise<MangaPage[]> => {
  try {
    const response = await MangaDexApi.get(`/at-home/server/${idChap}`);

    if (response.status === 200) {
      const { baseUrl, chapter } = response.data;
      const { hash, data } = chapter;

      const pageList: MangaPage[] = data.map((page: string) => {
        return `${baseUrl}/data/${hash}/${page}`;
      });

      return pageList;
    }

    return [];
  } catch (error) {
    console.error("Erro ao buscar páginas do MangaDex:", idChap);
    return [];
  }
};
export const GetPagesListNextChapterMangaDex = async (
  idChap: string,
  idManga: string
): Promise<NextPrevMangaPage | null> => {
  try {
    const responseListChapters = await GetMangaChapterListAllLangsMangaDex(
      idManga,
      idChap
    );

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

    const response = await MangaDexApi.get(`/at-home/server/${nextChapter.id}`);

    if (response.status === 200) {
      const { baseUrl, chapter } = response.data;
      const { hash, data } = chapter;

      const pageList: MangaPage[] = data.map((page: string) => {
        return `${baseUrl}/data/${hash}/${page}`;
      });

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
export const GetPagesListPrevChapterMangaDex = async (
  idChap: string,
  idManga: string
): Promise<NextPrevMangaPage | null> => {
  try {
    const responseListChapters = await GetMangaChapterListAllLangsMangaDex(
      idManga,
      idChap
    );

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

    const response = await MangaDexApi.get(`/at-home/server/${nextChapter.id}`);

    if (response.status === 200) {
      const { baseUrl, chapter } = response.data;
      const { hash, data } = chapter;

      const pageList: MangaPage[] = data.map((page: string) => {
        return `${baseUrl}/data/${hash}/${page}`;
      });

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

export const GetMangaChapterListAllLangsMangaDex = async (
  idManga: string,
  idChap: string
) => {
  const resoponseChapter = await MangaDexApi.get(`/chapter/${idChap}`);

  let lang = resoponseChapter.data.data.attributes.translatedLanguage;

  const response = await MangaDexApi.get(
    `/manga/${idManga}/feed?translatedLanguage[]=${lang}&includes[]=scanlation_group&limit=100&offset=0`
  );

  const newChapterList: MangaChapterModel[] = [];
  if (response.status === 200) {
    const totalChapters = response.data.total;
    const totalPages = Math.ceil(totalChapters / 100);
    let rawChapterList = response.data.data;

    // Loop para pegar os capítulos das páginas subsequentes
    for (let page = 1; page < totalPages; page++) {
      await sleep(300); // Espera 300ms antes da próxima requisição

      const responseFor = await MangaDexApi.get(
        `/manga/${idManga}/feed?translatedLanguage[]=${lang}&includes[]=scanlation_group&limit=100&offset=${
          page * 100
        }`
      );

      if (responseFor.status === 200) {
        rawChapterList = rawChapterList.concat(responseFor.data.data);
      }
    }

    // Filtra os capítulos pela linguagem traduzida
    const chapterList = rawChapterList;

    // Adiciona os capítulos filtrados ao novo array
    chapterList.forEach((chap: any) => {
      newChapterList.push({
        id: chap.id,
        volume: chap.attributes.volume ?? null,
        chapter: chap.attributes.chapter ?? null,
        title: chap.attributes.title ?? null,
        date: chap.attributes.publishAt ?? null,
        scanName:
          chap.relationships?.find(
            (rel: any) => rel.type === "scanlation_group"
          )?.attributes?.name ?? null,
      });
    });

    // Ordena os capítulos em ordem decrescente
    newChapterList.sort((a, b) => {
      const chapterA = parseFloat(a.chapter ?? "0");
      const chapterB = parseFloat(b.chapter ?? "0");

      if (isNaN(chapterA)) return 1;
      if (isNaN(chapterB)) return -1;

      return chapterB - chapterA;
    });

    return newChapterList;
  } else {
    return [];
  }
};
