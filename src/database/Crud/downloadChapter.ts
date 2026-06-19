// Substitua o 'any' por 'Realm' se preferir importar a tipagem oficial futuramente.

import { MangaChapterModel } from "../../Models/MangaModel";

export async function createDownloadChapter(
  realm: any,
  {
    idChap,
    idFont,
    idManga,
    title,
    chapterNumber,
    scanName,
    volume,
    date,
  }: {
    idChap: string;
    idFont: number;
    idManga: string;
    title: string | null;
    chapterNumber: string | null;
    scanName?: string | null;
    volume?: number | null;
    date?: string | null;
  }
) {
  const uid = `${idFont}:${idManga}:${idChap}`; // UID baseado em idFont, idManga e id do capítulo

  // 🕵️‍♂️ LOGS DAS TIPAGENS (Injetados mantendo a estrutura limpa)
  console.warn("==================================================");
  console.warn("📊 INSPEÇÃO DE TIPOS RECEBIDOS:");
  console.warn(`uid (Gerado): "${uid}" [tipo: ${typeof uid}]`);
  console.warn(`idChap: "${idChap}" [tipo: ${typeof idChap}]`);
  console.warn(`idManga: "${idManga}" [tipo: ${typeof idManga}]`);
  console.warn(`idFont: ${idFont} [tipo: ${typeof idFont}]`);
  console.warn(`title: "${title}" [tipo: ${typeof title}]`);
  console.warn(`chapterNumber: ${chapterNumber} [tipo: ${typeof chapterNumber}]`);
  console.warn(`scanName: "${scanName}" [tipo: ${typeof scanName}]`);
  console.warn(`volume: ${volume} [tipo: ${typeof volume}]`);
  console.warn(`date: "${date}" [tipo: ${typeof date}]`);
  console.warn("==================================================");

  try {
    realm.write(() => {
      // Usamos "modified" para que, se o registro de download já existir (pelo UID), ele seja atualizado.
      realm.create(
        "DownloadChapter", // Nome do esquema que você definiu
        {
          uid,
          id: String(idChap),
          idManga: String(idManga),
          idFont: idFont,
          title: title,
          chapterNumber: chapterNumber,
          scanName: scanName ?? null, // Garante null se vier undefined
          volume: volume ?? null,     // Garante null se vier undefined
          date: date ?? null,         // Garante null se vier undefined
        },
        "modified"
      );
    });
    console.log(`Download do Capítulo ${uid} registrado/atualizado com sucesso no Realm.`);
    return true;
  } catch (error) {
    console.error(`Erro ao salvar/atualizar download do capítulo ${uid} no Realm:`, error);
    throw error;
  }
}

export function getDownloadChapter(
  realm: any,
  idFont: number,
  idManga: string,
  idChap: string
) {
  // Retorna uma coleção (Results) de capítulos baixados que correspondem aos critérios.
  return realm
    .objects("DownloadChapter")
    .filtered(
      "idFont == $0 AND idManga == $1 AND id == $2",
      idFont,
      String(idManga),
      String(idChap)
    );
}

// Criamos uma interface estendida para a UI saber se está offline
export interface UIChapterModel extends MangaChapterModel {
  isOffline: boolean;
}

/**
 * Busca todos os capítulos baixados e os mapeia estritamente para o modelo MangaChapterModel
 */
