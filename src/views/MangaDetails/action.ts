import { getDownloadedChaptersByManga } from "../../database/Crud/downloadChapter";
import {
  GetMangaByIDHqNow,
  GetMangaChapterListHqNow,
} from "../../services/HqNowService";
import {
  GetMangaByIDMangaDex,
  GetMangaChapterListByLangMangaDex,
  GetMangaChapterListMangaDex,
} from "../../services/MangaDexService";
import {
  GetMangaByIDMangaflix,
  GetMangaChapterListMangaflix,
} from "../../services/MangaflixService";
import {
  GetMangaByIDNiadd,
  GetMangaChapterListNiadd,
} from "../../services/Niadd";
import {
  GetMangaByIDNineManga,
  GetMangaChapterListNineManga,
} from "../../services/NineMnagaService";
import {
  GetMangaByIDNovelCool,
  GetMangaChapterListNovelCool,
} from "../../services/NovelCool";

export const GetMangaDetails = async (idFont: number, idManga: string) => {
  switch (idFont) {
    case 1:
      return await GetMangaByIDMangaDex(idManga);
    case 2:
      return await GetMangaByIDHqNow(idManga);
    case 3:
      return await GetMangaByIDNineManga(idManga);
    case 4:
      return await GetMangaByIDMangaflix(idManga);
    case 5:
      return await GetMangaByIDNiadd(idManga);
    case 6:
      return await GetMangaByIDNovelCool(idManga);

    default:
      return null;
  }
};

export const GetChapterList = async (
  realm: any,
  idFont: number,
  idManga: string,
) => {
  let resWeb: any[] = [];

  // 1. Busca os capítulos da fonte online (corrigido com os 'break's)
  try {
    switch (idFont) {
      case 1:
        resWeb = await GetMangaChapterListMangaDex(idManga);
        break;
      case 2:
        resWeb = await GetMangaChapterListHqNow(idManga);
        break;
      case 3:
        resWeb = await GetMangaChapterListNineManga(idManga);
        break;
      case 4:
        resWeb = await GetMangaChapterListMangaflix(idManga);
        break;
      case 5:
        resWeb = await GetMangaChapterListNiadd(idManga);
        break;
      case 6:
        resWeb = await GetMangaChapterListNovelCool(idManga);
        break;
      default:
        console.warn(`Fonte ID ${idFont} desconhecida.`);
        break;
    }
  } catch (error) {
    console.error(
      "Erro ao buscar capítulos online (usuário pode estar offline):",
      error,
    );
    // Não travamos o app aqui, pois ele ainda pode ler os capítulos offline!
    resWeb = [];
  }

  // 2. Usa a nova função que traz tudo mastigado do Realm
  const resultsOffline = getDownloadedChaptersByManga(realm, idFont, String(idManga));

  // ✅ CONVERTE PARA ARRAY e ORDENA (depois podemos ordenar)
  const offlineArray: any[] = Array.from(resultsOffline || []);
  
  // Ordena offline decrescente para manter capítulos mais recentes primeiro
  offlineArray.sort((a, b) => {
    const chapterA = parseFloat(String(a.chapterNumber || ""));
    const chapterB = parseFloat(String(b.chapterNumber || ""));

    if (isNaN(chapterA) && isNaN(chapterB)) return 0;
    if (isNaN(chapterA)) return 1;
    if (isNaN(chapterB)) return -1;

    // Decrescente para UI consistente
    return chapterB - chapterA;
  });

  // Ordena resWeb também
  const onlineArray: any[] = Array.from(resWeb || []);
  
  onlineArray.sort((a, b) => {
    const chapterA = parseFloat(String(a.chapter || ""));
    const chapterB = parseFloat(String(b.chapter || ""));

    if (isNaN(chapterA) && isNaN(chapterB)) return 0;
    if (isNaN(chapterA)) return 1;
    if (isNaN(chapterB)) return -1;

    // Decrescente para manter consistência UI
    return chapterB - chapterA;
  });

  // Mesclar: offline primeiro, depois web não baixado
  const mergedChapters = [...offlineArray];

  onlineArray.forEach((webChap: any) => {
    // Verifica se o capítulo da web já foi baixado (comparando pelo id do capítulo)
    const alreadyDownloaded = offlineArray.some(
      (offChap: any) => offChap.id == webChap.id,
    );

    if (!alreadyDownloaded) {
      mergedChapters.push({
        ...webChap,
        isOffline: false,
      });
    }
  });

  // 🔑 CORREÇÃO FINAL: Ordenação decrescente MÍNIMA após merge para garantir ordem correta na UI
  mergedChapters.sort((a, b) => {
    const chapterA = parseFloat(String(a.chapter || ""));
    const chapterB = parseFloat(String(b.chapter || ""));

    if (isNaN(chapterA) && isNaN(chapterB)) return 0;
    if (isNaN(chapterA)) return 1;
    if (isNaN(chapterB)) return -1;

    // Ordenação DECRESCENTE para manter mais recentes primeiro na UI
    return chapterB - chapterA;
  });

  // ✅ Retorna a lista mesclada e ordenada (offline primeiro, depois online adicionais)
  return mergedChapters;
}

export const GetChapterListAnotherLanguage = async (
  idFont: number,
  idManga: string,
  lang: string,
) => {
  switch (idFont) {
    case 1:
      return await GetMangaChapterListByLangMangaDex(idManga, lang);

    default:
      return null;
  }
};
