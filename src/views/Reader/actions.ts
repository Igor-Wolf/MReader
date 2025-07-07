import { GetPagesListMangaDex } from "../../services/MangaDexService";




export const GetPagesList = async (idFont: number, idManga: string) => {
    
  switch (idFont) {
      case 1:
          
      let response = await GetPagesListMangaDex(idManga);

      return response;

    default:
      return null;
  }
};




