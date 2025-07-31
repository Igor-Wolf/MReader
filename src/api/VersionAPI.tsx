import axios from "axios";

export const VersionApi = axios.create({
    baseURL: 'https://api.github.com/repos/Igor-Wolf/MReader/releases',
    headers: {
      'Content-Type': 'application/json',
    }
})