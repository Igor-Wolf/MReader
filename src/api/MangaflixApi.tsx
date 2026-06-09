import axios from "axios";

export const MangaflixApi = axios.create({
    baseURL: 'https://api.mangaflix.net/v1',
    headers: {
      'Content-Type': 'application/json',
    }
})