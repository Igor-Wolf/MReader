import axios from "axios";

export const HqNowApi = axios.create({
    baseURL: 'https://admin.hq-now.com/graphql',
    headers: {
      'Content-Type': 'application/json',
    }
})