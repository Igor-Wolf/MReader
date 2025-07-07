import axios from "axios";

export const MangaDexApi = axios.create({
    baseURL: 'https://api.mangadex.org',
    headers: {
      'Content-Type': 'application/json',
    }
})