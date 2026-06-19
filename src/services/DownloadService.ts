import * as FileSystem from "expo-file-system";
// 🔥 IMPORTANTE: Importe os scrapers online originais diretamente aqui, 
// para que o download busque SEMPRE da internet, sem passar pelo interceptador do Realm.
import { GetPagesListMangaDex } from "../services/MangaDexService";
import { GetPagesListHqNow } from "../services/HqNowService";
import { GetPagesListNineManga } from "../services/NineMnagaService";
import { GetPagesListMangaflix } from "../services/MangaflixService";
import { GetPagesListNiadd } from "../services/Niadd";
import { GetPagesListNovelCool } from "../services/NovelCool";

interface DownloadParams {
  fontID: number;
  mangaId: string;
  chapterId: string;
  onProgress?: (progress: number) => void;
}

function sanitizeDirName(id: any): string {
  // 1. Se for nulo, indefinido ou vazio, evita o erro retornando um nome padrão
  if (id === null || id === undefined || id === "") return "unknown";
  
  // 2. Converte explicitamente para string (resolve se o HqNow passar um número como 1234)
  let clean = String(id);
  
  // 3. Remove protocolos de links se houver
  clean = clean.replace(/https?:\/\/(www\.)?/, "");
  
  // 4. Substitui caracteres ilegais por hifens
  clean = clean.replace(/[\/\\:\*\?"<>\|]/g, "-");
  
  // 5. Limita o tamanho do nome do diretório
  return clean.substring(0, 100);
}

// Criamos uma busca puramente online exclusiva para o módulo de download
async function fetchOnlinePagesOnly(fontID: number, chapterId: string | null) {
  switch (fontID) {
    case 1: return await GetPagesListMangaDex(chapterId);
    case 2: return await GetPagesListHqNow(chapterId);
    case 3: return await GetPagesListNineManga(chapterId);
    case 4: return await GetPagesListMangaflix(chapterId);
    case 5: return await GetPagesListNiadd(chapterId);
    case 6: return await GetPagesListNovelCool(chapterId);
    default: return null;
  }
}

export async function downloadChapter({
  fontID,
  mangaId,
  chapterId,
  onProgress,
}: DownloadParams): Promise<string[] | null> {
  
  const response = await fetchOnlinePagesOnly(fontID, chapterId);
  console.log("Response da API Web:", response);

  const urls: string[] = Array.isArray(response)
    ? response
    : response?.pages || response?.list || [];

  if (urls.length === 0) {
    console.error("Nenhuma URL encontrada para este capítulo.");
    return null;
  }

  // 🔥 DEFINIÇÃO DE REFERERS PARA DRIBLAR O BLOQUEIO DOS SERVIDORES
  let refererUrl = "https://google.com"; // Fallback genérico seguro
  if (fontID === 1) refererUrl = "https://mangadex.org/";
  if (fontID === 2) refererUrl = "https://hqnow.com.br/";
  if (fontID === 4) refererUrl = "https://mangaflix.org/";

  try {
    const safeMangaId = sanitizeDirName(mangaId);
    const safeChapterId = sanitizeDirName(chapterId);

    const chapterDir = `${FileSystem.documentDirectory}mangas/${fontID}/${safeMangaId}/${safeChapterId}/`;
    
    const dirInfo = await FileSystem.getInfoAsync(chapterDir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(chapterDir, { intermediates: true });
    }

    const localPaths: string[] = [];
    const totalPages = urls.length;

    for (let i = 0; i < totalPages; i++) {
      const url = urls[i];
      if (!url) continue;

      const extensionMatch = url.match(/\.(jpg|jpeg|png|webp|gif)/i);
      const ext = extensionMatch ? extensionMatch[0] : ".jpg";

      const pageName = `${String(i + 1).padStart(3, "0")}${ext}`;
      const fileUri = `${chapterDir}${pageName}`;

      console.log(`Baixando página ${i + 1}/${totalPages}...`);

      const downloadResumable = FileSystem.createDownloadResumable(
        url,
        fileUri,
        {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            "Accept": "image/avif,image/webp,image/apng,image//*,*/*;q=0.8",
            "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
            // 🔥 O SEGREDO: Diz ao servidor que estamos acessando a imagem de dentro do site deles
            "Referer": refererUrl, 
          },
        },
      );

      const result = await downloadResumable.downloadAsync();

      if (result?.uri) {
        const check = await FileSystem.getInfoAsync(result.uri);
        if (check.exists && check.size > 0) {
          localPaths.push(result.uri);
        } else {
          console.warn(`⚠️ Página ${i + 1} baixou com 0 bytes. Removendo arquivo corrompido...`);
          await FileSystem.deleteAsync(result.uri, { idempotent: true });
        }
      }

      if (onProgress) {
        onProgress((i + 1) / totalPages);
      }
    }
    
    console.log(`Download concluído! Salvas com sucesso: ${localPaths.length}/${totalPages} páginas.`);
    return localPaths;
  } catch (error) {
    console.error("Erro durante o download do capítulo:", error);
    return null;
  }
}