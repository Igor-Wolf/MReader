export const UpdateChapterSchema = {
  name: "UpdateChapter",
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
    dateUpdate: "date",       
  },
};




