export async function createChapter( // Mantendo o nome 'createChapter' como você o tem
  realm: any, // Tipo 'any' para flexibilidade, como solicitado
  {
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
  }
) {
  const uid = `${idFont}:${idManga}:${idChap}`; // UID baseado em idFont, idManga e id do capítulo

  try {
    realm.write(() => {
      // Usamos "modified" para que, se o capítulo já existir (pelo UID), ele seja atualizado.
      // Se não existir, ele será criado.
      realm.create(
        "Chapter", // Nome do esquema
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

export function getChapter(
  realm: any,
  idFont: number,
  idManga: string,
  idChap: string
) {
  const uid = `${idFont}:${idManga}:${idChap}`;
  return realm.objectForPrimaryKey("Chapter", uid);
}

// Sua função getChaptersByManga foi comentada, então não está incluída aqui.

export function getAllChapters(realm: any) {
  // Retorna todos os capítulos ordenados por 'lastRead' em ordem descendente (do mais recente para o mais antigo)
  return realm.objects("Chapter").sorted("lastRead", true);
}

export function deleteChapterByUid(realm: any, uid: string) {
  try {
    // Find the chapter object using its primary key (uid)
    const chapterToDelete = realm.objectForPrimaryKey("Chapter", uid);

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

export function deleteAllChapters(realm: any): boolean {
  try {
    // Obtém todos os objetos da coleção "Chapter"
    const allChapters = realm.objects("Chapter");

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
