import { MangaDexApi } from "../api/MangaDexApi";
import {
  MangaChapterModel,
  MangaCoverModel,
  MangaDetailsModel,
  MangaPage,
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
      };
      return returnManga;
    }

    return null;
  } catch (error) {
    console.error("Erro ao buscar manga:", error);
    return null;
  }
};

export const GetMangaChapterList = async (idChapter: string) => {
  const response = await MangaDexApi.get(
    `/manga/${idChapter}/feed?translatedLanguage[]=en&includes[]=scanlation_group`
  );

  const newChapterList: MangaChapterModel[] = [];
  if (response.status === 200) {
    const ChapterList = response.data.data;
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
  idManga: string
): Promise<MangaPage[]> => {
  try {
    const response = await MangaDexApi.get(`/at-home/server/${idManga}`);

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
    console.error("Erro ao buscar páginas do MangaDex:", idManga);
    return [];
  }
};
