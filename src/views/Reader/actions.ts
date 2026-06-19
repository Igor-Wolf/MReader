import * as FileSystem from "expo-file-system";
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
import { GetPagesListNextChapterNiadd, GetPagesListNiadd, GetPagesListPrevChapterNiadd } from "../../services/Niadd";
import {
  GetPagesListNextChapterNineManga,
  GetPagesListNineManga,
  GetPagesListPrevChapterNineManga,
} from "../../services/NineMnagaService";
import { GetPagesListNextChapterNovelCool, GetPagesListNovelCool, GetPagesListPrevChapterNovelCool } from "../../services/NovelCool";

function sanitizeDirName(id: string): string {
  if (!id) return "unknown";
  let clean = id.replace(/https?:\/\/(www\.)?/, "");
  return clean.replace(/[\/\\:\*\?"<>\|]/g, "-").substring(0, 100);
}

async function getOfflinePagesIfAvailable(realm: any, idFont: number, idChap: string | null): Promise<string[] | null> {
  if (!realm || realm.isClosed || !idChap) return null;
  try {
    const localChapter = realm.objects("DownloadChapter").filtered("idFont == $0 AND id == $1", idFont, idChap);
    
    if (localChapter && localChapter.length > 0) {
      const idMangaDoBanco = localChapter[0].idManga;
      const safeMangaId = sanitizeDirName(idMangaDoBanco);
      const safeChapterId = sanitizeDirName(idChap);
      const chapterDir = `${FileSystem.documentDirectory}mangas/${idFont}/${safeMangaId}/${safeChapterId}/`;
      
      const dirInfo = await FileSystem.getInfoAsync(chapterDir);
      if (dirInfo.exists) {
        const files = await FileSystem.readDirectoryAsync(chapterDir);
        if (files.length > 0) {
          
          // 🛑--- LOGS DE DIAGNÓSTICO CRÍTICO ---
          console.log("📂 Caminho absoluto da pasta:", chapterDir);
          console.log("📄 Primeiro arquivo encontrado:", files[0]);
          
          const fileCheck = await FileSystem.getInfoAsync(`${chapterDir}${files[0]}`);
          console.log("📊 O arquivo existe fisicamente?", fileCheck.exists);
          console.log("⚖️ Tamanho do arquivo em Bytes:", fileCheck.size);
          // -------------------------------------

          return files
            .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }))
            .map(fileName => `file://${chapterDir}${fileName}`);
        }
      } else {
        console.log("❌ A pasta do capítulo não existe no diretório mapeado:", chapterDir);
      }
    }
  } catch (err) {
    console.warn("⚠️ Erro na varredura offline:", err);
  }
  return null;
}

export const GetPagesList = async (realm: any, idFont: number, idChap: string | null) => {
  const offlinePages = await getOfflinePagesIfAvailable(realm, idFont, idChap);
  
  // 💡 Se houver offline, retornamos o array puro de caminhos locais (exatamente como GetPagesListWeb retornava)
  if (offlinePages) {
    return offlinePages; 
  }

  console.log(`🌐 [Online] Buscando páginas atuais da Web para fonte ${idFont}`);
  switch (idFont) {
    case 1: return await GetPagesListMangaDex(idChap);
    case 2: return await GetPagesListHqNow(idChap);
    case 3: return await GetPagesListNineManga(idChap);
    case 4: return await GetPagesListMangaflix(idChap);
    case 5: return await GetPagesListNiadd(idChap);
    case 6: return await GetPagesListNovelCool(idChap);
    default: return null;
  }
};

export const GetNextPagesList = async (realm: any, idFont: number, idChap: string | null, idManga: string) => {
  // Para sabermos os metadados do próximo capítulo (id, title, chapterNumber), primeiro consultamos a estrutura da API
  let response: any = null;
  try {
    switch (idFont) {
      case 1: response = await GetPagesListNextChapterMangaDex(idChap, idManga); break;
      case 2: response = await GetPagesListNextChapterHqNow(idChap, idManga); break;
      case 3: response = await GetPagesListNextChapterNineManga(idChap, idManga); break;
      case 4: response = await GetPagesListNextChapterMangaflix(idChap, idManga); break;
      case 5: response = await GetPagesListNextChapterNiadd(idChap, idManga); break;
      case 6: response = await GetPagesListNextChapterNovelCool(idChap, idManga); break;
      default: return null;
    }
  } catch (webError) {
    console.warn("⚠️ Não foi possível buscar o próximo capítulo online (dispositivo pode estar offline).");
  }

  // Fallback se estiver 100% offline e a API falhar: tentamos deduzir pelo Realm se houver um próximo salvo
  if (!response && realm && !realm.isClosed) {
    // Busca capítulos desta mesma fonte e mangá para tentar achar o próximo localmente
    const savedChapters = realm.objects("DownloadChapter")
      .filtered("idFont == $0 AND idManga == $1", idFont, idManga);
    
    // Procura um capítulo cujo ID seja diferente do atual (uma aproximação segura para cenários sem rede)
    const nextLocal = savedChapters.find((c: any) => c.id !== idChap); 
    if (nextLocal) {
      response = { id: nextLocal.id, title: nextLocal.title, chapterNumber: nextLocal.chapterNumber, list: [] };
    }
  }

  if (!response) return null;

  // Se o próximo capítulo existir (via web ou banco), checa se as imagens dele estão no disco
  const offlinePages = await getOfflinePagesIfAvailable(realm, idFont, response.id);
  if (offlinePages) {
    return { ...response, list: offlinePages }; // Substitui a lista de URLs pelas locais
  }
  return response;
};

export const GetPrevPagesList = async (realm: any, idFont: number, idChap: string | null, idManga: string) => {
  let response: any = null;
  try {
    switch (idFont) {
      case 1: response = await GetPagesListPrevChapterMangaDex(idChap, idManga); break;
      case 2: response = await GetPagesListPrevChapterHqNow(idChap, idManga); break;
      case 3: response = await GetPagesListPrevChapterNineManga(idChap, idManga); break;
      case 4: response = await GetPagesListPrevChapterMangaflix(idChap, idManga); break;
      case 5: response = await GetPagesListPrevChapterNiadd(idChap, idManga); break;
      case 6: response = await GetPagesListPrevChapterNovelCool(idChap, idManga); break;
      default: return null;
    }
  } catch (webError) {
    console.warn("⚠️ Não foi possível buscar o capítulo anterior online.");
  }

  if (!response && realm && !realm.isClosed) {
    const savedChapters = realm.objects("DownloadChapter")
      .filtered("idFont == $0 AND idManga == $1", idFont, idManga);
    const prevLocal = savedChapters.find((c: any) => c.id !== idChap);
    if (prevLocal) {
      response = { id: prevLocal.id, title: prevLocal.title, chapterNumber: prevLocal.chapterNumber, list: [] };
    }
  }

  if (!response) return null;

  const offlinePages = await getOfflinePagesIfAvailable(realm, idFont, response.id);
  if (offlinePages) {
    return { ...response, list: offlinePages };
  }
  return response;
};