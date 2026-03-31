

import Realm from 'realm';
import { MangaSchema } from './schemas/MangaSchema';
import { ChapterSchema } from './schemas/ChapterSchema';
import { ReadChapterSchema } from './schemas/ReadChapterSchema';
import { AllChapterSchema } from './schemas/AllChapterSchema';

let realm: Realm;

export async function initRealm() {
  if (realm) return realm;

  realm = await Realm.open({
    schema: [MangaSchema, ChapterSchema, ReadChapterSchema, AllChapterSchema],
    path: 'manga-app.realm',
  });
  return realm;
}
