// src/services/ninemanga.ts
import * as cheerio from "cheerio";
import { fetchWithNativeGet } from "../utils/nativeHttpRequest"; // <-- Importa daqui!
import {
  MangaChapterModel,
  MangaCoverModel,
  MangaDetailsModel,
  MangaPage,
  NextPrevMangaPage,
} from "../Models/MangaModel";
import { parse, format } from "date-fns";
import { GetMangaChapterListHqNow } from "./HqNowService";

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
  const url = `${BASE_URL}/search/?wd=${encodeURIComponent(
    slug
  )}&page=${pagination}`;
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

export const GetMangaByIDNineManga = async (
  idManga: string
): Promise<MangaDetailsModel | null> => {
  const url = `${idManga}`;
  try {
    const headers = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; WOW64) Gecko/20100101 Firefox/75",
      "Accept-Language": "es-ES,es;q=0.9,en;q=0.8",
    };

    const response = await fetchWithNativeGet(url, headers);
    if (response.status !== 200 || !response.body) {
      console.error("Erro ao buscar detalhes do mangá:", response.status);
      return null;
    }

    const $ = cheerio.load(response.body);
    const info = $("div.bookintro");

    const title = info
      .find("li > span:not([class])")
      .text()
      .replace(/ Manga$/, "")
      .trim();
    const author = info.find("li a[itemprop=author]").text().trim();
    const year = info.find("li a[itemprop=year]").text().trim();
    const description = info.find("p[itemprop=description]").text().trim();
    const genres = info
      .find("li[itemprop=genre] a")
      .map((_, e) => $(e).text().trim())
      .get();
    const statusRaw = info
      .find("li > b:contains('Status:') + a.red")
      .text()
      .trim();
    const thumbnail = info.find("img[itemprop=image]").attr("src");

    const returnManga: MangaDetailsModel = {
      id: idManga,
      description: description || "",
      status: statusRaw,
      year: year,
      author: author || "Desconhecido",
      artist: author || "Desconhecido",
      tags: genres || [],
      coverImage: null,
    };

    return returnManga;
  } catch (error) {
    console.error("Erro ao buscar detalhes do mangá:", error);
    return null;
  }
};

export const GetMangaChapterListNineManga = async (idManga: string) => {
  const url = `${idManga}?waring=1`;
  const headers = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; WOW64) Gecko/20100101 Firefox/75",
    "Accept-Language": "es-ES,es;q=0.9,en;q=0.8",
    Accept: "text/html",
  };

  try {
    const response = await fetch(url, { headers });
    const html = await response.text();

    const $ = cheerio.load(html);

    const chapters: Array<{ name: string; url: string; date?: string }> = [];

    $("ul.sub_vol_ul > li").each((_, el) => {
      const chapterAnchor = $(el).find("a.chapter_list_a");
      const name = chapterAnchor.text().trim();
      const url = chapterAnchor.attr("href") || "";

      // --- CORREÇÃO AQUI ---
      // Busque o span adjacente DENTRO do contexto do 'el' atual
      const dateText = $(el).find(".page_choose + span").text().trim();
      // --- FIM DA CORREÇÃO ---

      chapters.push({ name, url, date: null });
    });

    const newChapterList: MangaChapterModel[] = [];
    if (response.status === 200) {
      const ChapterList = chapters;
      ChapterList.forEach((chap: any) => {
        // Você também precisa extrair o capítulo e o volume aqui se for usar na ordenação.
        // O `id` do capítulo pode ser usado para extrair o número do capítulo.
        const chapterMatch = chap.name.match(/(\d+(\.\d+)?)$/); // Exemplo: pega o número no final do título
        const chapterNumber = chapterMatch ? parseFloat(chapterMatch[1]) : null;
        const auxiName = chap.name.replace(/\s\d+(\.\d+)?$/, "").trim();
        newChapterList.push({
          id: chap.url,
          volume: null, // Pode precisar de outro seletor para volume se ele existir
          chapter: chapterNumber, // Atribui o número do capítulo
          title: auxiName ?? null,
          date: chap.date ?? null, // Atribui a data aqui
          scanName: null,
        });
      });
      newChapterList.sort((a, b) => {
        const chapterA = parseFloat(a.chapter);
        const chapterB = parseFloat(b.chapter);

        if (isNaN(chapterA)) return 1;
        if (isNaN(chapterB)) return -1;

        return chapterB - chapterA;
      });
      return newChapterList;
    } else {
      return [];
    }
  } catch (err) {
    console.error("Erro ao buscar lista de capítulos:", err);
    return [];
  }
};

