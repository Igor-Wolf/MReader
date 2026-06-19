// src/services/novelcool.ts
import * as cheerio from "cheerio";
import { fetchWithNativeGet } from "../utils/nativeHttpRequest";
import {
  MangaChapterModel,
  MangaCoverModel,
  MangaDetailsModel,
  MangaPage,
  NextPrevMangaPage,
} from "../Models/MangaModel";
import { DateConvertNineManga } from "../utils/convertDate"; // Mantenha ou altere para sua função de data global

const BASE_URL = "https://br.novelcool.com"; // Ajustado para o subdomínio BR se necessário, ou use apenas https://www.novelcool.com
const API_URL = "https://api.novelcool.com";
const APP_ID = "202201290625004";
const APP_SECRET = "c73a8590641781f203660afca1d37ada";
const SIZE = 20;

// Headers padrão para emular o navegador
const DEFAULT_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Cache-Control": "no-cache",
  "Pragma": "no-cache",
};

/**
 * Função utilitária para fazer requisições POST nativas para a API do NovelCool
 */
async function fetchApiPost(url: string, payload: object) {
  // Caso seu fetchWithNativeGet só faça GET, emulamos o comportamento usando o fetch global
  // Se possuir um "fetchWithNativePost", substitua aqui.
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": DEFAULT_HEADERS["User-Agent"],
    },
    body: JSON.stringify(payload),
  });
  
  if (!response.ok) return { status: response.status, data: null };
  const data = await response.json();
  return { status: response.status, data };
}

/**
 * Últimas Atualizações (GetAllManga) via API do App (Muito mais estável)
 */
export async function GetAllMangaNovelCool(page: number = 1, idFont: number): Promise<MangaCoverModel[]> {
  const url = `${API_URL}/elite/latest/`;
  const payload = {
    
    lang: "pt", // Idioma dos metadados buscados
    type: "manga",
    page: page.toString(),
    size: SIZE.toString(),
    
  };

  try {
    const { status, data } = await fetchApiPost(url, payload);

    if (status !== 200 || !data || !data.list) {
      // Fallback via HTML caso a API falhe
      return await GetAllMangaNovelCoolHTML(page, idFont);
    }

    return data.list.map((item: any) => ({
      id: item.url.startsWith("http") ? item.url : `${BASE_URL}${item.url}`,
      idFont: idFont,
      slug: item.name || "No Title",
      coverImage: item.manga_pic || "",
    }));
  } catch (error) {
    console.error("Erro ao buscar atualizações do NovelCool (API):", error);
    return await GetAllMangaNovelCoolHTML(page, idFont);
  }
}

// Fallback HTML para as Atualizações Recentes
async function GetAllMangaNovelCoolHTML(page: number, idFont: number): Promise<MangaCoverModel[]> {
  const url = `${BASE_URL}/category/latest.html?page=${page}`;
  try {
    const response = await fetchWithNativeGet(url, DEFAULT_HEADERS);
    if (response.status !== 200 || !response.body) return [];

    const $ = cheerio.load(response.body);
    let returnList: MangaCoverModel[] = [];

    $(".book-list .book-item:not(:has(.book-type-novel))").each((_, el) => {
      const title = $(el).find(".book-pic").attr("title")?.trim() || "";
      let href = $(el).find("a").attr("href") || "";
      if (href && !href.startsWith("http")) href = `${BASE_URL}${href}`;
      
      const imgEl = $(el).find("img");
      const thumbnail = imgEl.attr("lazy_url") || imgEl.attr("src") || "";

      returnList.push({
        id: href,
        idFont: idFont,
        slug: title || "No Title",
        coverImage: thumbnail,
      });
    });
    return returnList;
  } catch (e) {
    console.error("Erro no fallback HTML do NovelCool:", e);
    return [];
  }
}

/**
 * Mangás Mais Populares
 */
export async function GetPopularMangaNovelCool(page: number = 1, idFont: number): Promise<MangaCoverModel[]> {
  const url = `${API_URL}/elite/hot/`;
  const payload = {
    
    lang: "pt",
    type: "manga",
    page: page.toString(),
    size: SIZE.toString(),
 
  };

  try {
    const { status, data } = await fetchApiPost(url, payload);

    if (status !== 200 || !data || !data.list) {
      // Fallback via HTML Popular
      const fallbackUrl = `${BASE_URL}/category/new_list.html?page=${page}`;
      const response = await fetchWithNativeGet(fallbackUrl, DEFAULT_HEADERS);
      if (response.status !== 200 || !response.body) return [];
      const $ = cheerio.load(response.body);
      let returnList: MangaCoverModel[] = [];
      $(".book-list .book-item:not(:has(.book-type-novel))").each((_, el) => {
        const title = $(el).find(".book-pic").attr("title")?.trim() || "";
        let href = $(el).find("a").attr("href") || "";
        if (href && !href.startsWith("http")) href = `${BASE_URL}${href}`;
        const imgEl = $(el).find("img");
        const thumbnail = imgEl.attr("lazy_url") || imgEl.attr("src") || "";
        returnList.push({ id: href, idFont, slug: title, coverImage: thumbnail });
      });
      return returnList;
    }

    return data.list.map((item: any) => ({
      id: item.url.startsWith("http") ? item.url : `${BASE_URL}${item.url}`,
      idFont: idFont,
      slug: item.name || "No Title",
      coverImage: item.manga_pic || "",
    }));
  } catch (error) {
    console.error("Erro ao buscar populares do NovelCool:", error);
    return [];
  }
}

