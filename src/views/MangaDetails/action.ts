import {
  GetMangaByIDHqNow,
  GetMangaChapterListHqNow,
} from "../../services/HqNowService";
import {
  GetMangaByIDMangaDex,
  GetMangaChapterListMangaDex,
} from "../../services/MangaDexService";

export const GetMangaDetails = async (idFont: number, idManga: string) => {
  switch (idFont) {
    case 1:
      return await GetMangaByIDMangaDex(idManga);
    case 2:
      return await GetMangaByIDHqNow(idManga);

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

    default:
      return null;
  }
};
