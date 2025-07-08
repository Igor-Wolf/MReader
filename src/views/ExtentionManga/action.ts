import { GetAllMangaMangaDex, GetMangaByNameMangaDex, GetPopularMangaMangaDex } from "../../services/MangaDexService";

export const GetAllManga = async (id: number, pagination: number) => {
  switch (id) {
    case 1:
      
      let response = await GetAllMangaMangaDex(pagination, id);

      return response;

    default:
      return [];
  }
};
export const GetPopularManga = async (id: number, pagination: number) => {
  switch (id) {
    case 1:
      
      let response = await GetPopularMangaMangaDex(pagination, id);

      return response;

    default:
      return [];
  }
};
export const GetMangaByName = async (id: number, pagination: number, slug: string) => {
  switch (id) {
    case 1:
      
      let response = await GetMangaByNameMangaDex(pagination, id, slug);

      return response;

    default:
      return [];
  }
};