export const GetMangaByIDNovelCool = async (
  idManga: string
): Promise<MangaDetailsModel | null> => {
  const url = `${idManga}`;
  try {
    const headers = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; WOW64) Gecko/20100101 Firefox/75",
      "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8",
    };

    const response = await fetchWithNativeGet(url, headers);
    if (response.status !== 200 || !response.body) {
      console.error("Erro ao buscar detalhes do mangá:", response.status);
      return null;
    }

    const $ = cheerio.load(response.body);

    // Seletores ajustados para a estrutura de detalhes do NovelCool
    const title = $(".book-info-right .book-name").text().trim() || $("h1").text().trim() || "";
    const author = $(".book-info-right .book-author a").first().text().trim();
    const artist = $(".book-info-right .book-artist a").first().text().trim();
    
    // Captura o ano (o NovelCool costuma colocar no bloco de infos ou texto corrido)
    const year = $(".book-info-right .book-time").text().replace(/\D/g, "").trim() || "";
    
    const description = $(".book-info-bottom .book-intro, .book-intro").text().trim();
    
    const genres = $(".book-info-right .book-cat a, .book-cat a")
      .map((_, e) => $(e).text().trim())
      .get();
      
    const statusRaw = $(".book-info-right .book-state").text().trim();
    
    // Varredura robusta para a imagem de capa (Lazy Load do NovelCool)
    const imgEl = $(".book-info-left .book-pic img, .book-pic img").first();
    const thumbnail = imgEl.attr("src") || 
                      imgEl.attr("lazy_url") || 
                      imgEl.attr("data-src") || 
                      null;

    const returnManga: MangaDetailsModel = {
      id: idManga,
      description: description || "",
      status: statusRaw,
      year: year,
      author: author || "Desconhecido",
      artist: artist || author || "Desconhecido",
      tags: genres || [],
      coverImage: thumbnail ? thumbnail.trim() : null,
    };

    return returnManga;
  } catch (error) {
    console.error("Erro ao buscar detalhes do mangá:", error);
    return null;
  }
};

import axios from 'axios';


/**
 * Busca de Mangá por Nome (Combinação: Ajax Sem Filtros + Scraper HTML de Volume)
 */
