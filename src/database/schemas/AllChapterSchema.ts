export const AllChapterSchema = {
  name: "AllChapter",
  primaryKey: "uid",
  properties: {
    uid: "string", // `${idFont}:${idManga}:${chapterId}`
    id: "string",
    idManga: "string",
    idFont: "int",
    title: "string?",
    titleManga: "string",
    chapterNumber: "string?",
    coverImage: "string",    
  },
};




