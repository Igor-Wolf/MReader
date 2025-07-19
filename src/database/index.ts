

import Realm from 'realm';
import { MangaSchema } from './schemas/MangaSchema';
import { ChapterSchema } from './schemas/ChapterSchema';

let realm: Realm;

export async function initRealm() {
  if (realm) return realm;

  realm = await Realm.open({
    schema: [MangaSchema, ChapterSchema],
    path: 'manga-app.realm',
  });
  console.log("Realm aberto com sucesso:", realm.path);
  return realm;
}