export async function GetMangaByNameNovelCool(page: number = 1, idFont: number, query: string): Promise<MangaCoverModel[]> {
  const cleanQuery = query.trim();
  const returnList: MangaCoverModel[] = [];

  // -----------------------------------------------------------------
  // ESTRATÉGIA 1: Rota AJAX (Autocomplete - Títulos ocultos / NSFW)
  // -----------------------------------------------------------------
  // Nota: Como o Ajax do site não pagina nativamente por "page", fazemos apenas na primeira página
  if (page === 1) {
    try {
      const ajaxUrl = `https://br.novelcool.com/ajax/search/?term=${encodeURIComponent(cleanQuery)}`;
      const responseAjax = await axios.get(ajaxUrl, {
        timeout: 5000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json, text/javascript, */*; q=0.01',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });

      const dataAjax = responseAjax.data;

      if (Array.isArray(dataAjax)) {
        dataAjax.forEach((item: any) => {
          if (item && item.url) {
            returnList.push({
              id: item.url.trim(),
              idFont: idFont,
              slug: item.name?.trim() || "Sem Título",
              coverImage: item.cover?.trim() || "",
            });
          }
        });
      }
    } catch (error) {
      console.error("Erro na busca complementar via AJAX do NovelCool:", error);
      // Não dropa a execução; deixa seguir para tentar obter resultados pelo HTML
    }
  }

  // -----------------------------------------------------------------
  // ESTRATÉGIA 2: Scraper HTML Tradicional (Volume / Paginação de 20 itens)
  // -----------------------------------------------------------------
  try {
    const searchUrl = `${BASE_URL}/search?name=${encodeURIComponent(cleanQuery)}&page=${page}`;
    
    // Mantido o fetchWithNativeGet do seu ecossistema original para a paginação
    const responseHtml = await fetchWithNativeGet(searchUrl, DEFAULT_HEADERS);
    
    if (responseHtml.status === 200 && responseHtml.body) {
      const $ = cheerio.load(responseHtml.body);
      
      $(".book-list .book-item").each((_, el) => {
        // Ignora Novels via código (mais seguro que seletores complexos no Cheerio)
        if ($(el).find(".book-type-novel").length > 0) return;

        const title = $(el).find(".book-pic").attr("title")?.trim() || "";
        let href = $(el).find("a").first().attr("href") || "";
        
        if (href && !href.startsWith("http")) {
          href = `${BASE_URL}${href}`;
        }
        
        const imgEl = $(el).find("img");
        const cover = imgEl.attr("lazy_url") || 
                      imgEl.attr("data-src") || 
                      imgEl.attr("data-original") || 
                      imgEl.attr("src") || 
                      "";

        if (!href || !title) return;

        returnList.push({ 
          id: href.trim(), 
          idFont, 
          slug: title, 
          coverImage: cover.trim() 
        });
      });
    }
  } catch (error) {
    console.error("Erro na busca via HTML Scraper do NovelCool:", error);
  }

  // -----------------------------------------------------------------
  // FILTRO ANTI-DUPLICADAS: Limpeza por ID único
  // -----------------------------------------------------------------
  const uniqueMangaList = returnList.filter((value, index, self) =>
    index === self.findIndex((t) => t.id.toLowerCase() === value.id.toLowerCase())
  );

  return uniqueMangaList;
}
/**
 * Obter a Lista de Capítulos de um Mangá do NovelCool
 */
export async function GetMangaChapterListNovelCool(idManga: string): Promise<MangaChapterModel[]> {
  try {
    const response = await fetchWithNativeGet(idManga, DEFAULT_HEADERS);
    
    if (response.status !== 200 || !response.body) return [];

    const $ = cheerio.load(response.body);
    const newChapterList: MangaChapterModel[] = [];

    // CORREÇÃO 1: Focar direto na classe do item. 
    // Como o HTML deles é quebrado, procurar direto por ".chp-item" evita problemas de herança de pais.
    $(".chp-item").each((_, el) => {
      // CORREÇÃO 2: O link 'a' está logo abaixo de .chp-item
      const anchor = $(el).find("a").first();
      const href = anchor.attr("href")?.trim() || "";
      if (!href) return;

      // CORREÇÃO 3: Buscar as classes internas de forma isolada
      const name = $(el).find(".chapter-item-headtitle").text().trim();
      const dateText = $(el).find(".chapter-item-time").text().trim();

      if (!name) return; // Evita nós fantasmas criados pelo parser do HTML malformado

      // REGEX: Captura o número (inteiro ou decimal) isolando do texto
      const chapterMatch = name.match(/(?:capítulo|cap|ch|chapter)?\s*(\d+(?:\.\d+)?)/i);
      let chapterNumber = "0";

      if (chapterMatch && chapterMatch[1]) {
        chapterNumber = chapterMatch[1];
      }

      newChapterList.push({
        id: href,
        volume: null,
        chapter: chapterNumber,
        title: name,
        date: dateText || null,
        scanName: null,
      });
    });

    if (newChapterList.length === 0) {
      // FALLBACK DESESPERO: Se o seletor de classe falhar devido ao parser, busca puramente pelos links de capítulo
      $("a[href*='/chapter/']").each((_, el) => {
        const href = $(el).attr("href")?.trim() || "";
        const name = $(el).find(".chapter-item-headtitle").text().trim() || $(el).attr("title")?.trim() || "";
        const dateText = $(el).find(".chapter-item-time").text().trim();

        if (!href || !name) return;

        const chapterMatch = name.match(/(?:capítulo|cap|ch|chapter)?\s*(\d+(?:\.\d+)?)/i);
        const chapterNumber = chapterMatch ? chapterMatch[1] : "0";

        newChapterList.push({
          id: href,
          volume: null,
          chapter: chapterNumber,
          title: name,
          date: dateText || null,
          scanName: null,
        });
      });
    }

    // Filtro de duplicatas por ID
    const uniqueChapters = newChapterList.filter((value, index, self) =>
      index === self.findIndex((t) => t.id === value.id)
    );

    // Ordenação decrescente estável
    return uniqueChapters.sort((a, b) => parseFloat(b.chapter) - parseFloat(a.chapter));
  } catch (err) {
    console.error("Erro ao buscar lista de capítulos no NovelCool:", err);
    return [];
  }
}

/**
 * Obter Lista de Páginas/Imagens (Descriptografa o array JS `all_imgs_url`)
 */
export async function GetPagesListNovelCool(idChap: string): Promise<MangaPage[]> {
  try {
    const res = await fetchWithNativeGet(idChap, DEFAULT_HEADERS);
    if (res.status !== 200 || !res.body) return [];

    let $ = cheerio.load(res.body);

    // O NovelCool costuma redirecionar para um intermediador ("choose a source").
    // Verificamos se existe o botão clássico da infraestrutura de servidores deles:
    const serverUrl = $("a.vision-button").attr("href");
    if (serverUrl) {
      const targetUrl = serverUrl.startsWith("http") ? serverUrl : `${BASE_URL}${serverUrl}`;
      const serverRes = await fetchWithNativeGet(targetUrl, { ...DEFAULT_HEADERS, Referer: idChap });
      if (serverRes.body) {
        $ = cheerio.load(serverRes.body);
      }
    }

    // Procura o bloco de script que guarda todas as URLs pré-carregadas
    let scriptData = "";
    $("script").each((_, el) => {
      const html = $(el).html() || "";
      if (html.includes("all_imgs_url")) {
        scriptData = html;
      }
    });

    if (scriptData) {
      // Isola o conteúdo interno do array `all_imgs_url: [...]`
      const arrayContent = scriptData.split("all_imgs_url: [")[1]?.split("]")[0];
      if (arrayContent) {
        // Encontra todas as ocorrências de strings HTTP/HTTPS (ignora quebras ou vírgulas órfãs)
        const imageUrlRegex = /["'](https?:\/\/[^"']+)["']/g;
        let match;
        const images: MangaPage[] = [];

        while ((match = imageUrlRegex.exec(arrayContent)) !== null) {
          let cleanedUrl = match[1].replace(/\\/g, ""); // Corrige possíveis caracteres de escape anti-barra
          images.push(cleanedUrl);
        }

        if (images.length > 0) {
          return images; // Retorna o array de strings (conforme sua tipagem MangaPage[])
        }
      }
    }

    // Fallback: Se não achar o script injetado, raspa as páginas uma por uma via paginação clássica do site
    const pageOptions = $(".mangaread-pagenav > .sl-page option");
    if (pageOptions.length > 0) {
      const imageUrls: MangaPage[] = [];
      const pageUrls: string[] = [];

      pageOptions.each((_, el) => {
        const val = $(el).attr("value");
        if (val) pageUrls.push(val.startsWith("http") ? val : `${BASE_URL}${val}`);
      });

      const uniqueUrls = [...new Set(pageUrls)];

      for (const pageUrl of uniqueUrls) {
        const pageRes = await fetchWithNativeGet(pageUrl, { ...DEFAULT_HEADERS, Referer: idChap });
        if (!pageRes.body) continue;
        const $$ = cheerio.load(pageRes.body);
        const imgUrl = $$(".mangaread-manga-pic").attr("src");
        if (imgUrl) imageUrls.push(imgUrl);
      }
      return imageUrls;
    }

    return [];
  } catch (error) {
    console.error("Erro ao buscar imagens do capítulo no NovelCool:", error);
    return [];
  }
}

/**
 * Capítulo Anterior
 */
export const GetPagesListPrevChapterNovelCool = async (idChap: string, idManga: string): Promise<NextPrevMangaPage | null> => {
  try {
    const responseListChapters = await GetMangaChapterListNovelCool(idManga);
    if (!responseListChapters || responseListChapters.length === 0) return null;

    const currentIndex = responseListChapters.findIndex((item) => item.id === idChap);
    const nextChapter = responseListChapters[currentIndex + 1]; // Próximo na lista decrescente = Capítulo Anterior

    if (!nextChapter) return null;
    const response = await GetPagesListNovelCool(nextChapter.id);

    if (response) {
      return {
        list: response,
        id: nextChapter.id,
        title: nextChapter.title,
        chapterNumber: nextChapter.chapter,
      };
    }
    return null;
  } catch (error) {
    console.error("Erro ao buscar páginas do capítulo anterior (NovelCool):", error);
    return null;
  }
};

/**
 * Próximo Capítulo
 */
export const GetPagesListNextChapterNovelCool = async (idChap: string, idManga: string): Promise<NextPrevMangaPage | null> => {
  try {
    const responseListChapters = await GetMangaChapterListNovelCool(idManga);
    if (!responseListChapters || responseListChapters.length === 0) return null;

    const currentIndex = responseListChapters.findIndex((item) => item.id === idChap);
    const nextChapter = responseListChapters[currentIndex - 1]; // Anterior na lista decrescente = Próximo Capítulo

    if (!nextChapter) return null;
    const response = await GetPagesListNovelCool(nextChapter.id);

    if (response) {
      return {
        list: response,
        id: nextChapter.id,
        title: nextChapter.title,
        chapterNumber: nextChapter.chapter,
      };
    }
    return null;
  } catch (error) {
    console.error("Erro ao buscar páginas do próximo capítulo (NovelCool):", error);
    return null;
  }
};