export function createManga(realm, { id, idFont, slug, coverImage }) {
  const uid = `${idFont}:${id}`;

  realm.write(() => {
    realm.create('Manga', {
      uid,
      id,
      idFont,
      slug,
      coverImage,
    }, 'modified');
  });
}

export function getManga(realm, idFont: number, id: string) {
  const uid = `${idFont}:${id}`;
  return realm.objectForPrimaryKey('Manga', uid);
}

export function getAllMangas(realm) {
  return realm.objects('Manga');
}
