export const DownloadChapterSchema = {
  name: "DownloadChapter",
  primaryKey: "uid",
  properties: {
    uid: "string",             // `${idFont}:${idManga}:${chapterId}`
    id: "string",              // id chapter
    idManga: "string",
    idFont: "int",
    title: "string?",          // Opcional (Aceita string ou null)
    chapterNumber: "string?",  // Opcional (Aceita string ou null)
    scanName: "string?",       // CORRIGIDO: Sintaxe correta do Realm para opcional
    volume: "string?",            // CORRIGIDO: Realm usa "int", "float" ou "double", não "number"
    date: "string?"            // CORRIGIDO: Sintaxe correta do Realm para opcional
  },
};


