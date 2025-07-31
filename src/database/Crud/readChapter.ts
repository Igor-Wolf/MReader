export async function createReadChapter(realm: any,{
  idChap,
  idFont,
  idManga,
  coverImage,
  titleManga,
  chapterNumber,
  title,
}: {
  // Desestruturação com tipagem 'any' para as propriedades
  idChap: string;
  idFont: number;
  idManga: string;
  coverImage: string;
  titleManga: string;
  chapterNumber: string;
  title: string;
}) {
  const uid = `${idFont}:${idManga}:${idChap}`; // UID baseado em idFont, idManga e id do capítulo

  try {
    realm.write(() => {
      // Se não existir, ele será criado.
      realm.create(
        "ReadChapter", // Nome do esquema
        {
          uid,
          id: idChap, // Mapeia idChap para a propriedade 'id' no esquema
          idManga: idManga,
          idFont: idFont,
          title: title,
          titleManga: titleManga,
          chapterNumber: chapterNumber,
          coverImage: coverImage,
          lastRead: new Date(), // Define a data da última leitura ao adicionar/atualizar
        },
        "modified"
      );
    });
    console.log(`Capítulo ${uid} salvo/atualizado com sucesso no Realm.`);
    // O retorno 'return' na função async é útil para indicar sucesso
    return true; // Retorna true em caso de sucesso
  } catch (error) {
    console.error(`Erro ao salvar/atualizar capítulo ${uid} no Realm:`, error);
    throw error; // <-- IMPORTANTE: Lança o erro para ser capturado no Reader.tsx
  }
}

export function getReadChapter(
  realm: Realm, // O tipo 'any' pode ser Realm para melhor tipagem
  idFont: number,
  idManga: string,
  idChap: string
) {
  // Retorna uma coleção (Results) de capítulos que correspondem aos critérios.
  // Se nenhum capítulo for encontrado, a coleção estará vazia (length = 0).
  // Se um capítulo for encontrado, a coleção terá length = 1.
  return realm
    .objects("ReadChapter")
    .filtered(
      "idFont == $0 AND idManga == $1 AND id == $2",
      idFont,
      idManga,
      idChap
    );
}

export function getAllReadChapters(realm: any) {
  // Retorna todos os capítulos ordenados por 'lastRead' em ordem descendente (do mais recente para o mais antigo)
  return realm.objects("ReadChapter").sorted("lastRead", true);
}

export function deleteReadChapterByUid(realm: any, uid: string) {
  try {
    // Find the chapter object using its primary key (uid)
    const chapterToDelete = realm.objectForPrimaryKey("ReadChapter", uid);

    if (chapterToDelete) {
      realm.write(() => {
        realm.delete(chapterToDelete); // Delete the found object
      });
      console.log(`Capítulo com UID '${uid}' deletado com sucesso do Realm.`);
      return true;
    } else {
      console.log(`Capítulo com UID '${uid}' não encontrado no Realm.`);
      return false;
    }
  } catch (error) {
    console.error(`Erro ao deletar capítulo com UID '${uid}' do Realm:`, error);
    throw error; // Re-throw the error for external handling
  }
}

export function deleteAllReadChapters(realm: any): boolean {
  try {
    // Obtém todos os objetos da coleção "Chapter"
    const allChapters = realm.objects("ReadChapter");

    if (allChapters.length > 0) {
      realm.write(() => {
        realm.delete(allChapters); // Deleta todos os objetos na coleção
      });
      console.log(
        `Todos os ${allChapters.length} capítulos foram deletados com sucesso do Realm.`
      );
      return true;
    } else {
      console.log("Nenhum capítulo encontrado para deletar.");
      return false;
    }
  } catch (error) {
    console.error("Erro ao deletar todos os capítulos do Realm:", error);
    throw error; // Relança o erro para tratamento externo
  }
}

export async function toggleReadChapter(
  realm: Realm,
  chapterData: {
    idChap: string;
    idFont: number;
    idManga: string;
    coverImage: string;
    titleManga: string;
    chapterNumber: string;
    title: string;
  }
) {
  const uid = `${chapterData.idFont}:${chapterData.idManga}:${chapterData.idChap}`;

  try {
    // 1. Verificar se o capítulo já existe no DB
    // Usamos getChapter que retorna uma Realm.Results.
    // Se .length > 0, significa que o capítulo existe.
    const existingChapterResults = getReadChapter(
      realm,
      chapterData.idFont,
      chapterData.idManga,
      chapterData.idChap
    );

    if (existingChapterResults.length > 0) {
      // 2. Se o capítulo existe, remova-o
      // Como getChapter retorna uma Results, precisamos pegar o primeiro objeto para o UID.
      // Ou, mais fácil, podemos usar deleteChapterByUid que já espera o UID.
      console.log(`Capítulo com UID '${uid}' encontrado. Removendo...`);
      const deleted = deleteReadChapterByUid(realm, uid); // Use sua função existente
      if (deleted) {
        return `Capítulo '${uid}' removido com sucesso.`;
      } else {
        return `Falha ao remover capítulo '${uid}'.`;
      }
    } else {
      // 3. Se o capítulo não existe, adicione-o
      console.log(`Capítulo com UID '${uid}' não encontrado. Adicionando...`);
      await createReadChapter(realm, chapterData); // Use sua função existente
      return `Capítulo '${uid}' adicionado com sucesso.`;
    }
  } catch (error) {
    console.error(`Erro ao alternar o estado do capítulo '${uid}':`, error);
    throw error; // Relança o erro para que o chamador possa tratá-lo
  }
}
