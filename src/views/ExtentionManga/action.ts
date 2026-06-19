import {
  GetAllMangaHqNow,
  GetMangaByNameHqNow,
  GetPopularMangaHqNow,
} from "../../services/HqNowService";

import {
  GetAllMangaMangaDex,
  GetMangaByNameMangaDex,
  GetPopularMangaMangaDex,
} from "../../services/MangaDexService";
import { GetAllMangaMangaflix, GetMangaByNameMangaflix, GetPopularMangaMangaflix } from "../../services/MangaflixService";
import { GetAllMangaNiadd, GetMangaByNameNiadd, GetPopularMangaNiadd } from "../../services/Niadd";
import { GetAllMangaNimeMnaga, GetMangaByNameNineManga, GetPopularMangaNineManga } from "../../services/NineMnagaService";
import { GetAllMangaNovelCool, GetMangaByNameNovelCool, GetPopularMangaNovelCool } from "../../services/NovelCool";

export const GetAllManga = async (id: number, pagination: number) => {
  switch (id) {
    case 1:
      return await GetAllMangaMangaDex(pagination, id);
    case 2:
      return await GetAllMangaHqNow(pagination, id);
    case 3:
      return await GetAllMangaNimeMnaga(pagination, id);
    case 4:
      return await GetAllMangaMangaflix(pagination, id);
    case 5:
      return await GetAllMangaNiadd(pagination, id);
    case 6:
      return await GetAllMangaNovelCool(pagination, id);

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
    case 3:
      return await GetPopularMangaNineManga(pagination, id);
    case 4:
      return await GetPopularMangaMangaflix(pagination, id);
    case 5:
      return await GetPopularMangaNiadd(pagination, id);
    case 6:
      return await GetPopularMangaNovelCool(pagination, id);

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
    case 3:
      return await GetMangaByNameNineManga(pagination, id, slug);
    case 4:
      return await GetMangaByNameMangaflix(pagination, id, slug);
    case 5:
      return await GetMangaByNameNiadd(pagination, id, slug);
    case 6:
      return await GetMangaByNameNovelCool(pagination, id, slug);

    default:
      return [];
  }
};
