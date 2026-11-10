
import {
  createUpdateChapter,
  deleteUpdateChapterByUidAll,
} from "../../database/Crud/updateChapters";

import { GetChapterList } from "../../views/MangaDetails/action";

interface Manga {
  id: string | number;
  idFont: string | number;
  titleManga?: string;
  slug?: string;
  coverImage?: string;
}

interface Chapter {
  id: string | number;
  idFont: string | number;
  idManga: string | number;
  chapter?: string | number;
  title?: string;
}

interface UpdateOptions {
  allowEmptyList?: boolean;
  delayMs?: number;
}

interface UpdateResult {
  success: boolean;
  totalOperations: number;
  totalCreated: number;
  totalDeleted: number;
  totalErrors: number;
}

const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

export const lookForUpdate = async (
  realm: any,
  mangaList: Manga[],
  chapterList: Chapter[],
  onProgress: (current: number, total: number) => void = () => {},
  options: UpdateOptions = {}
): Promise<UpdateResult> => {
  const {
    allowEmptyList = false,
    delayMs = 1700,
  } = options;

  console.log(
    `🔍 Inicializando sincronização para ${mangaList.length} mangás...`
  );

  const makeUid = (
    idFont: string | number,
    idManga: string | number,
    idChap: string | number
  ) =>
    `${String(idFont)}:${String(idManga)}:${String(idChap)}`;

  // Índice dos capítulos já cadastrados
  const idsChapterList = new Set(
    chapterList.map((item) =>
      makeUid(item.idFont, item.idManga, item.id)
    )
  );

  let totalOperations = 0;
  let totalErrors = 0;
  let totalCreated = 0;
  let totalDeleted = 0;

  for (let mangaIdx = 0; mangaIdx < mangaList.length; mangaIdx++) {
    const manga = mangaList[mangaIdx];

    try {
      if (
        manga.id === undefined ||
        manga.idFont === undefined
      ) {
        throw new Error("Identificação do mangá inválida.");
      }

      const mangaId = String(manga.id);
      const fontId = String(manga.idFont);

      const mangaName =
        manga.titleManga ||
        manga.slug ||
        mangaId;

      console.log(`⏳ Processando: ${mangaName}`);

      // Intervalo configurável entre consultas
      if (delayMs > 0 && mangaIdx > 0) {
        await sleep(delayMs);
      }

      const response = await GetChapterList(
        realm,
        manga.idFont,
        manga.id
      );

      // Não permite trabalhar com respostas inválidas
      if (!Array.isArray(response)) {
        throw new Error(
          `A fonte retornou uma resposta inválida para ${mangaName}.`
        );
      }

      // Não permite excluir registros por uma resposta vazia inesperada
      if (response.length === 0 && !allowEmptyList) {
        throw new Error(
          `Lista vazia para ${mangaName}. Exclusão bloqueada por segurança.`
        );
      }

      // Valida todos os capítulos antes de modificar o banco
      const invalidChapter = response.find(
        (item) =>
          !item ||
          item.id === undefined ||
          item.id === null ||
          String(item.id).trim() === ""
      );

      if (invalidChapter) {
        throw new Error(
          `A fonte retornou capítulos com identificação inválida: ${mangaName}.`
        );
      }

      const idsSourceList = new Set<string>(
        response.map((item) =>
          makeUid(fontId, mangaId, item.id)
        )
      );

      const chaptersOfManga = chapterList.filter(
        (item) =>
          String(item.idFont) === fontId &&
          String(item.idManga) === mangaId
      );

      // Identifica capítulos novos
      const itensFaltantes = response.filter((item) => {
        const uid = makeUid(
          fontId,
          mangaId,
          item.id
        );

        return !idsChapterList.has(uid);
      });

      // Preserva a ordem original de cadastro
      itensFaltantes.reverse();

      // Primeiro cadastra os capítulos novos
      let creationFailed = false;

      for (const chap of itensFaltantes) {
        const uid = makeUid(
          fontId,
          mangaId,
          chap.id
        );

        try {
          const chapterData = {
            idChap: String(chap.id),
            idFont: manga.idFont,
            idManga: mangaId,
            titleManga: manga.slug || "",
            coverImage: manga.coverImage || "",
            chapterNumber: String(chap.chapter ?? "0"),
            title: chap.title || "",
          };

          await createUpdateChapter(
            realm,
            chapterData
          );

          idsChapterList.add(uid);

          totalOperations++;
          totalCreated++;

          console.log(
            `➕ ${mangaName} - Capítulo ${chap.chapter ?? "?"}`
          );

        } catch (error) {
          creationFailed = true;
          totalErrors++;

          console.error(
            `❌ Erro ao cadastrar capítulo ${chap.id} de ${mangaName}:`,
            error
          );
        }
      }

      // Se algum cadastro falhou, não exclui capítulos antigos.
      if (creationFailed) {
        console.warn(
          `⚠️ Exclusões suspensas para ${mangaName} devido a falhas de cadastro.`
        );

        continue;
      }

      // Agora identifica os capítulos removidos
      const itensExcluidos = chaptersOfManga.filter(
        (item) => {
          const uid = makeUid(
            item.idFont,
            item.idManga,
            item.id
          );

          return !idsSourceList.has(uid);
        }
      );

      // Exclusões somente após a validação e os cadastros
      for (const chap of itensExcluidos) {
        const uid = makeUid(
          fontId,
          mangaId,
          chap.id
        );

        try {
          await deleteUpdateChapterByUidAll(
            realm,
            uid
          );

          idsChapterList.delete(uid);

          totalOperations++;
          totalDeleted++;

          console.log(
            `🗑️ ${mangaName} - Capítulo removido: ${chap.chapter ?? chap.id}`
          );

        } catch (error) {
          totalErrors++;

          console.error(
            `❌ Erro ao excluir capítulo ${chap.id} de ${mangaName}:`,
            error
          );
        }
      }

    } catch (error) {
      totalErrors++;

      console.error(
        `❌ Erro ao processar ${manga?.titleManga || manga?.id}:`,
        error
      );

    } finally {
      try {
        onProgress(
          mangaIdx + 1,
          mangaList.length
        );
      } catch (progressError) {
        console.error(
          "Erro ao atualizar progresso:",
          progressError
        );
      }
    }
  }

  const result: UpdateResult = {
    success: totalErrors === 0,
    totalOperations,
    totalCreated,
    totalDeleted,
    totalErrors,
  };

  console.log(
    `\n📊 RESULTADO FINAL:\n` +
    `Operações: ${totalOperations}\n` +
    `Novos: ${totalCreated}\n` +
    `Removidos: ${totalDeleted}\n` +
    `Erros: ${totalErrors}`
  );

  return result;
};
