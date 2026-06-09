import { MangaflixApi } from "../api/MangaflixApi";
import {
  MangaChapterModel,
  MangaCoverModel,
  MangaDetailsModel,
  MangaPage,
  NextPrevMangaPage,
} from "../Models/MangaModel";
import { DateConvert } from "../utils/convertDate";

export const GetAllMangaMangaflix = async (
  pagination: number,
  idFont: number,
) => {
  //const page = pagination * 20 - 20;

  const response = await MangaflixApi.get(
    `/latest-releases?selected_language=pt-br`,
  );
  if (response.status === 200) {
    let mangaList = response.data.data;
    let returnList: MangaCoverModel[] = [];
    mangaList.forEach((manga: any) => {
      const imageUrl = manga.poster.default_url;

      returnList.push({
        id: manga._id,
        idFont: idFont,
        slug: manga.name ?? "No Title",
        coverImage: imageUrl,
      });
    });
    return returnList;
  }

  return [];
};

export const GetPopularMangaMangaflix = async (
  pagination: number,
  idFont: number,
) => {
  const response = await MangaflixApi.get(`/browse`);
  if (response.status === 200) {
    let mangaList = response.data.data[0].items;
    let returnList: MangaCoverModel[] = [];
    mangaList.forEach((manga: any) => {
      const imageUrl = manga.poster.default_url;

      returnList.push({
        id: manga._id,
        idFont: idFont,
        slug: manga.name ?? "No Title",
        coverImage: imageUrl,
      });
    });
    return returnList;
  }

  return [];
};

export const GetMangaByNameMangaflix = async (
  pagination: number,
  idFont: number,
  slug: string,
) => {
  const page = pagination * 20 - 20;

  const response = await MangaflixApi.get(
    `https://api.mangaflix.net/v1/search/mangas?query=${slug}&selected_language=pt-br&include_adult=true`,
  );

  if (response.status === 200) {
    let mangaList = response.data.data.works;
    let returnList: MangaCoverModel[] = [];
    mangaList.forEach((manga: any) => {
      const imageUrl = manga.poster.default_url;

      returnList.push({
        id: manga._id,
        idFont: idFont,
        slug: manga.name ?? "No Title",
        coverImage: imageUrl,
      });
    });
    return returnList;
  }

  return [];
};

export const GetMangaByIDMangaflix = async (
  idManga: string,
): Promise<MangaDetailsModel | null> => {
  try {
    const response = await MangaflixApi.get(`/mangas/${idManga}`);
    if (response.status === 200) {
      const mangaData = response.data.data;

      const tags = mangaData.genres;
      const newTags: string[] = [];

      tags.forEach((tags: any) => {
        const newTag = tags.name;

        newTags.push(newTag);
      });

      const returnManga: MangaDetailsModel = {
        id: mangaData._id,
        description: mangaData.description || "",
        status: "Desconhecido",
        year: "",
        author: "Desconhecido",
        artist: "Desconhecido",
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

export const GetMangaChapterListMangaflix = async (idManga: string) => {
  const response = await MangaflixApi.get(`/mangas/${idManga}`);

  const newChapterList: MangaChapterModel[] = [];
  if (response.status === 200) {
    let ChapterList = response.data.data.chapters; // Inicializa com a primeira página
       
    // Preenche a lista com os dados no formato desejado
      ChapterList.forEach((chap: any) => {
         let newDate = chap.release_date
      try {
          newDate = DateConvert(newDate)
      } catch {
          
      }
      newChapterList.push({
        id: chap._id,
        volume: null,
        chapter: chap.number ?? null,
        title: null,
        date: newDate ?? null,
        scanName: chap.owners[0].name,
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


export const GetPagesListMangaflix = async (
  idChap: string
): Promise<MangaPage[]> => {
  try {
    const response = await MangaflixApi.get(`/chapters/${idChap}?selected_language=pt-br`);

    if (response.status === 200) {
      const data = response.data.data.images

      const pageList: MangaPage[] = data.map((page) => {
        return `${page.default_url}`;
      });

      return pageList;
    }

    return [];
  } catch (error) {
    console.error("Erro ao buscar páginas do MangaDex:", idChap);
    return [];
  }
};


export const GetPagesListPrevChapterMangaflix = async (
  idChap: string,
  idManga: string
): Promise<NextPrevMangaPage | null> => {
  try {
    const responseListChapters = await GetMangaChapterListMangaflix(
      idManga
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


    const response = await GetPagesListMangaflix(nextChapter.id)
    

    if (response && response.length>=0) {
      

      return {
        list: response,
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
export const GetPagesListNextChapterMangaflix = async (
  idChap: string,
  idManga: string
): Promise<NextPrevMangaPage | null> => {
  try {
    const responseListChapters = await GetMangaChapterListMangaflix(
      idManga
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


    const response = await GetPagesListMangaflix(nextChapter.id)
    

    if (response && response.length>=0) {
      

      return {
        list: response,
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
