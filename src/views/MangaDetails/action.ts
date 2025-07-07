import { GetMangaByIDMangaDex, GetMangaChapterList } from "../../services/MangaDexService";

export const GetMangaDetails = async (idFont: number, idManga: string) => {
  switch (idFont) {
      case 1:
         
      let response = await GetMangaByIDMangaDex(idManga);

      return response;

    default:
      return null;
  }
};
export const GetChapterList = async (idFont: number, idManga: string) => {
  switch (idFont) {
      case 1:
         
      let response = await GetMangaChapterList(idManga);

      return response;

    default:
      return null;
  }
};

