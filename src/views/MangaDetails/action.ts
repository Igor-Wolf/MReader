import {
  GetMangaByIDHqNow,
  GetMangaChapterListHqNow,
} from "../../services/HqNowService";
import {
  GetMangaByIDMangaDex,
  GetMangaChapterListByLangMangaDex,
  GetMangaChapterListMangaDex,
} from "../../services/MangaDexService";
import {
  GetMangaByIDNineManga,
  GetMangaChapterListNineManga,
} from "../../services/NineMnagaService";

export const GetMangaDetails = async (idFont: number, idManga: string) => {
  switch (idFont) {
    case 1:
      return await GetMangaByIDMangaDex(idManga);
    case 2:
      return await GetMangaByIDHqNow(idManga);
    case 3:
      return await GetMangaByIDNineManga(idManga);

    default:
      return null;
  }
};
export const GetChapterList = async (idFont: number, idManga: string) => {
  switch (idFont) {
    case 1:
      return await GetMangaChapterListMangaDex(idManga);
    case 2:
      return await GetMangaChapterListHqNow(idManga);
    case 3:
      return await GetMangaChapterListNineManga(idManga);

    default:
      return null;
  }
};

export const GetChapterListAnotherLanguage = async (
  idFont: number,
  idManga: string,
  lang: string
) => {
  switch (idFont) {
    case 1:
      return await GetMangaChapterListByLangMangaDex(idManga, lang);

    default:
      return null;
  }
};