export function getDownloadedChaptersByManga(
  realm: any,
  idFont: number,
  idManga: string
): UIChapterModel[] {
  try {
    const results = realm
      .objects("DownloadChapter")
      .filtered("idFont == $0 AND idManga == $1", idFont, idManga);

    // Se não achar nada, já corta aqui para evitar loops vazios
    if (!results || results.length === 0) {
      console.log("⚠️ Nenhum capítulo encontrado no Realm para este mangá ainda.");
      return [];
    }

    // 1. LOG DO REALM ORIGINAL: 
    // Para printar com segurança sem quebrar o Realm, pegamos o primeiro objeto
    // e criamos um espelho manual dele para o console.log
    const primeiroObjeto = results[0];
    if (primeiroObjeto && primeiroObjeto.isValid()) {
      const espelhoRealmOriginal = {
        uid: primeiroObjeto.uid,
        id: primeiroObjeto.id,
        idManga: primeiroObjeto.idManga,
        idFont: primeiroObjeto.idFont,
        title: primeiroObjeto.title,
        chapterNumber: primeiroObjeto.chapterNumber,
        scanName: primeiroObjeto.scanName,
        volume: primeiroObjeto.volume,
        date: primeiroObjeto.date,
      };
      console.log("==================================================");
      console.log("🔍 [REALM ORIGINAL] Estrutura interna de um item válido:");
      console.log(JSON.stringify(espelhoRealmOriginal, null, 2));
      console.log("==================================================");
    }

    const listaMapeada: UIChapterModel[] = [];

    // Substituímos o Array.from().map por um for comum, que é muito mais estável com objetos vivos do Realm
    for (let i = 0; i < results.length; i++) {
      const chap = results[i];
      
      // Garante que o objeto ainda está em um estado válido na memória
      if (chap && chap.isValid()) {
        const newItem: UIChapterModel = {
          id: String(chap.id),
          volume: chap.volume ?? null,
          chapter: chap.chapterNumber ?? null, // Faz o de/para de chapterNumber para chapter
          title: chap.title ?? null,
          date: chap.date ?? null,
          scanName: chap.scanName ?? null,
          isOffline: true,
        };

        listaMapeada.push(newItem);
      }
    }

    // 2. LOG DO NOVO ITEM MAPEADO:
    if (listaMapeada.length > 0) {
      console.log("==================================================");
      console.log("✨ [NOVO ITEM MAPEADO] Estrutura convertida e limpa para a UI:");
      console.log(JSON.stringify(listaMapeada[0], null, 2));
      console.log("==================================================");
    }

    return listaMapeada;

  } catch (error) {
    console.error(`❌ Erro crítico ao buscar capítulos offline para o mangá ${idManga}:`, error);
    return [];
  }
}

export function getAllDownloadChapters(realm: any) {
  // Retorna todos os capítulos baixados salvos no aparelho
  return realm.objects("DownloadChapter");
}

export function deleteDownloadChapterByUid(realm: any, uid: string) {
  try {
    const chapterToDelete = realm.objectForPrimaryKey("DownloadChapter", uid);

    if (chapterToDelete) {
      realm.write(() => {
        realm.delete(chapterToDelete);
      });
      console.log(`Download do Capítulo com UID '${uid}' deletado do Realm.`);
      return true;
    } else {
      console.log(`Download do Capítulo com UID '${uid}' não encontrado no Realm.`);
      return false;
    }
  } catch (error) {
    console.error(`Erro ao deletar download do capítulo com UID '${uid}' do Realm:`, error);
    throw error;
  }
}

export function deleteAllDownloadChapters(realm: any): boolean {
  try {
    const allDownloads = realm.objects("DownloadChapter");

    if (allDownloads.length > 0) {
      realm.write(() => {
        realm.delete(allDownloads);
      });
      console.log(`Todos os ${allDownloads.length} registros de download foram limpos do Realm.`);
      return true;
    } else {
      console.log("Nenhum capítulo baixado encontrado para deletar.");
      return false;
    }
  } catch (error) {
    console.error("Erro ao deletar todos os downloads do Realm:", error);
    throw error;
  }
}

export async function toggleDownloadChapter(
  realm: any,
  chapterData: {
    idChap: string;
    idFont: number;
    idManga: string;
    title: string | null;
    chapterNumber: string | null;
    scanName?: string | null;
    volume?: number | null;
    date?: string | null;
  }
) {
  const uid = `${chapterData.idFont}:${chapterData.idManga}:${chapterData.idChap}`;

  try {
    // 1. Verifica se o capítulo já consta como baixado no banco
    const existingDownloadResults = getDownloadChapter(
      realm,
      chapterData.idFont,
      chapterData.idManga,
      chapterData.idChap
    );

    if (existingDownloadResults.length > 0) {
      // 2. Se já existe, remove o registro (Simula a ação de "Deletar Download" do celular)
      console.log(`Registro de download com UID '${uid}' encontrado. Removendo...`);
      const deleted = deleteDownloadChapterByUid(realm, uid);
      if (deleted) {
        return `Download do capítulo '${uid}' removido do banco.`;
      } else {
        return `Falha ao remover download do capítulo '${uid}'.`;
      }
    } else {
      // 3. Se não existe, adiciona o registro
      console.log(`Registro de download com UID '${uid}' não encontrado. Adicionando...`);
      
      // Ajustado para passar o objeto correto esperado pela função limpa acima
      await createDownloadChapter(realm, {
        idChap: chapterData.idChap,
        idFont: chapterData.idFont,
        idManga: chapterData.idManga,
        title: chapterData.title,
        chapterNumber: chapterData.chapterNumber,
        scanName: chapterData.scanName,
        volume: chapterData.volume,
        date: chapterData.date,
      });
      return `Download do capítulo '${uid}' registrado com sucesso.`;
    }
  } catch (error) {
    console.error(`Erro ao alternar download do capítulo '${uid}':`, error);
    throw error;
  }
}