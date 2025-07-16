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

    default:
      return null;
  }
};
