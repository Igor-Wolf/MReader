export interface MangaCoverModel {
  id: string;
  slug: string;
  coverImage: string;
  idFont: number;
}



export interface MangaDetailsModel{

  id: string,
  description: string,
  status: string,
  year: number,
  author: string,
  artist: string,
  tags: string[]

}


export interface MangaChapterModel{

  id: string,
  volume: number | null,
  chapter: number | null,
  title: string | null,
  date: string | null,
  scanName: string | null


}

export interface MangaPage{

  url: string

}
