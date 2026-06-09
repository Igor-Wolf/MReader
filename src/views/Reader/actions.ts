import {
  GetPagesListHqNow,
  GetPagesListNextChapterHqNow,
  GetPagesListPrevChapterHqNow,
} from "../../services/HqNowService";
import {
  GetPagesListMangaDex,
  GetPagesListNextChapterMangaDex,
  GetPagesListPrevChapterMangaDex,
} from "../../services/MangaDexService";
import { GetPagesListMangaflix, GetPagesListNextChapterMangaflix, GetPagesListPrevChapterMangaflix } from "../../services/MangaflixService";
import {
  GetPagesListNextChapterNineManga,
  GetPagesListNineManga,
  GetPagesListPrevChapterNineManga,
} from "../../services/NineMnagaService";

export const GetPagesList = async (idFont: number, idManga: string | null) => {
  switch (idFont) {
    case 1:
      return await GetPagesListMangaDex(idManga);
    case 2:
      return await GetPagesListHqNow(idManga);
    case 3:
      return await GetPagesListNineManga(idManga);
    case 4:
      return await GetPagesListMangaflix(idManga);

    default:
      return null;
  }
};

export const GetNextPagesList = async (
  idFont: number,
  idChap: string | null,
  idManga: string
) => {
  switch (idFont) {
    case 1:
      return await GetPagesListNextChapterMangaDex(idChap, idManga);
    case 2:
      return await GetPagesListNextChapterHqNow(idChap, idManga);
    case 3:
      return await GetPagesListNextChapterNineManga(idChap, idManga);
    case 4:
      return await GetPagesListNextChapterMangaflix(idChap, idManga);

    default:
      return null;
  }
};

export const GetPrevPagesList = async (
  idFont: number,
  idChap: string | null,
  idManga: string
) => {
  switch (idFont) {
    case 1:
      return await GetPagesListPrevChapterMangaDex(idChap, idManga);
    case 2:
      return await GetPagesListPrevChapterHqNow(idChap, idManga);
    case 3:
      return await GetPagesListPrevChapterNineManga(idChap, idManga);
    case 4:
      return await GetPagesListPrevChapterMangaflix(idChap, idManga);

    default:
      return null;
  }
};
