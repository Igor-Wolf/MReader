import { GetAllMangaMangaDex } from "../../services/MangaDexService";

export const GetAllManga = async (id: number, pagination: number) => {
  switch (id) {
    case 1:
      
      let response = await GetAllMangaMangaDex(pagination, id);

      return response;

    default:
      return [];
  }
};
