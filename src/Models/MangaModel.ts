export interface MangaCoverModel {
  id: string;
  slug: string;
  coverImage: string;
  idFont: number;
}

export interface MangaDetailsModel {
  id: string;
  description: string;
  status: string;
  year: number | string | null;
  author: string;
  artist: string;
  tags: string[];
  coverImage: string | null;
}

export interface MangaChapterModel {
  id: string;
  volume: number | null;
  chapter: number | null;
  title: string | null;
  date: string | null;
  scanName: string | null;
}

export interface MangaPage {
  url: string;
}

export interface NextPrevMangaPage {
  id: string | null;
  list: MangaPage[] | null;
  chapterNumber: string | null;
  title: string | null;
}

export interface ChapterInfo {
  id: string | null;
  idFont: number;
  idManga: string;
  titleManga: string;
  chapterNumber: number | null;
  title: string | null;
  coverImage: string | null;
}
export interface ChapterInfoDatabase {
  id: string | null;
  idFont: number;
  idManga: string;
  titleManga: string;
  chapterNumber: number | null;
  title: string | null;
  coverImage: string | null;
  lastRead: Date;
}

export interface ReaderChapters {
  currentChapter: ChapterInfo;
  nextChapter: ChapterInfo | null;
  prevChapter: ChapterInfo | null;
}
