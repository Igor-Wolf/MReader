import {
  GetPagesListMangaDex,
  GetPagesListNextChapterMangaDex,
  GetPagesListPrevChapterMangaDex,
} from "../../services/MangaDexService";

export const GetPagesList = async (idFont: number, idManga: string | null) => {
  switch (idFont) {
    case 1:
      let response = await GetPagesListMangaDex(idManga);

      return response;

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
      let response = await GetPagesListNextChapterMangaDex(idChap, idManga);

      return response;

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
      let response = await GetPagesListPrevChapterMangaDex(idChap, idManga);

      return response;

    default:
      return null;
  }
};
