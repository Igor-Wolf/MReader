// src/services/ninemanga.ts
import * as cheerio from "cheerio";
import { fetchWithNativeGet } from "../utils/nativeHttpRequest"; // <-- Importa daqui!
import { MangaCoverModel } from "../Models/MangaModel";

const BASE_URL = "https://br.ninemanga.com";

export async function GetAllMangaNimeMnaga(page: number = 1, idFont: number) {
  const url = `${BASE_URL}/list/New-Update/`;
  try {
    const headers = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; WOW64) Gecko/20100101 Firefox/75",
      "Accept-Language": "es-ES,es;q=0.9,en;q=0.8",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    };

    const response = await fetchWithNativeGet(url, headers);

    if (response.status !== 200) {
      console.error(`Erro HTTP: ${response.status} - ${response.body}`);
      return [];
    }

    const htmlData = response.body;

    if (!htmlData) {
      console.error("Nenhum corpo de resposta HTML recebido.");
      return [];
    }

    const $ = cheerio.load(htmlData);
    const elements = $("dl.bookinfo");
    let returnList: MangaCoverModel[] = [];
    elements.each((_, el) => {
      const title = $(el).find("a.bookname").text().trim();
      const relativeUrl = $(el).find("a.bookname").attr("href") || "";
      const thumbnail = $(el).find("img").attr("src") || "";

      returnList.push({
        id: relativeUrl,
        idFont: idFont,
        slug: title ?? "No Title",
        coverImage: thumbnail,
      });
    });
    return returnList;
  } catch (error) {
    console.error("Erro ao buscar atualizações (Módulo Nativo):", error);
    if ((error as any).code) {
      console.error(`Código de Erro Nativo: ${(error as any).code}`);
    }
    return [];
  }
}

export const GetPopularMangaNineManga = async (
  pagination: number,
  idFont: number
) => {
  const url = `${BASE_URL}/category/index_${pagination}.html`;
  try {
    const headers = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; WOW64) Gecko/20100101 Firefox/75",
      "Accept-Language": "es-ES,es;q=0.9,en;q=0.8",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    };

    const response = await fetchWithNativeGet(url, headers);

    if (response.status !== 200) {
      console.error(`Erro HTTP: ${response.status} - ${response.body}`);
      return [];
    }

    const htmlData = response.body;

    if (!htmlData) {
      console.error("Nenhum corpo de resposta HTML recebido.");
      return [];
    }

    const $ = cheerio.load(htmlData);
    const elements = $("dl.bookinfo");
    let returnList: MangaCoverModel[] = [];
    elements.each((_, el) => {
      const title = $(el).find("a.bookname").text().trim();
      const relativeUrl = $(el).find("a.bookname").attr("href") || "";
      const thumbnail = $(el).find("img").attr("src") || "";

      returnList.push({
        id: relativeUrl,
        idFont: idFont,
        slug: title ?? "No Title",
        coverImage: thumbnail,
      });
    });
    return returnList;
  } catch (error) {
    console.error("Erro ao buscar atualizações (Módulo Nativo):", error);
    if ((error as any).code) {
      console.error(`Código de Erro Nativo: ${(error as any).code}`);
    }
    return [];
  }
};

export const GetMangaByNameNineManga = async (
  pagination: number,
  idFont: number,
  slug: string
) => {
  const url = `${BASE_URL}/search/?wd=${encodeURIComponent(slug)}&page=${pagination}`;
  try {
    const headers = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; WOW64) Gecko/20100101 Firefox/75",
      "Accept-Language": "es-ES,es;q=0.9,en;q=0.8",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    };

    const response = await fetchWithNativeGet(url, headers);

    if (response.status !== 200) {
      console.error(`Erro HTTP: ${response.status} - ${response.body}`);
      return [];
    }

    const htmlData = response.body;

    if (!htmlData) {
      console.error("Nenhum corpo de resposta HTML recebido.");
      return [];
    }

    const $ = cheerio.load(htmlData);
    const elements = $("dl.bookinfo");
    let returnList: MangaCoverModel[] = [];
    elements.each((_, el) => {
      const title = $(el).find("a.bookname").text().trim();
      const relativeUrl = $(el).find("a.bookname").attr("href") || "";
      const thumbnail = $(el).find("img").attr("src") || "";

      returnList.push({
        id: relativeUrl,
        idFont: idFont,
        slug: title ?? "No Title",
        coverImage: thumbnail,
      });
    });
    return returnList;
  } catch (error) {
    console.error("Erro ao buscar atualizações (Módulo Nativo):", error);
    if ((error as any).code) {
      console.error(`Código de Erro Nativo: ${(error as any).code}`);
    }
    return [];
  }
};