export const GetPagesListNineManga = async (
  idChap: string
): Promise<MangaPage[]> => {
  try {
    // 1. Baixa a página do capítulo
    const res = await fetchWithNativeGet(idChap, {
      "User-Agent": "Mozilla/5.0",
      "Accept-Language": "en-US,en;q=0.9",
    });

    if (res.status !== 200 || !res.body) {
      console.error(`Erro ao buscar o capítulo: ${res.status}`);
      return [];
    }

    const $ = cheerio.load(res.body);

    // 2. Coleta os caminhos das páginas individuais
    const pageOptions = $("select#page option");

    const pageUrls = pageOptions
      .map((i, el) => {
        const value = $(el).attr("value");
        return `${BASE_URL}${value}`;
      })
      .get();
    const uniquePageUrls = [...new Set(pageUrls)];

    // 3. Para cada página, extrai a imagem
    const imageUrls: MangaPage[] = [];

    for (const pageUrl of uniquePageUrls) {
      const pageRes = await fetchWithNativeGet(pageUrl, {
        Referer: `${BASE_URL}/`,
        "User-Agent": "Mozilla/5.0",
      });

      if (pageRes.status !== 200 || !pageRes.body) {
        console.warn(`Erro ao carregar página ${pageUrl}: ${pageRes.status}`);
        continue;
      }

      const $$ = cheerio.load(pageRes.body);
      const imgUrl = $$(".pic_box img.manga_pic").attr("src");

      if (imgUrl) {
        imageUrls.push(imgUrl);
      }
    }
    return imageUrls;
  } catch (error) {
    console.error("Erro ao buscar imagens do capítulo:", error);
    return [];
  }
};

export const GetPagesListPrevChapterNineManga = async (
  idChap: string,
  idManga: string
): Promise<NextPrevMangaPage | null> => {
  try {
    const responseListChapters = await GetMangaChapterListNineManga(idManga);

    if (!responseListChapters || responseListChapters.length === 0) {
      return null;
    }

    const currentIndex = responseListChapters.findIndex(
      (item) => item.id === idChap
    );

    const nextChapter = responseListChapters[currentIndex + 1];

    if (!nextChapter) {
      console.warn("Nenhum próximo capítulo encontrado.");
      return null;
    }
    const response = await GetPagesListNineManga(nextChapter.id);

    if (response) {

      const pageList: MangaPage[] = response;

      return {
        list: pageList,
        id: nextChapter.id,
        title: nextChapter.title,
        chapterNumber: nextChapter.chapter,
      };
    }

    return null;
  } catch (error) {
    console.error("Erro ao buscar páginas do próximo capítulo:", idChap, error);
    return null;
  }
};
export const GetPagesListNextChapterNineManga = async (
  idChap: string,
  idManga: string
): Promise<NextPrevMangaPage | null> => {
  try {
    const responseListChapters = await GetMangaChapterListNineManga(idManga);

    if (!responseListChapters || responseListChapters.length === 0) {
      return null;
    }

    const currentIndex = responseListChapters.findIndex(
      (item) => item.id === idChap
    );

    const nextChapter = responseListChapters[currentIndex - 1];

    if (!nextChapter) {
      console.warn("Nenhum próximo capítulo encontrado.");
      return null;
    }

    const response = await GetPagesListNineManga(nextChapter.id);

    if (response) {
      const pageList: MangaPage[] = response;

      return {
        list: pageList,
        id: nextChapter.id,
        title: nextChapter.title,
        chapterNumber: nextChapter.chapter,
      };
    }

    return null;
  } catch (error) {
    console.error("Erro ao buscar páginas do próximo capítulo:", idChap, error);
    return null;
  }
};
