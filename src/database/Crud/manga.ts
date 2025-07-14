export async function createManga(realm, { id, idFont, slug, coverImage }) {
  const uid = `${idFont}:${id}`;

  const response = await getManga(realm, idFont, id);

  let resultMessage = "";

  realm.write(() => {
    if (response) {
      realm.delete(response);
      resultMessage = "Removido";
    } else {
      realm.create(
        "Manga",
        {
          uid,
          id: String(id),
          idFont,
          slug,
          coverImage,
        },
        "modified"
      );
      resultMessage = "Adicionado";
    }
  });

  return resultMessage;
}

export function getManga(realm, idFont: number, id: string) {
  const uid = `${idFont}:${String(id)}`;

  return realm.objectForPrimaryKey("Manga", uid);
}

export function getAllMangas(realm) {
  return realm.objects("Manga");
}
