

export const ChapterSchema = {
  name: 'Chapter',
  primaryKey: 'uid',
  properties: {
    uid: 'string',        // `${idFont}:${chapterId}`
    id: 'string',
    mangaUid: 'string',   // ref para o Manga.uid
    idFont: 'int',
    title: 'string',
    number: 'int',
    pages: 'int',
    createdAt: 'date',
  },
};
