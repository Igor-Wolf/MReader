import {
  GetAllMangaHqNow,
  GetMangaByNameHqNow,
  GetPopularMangaHqNow,
} from "../../services/HqNowService";
import {
  getLatestMangaUpdates,
  ultimosLançamentos,
} from "../../services/MadaraService";
import {
  GetAllMangaMangaDex,
  GetMangaByNameMangaDex,
  GetPopularMangaMangaDex,
} from "../../services/MangaDexService";

export const GetAllManga = async (id: number, pagination: number) => {
  switch (id) {
    case 1:
      return await GetAllMangaMangaDex(pagination, id);
    case 2:
      return await GetAllMangaHqNow(pagination, id);

    default:
      return [];
  }
};
export const GetPopularManga = async (id: number, pagination: number) => {
  switch (id) {
    case 1:
      return await GetPopularMangaMangaDex(pagination, id);
    case 2:
      return await GetPopularMangaHqNow(pagination, id);

    default:
      return [];
  }
};
export const GetMangaByName = async (
  id: number,
  pagination: number,
  slug: string
) => {
  switch (id) {
    case 1:
      return await GetMangaByNameMangaDex(pagination, id, slug);
    case 2:
      return await GetMangaByNameHqNow(pagination, id, slug);

    default:
      return [];
  }
};
