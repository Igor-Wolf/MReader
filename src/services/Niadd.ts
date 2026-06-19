// src/services/niadd.ts
import * as cheerio from "cheerio";
import { fetchWithNativeGet } from "../utils/nativeHttpRequest";
import {
  MangaChapterModel,
  MangaCoverModel,
  MangaDetailsModel,
  MangaPage,
  NextPrevMangaPage,
} from "../Models/MangaModel";

// Configurações Globais (Igual ao construtor do Tachiyomi)
const BASE_URL = "https://br.niadd.com"; // Mude para o domínio correto se necessário

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) Gecko/20100101 Firefox/75",
  "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
  "Cache-Control": "no-cache",
  Pragma: "no-cache",
};

// Expressões Regulares traduzidas do Kotlin
const ALL_IMGS_URL_REGEX = /all_imgs_url\s*:\s*\[([\s\S]*?)\]/;
const CLEAN_IMG_URL_REGEX = /["'\s]/g;
const CHAPTER_NUMBER_REGEX = /Capítulo\s+(\d+(\.\d+)?)/i;

/**
 * Função utilitária para extrair os mangás das listagens (Popular, Busca, Recentes)
 * Baseado no popularMangaFromElement do Tachiyomi
 */
function parseMangaList(htmlData: string, idFont: number): MangaCoverModel[] {
  const $ = cheerio.load(htmlData);
  const elements = $("div.manga-item");
  const returnList: MangaCoverModel[] = [];

  elements.each((_, el) => {
    const title = $(el).find("div.manga-name").text().trim();
    let rawUrl = $(el).find("a").attr("href") || "";
    
    // Força a URL ser absoluta se for enviada relativa
    if (rawUrl && !rawUrl.startsWith("http")) {
      rawUrl = `${BASE_URL}${rawUrl}`;
    }

    const thumbnail = $(el).find("div.manga-img img").attr("src") || "";

    returnList.push({
      id: rawUrl, // O ID passa a ser a URL completa para evitar erros de rota
      idFont: idFont,
      slug: title || "No Title",
      coverImage: thumbnail,
    });
  });

  return returnList;
}

// 1. POPULAR MANGA
export async function GetPopularMangaNiadd(page: number = 1, idFont: number): Promise<MangaCoverModel[]> {
  const url = `${BASE_URL}/list/Hot-Manga.html`; // Nota: Se o Niadd suportar paginação aqui, mude para refletir a página
  try {
    const response = await fetchWithNativeGet(url, HEADERS);
    if (response.status !== 200 || !response.body) return [];
    return parseMangaList(response.body, idFont);
  } catch (error) {
    console.error("Erro ao buscar populares Niadd:", error);
    return [];
  }
}

// 2. LATEST UPDATES (Recentes)
export async function GetAllMangaNiadd(page: number = 1, idFont: number): Promise<MangaCoverModel[]> {
  const url = `${BASE_URL}/list/New-Update.html`;
  try {
    const response = await fetchWithNativeGet(url, HEADERS);
    if (response.status !== 200 || !response.body) return [];
    return parseMangaList(response.body, idFont);
  } catch (error) {
    console.error("Erro ao buscar atualizações Niadd:", error);
    return [];
  }
}

// 3. SEARCH MANGA
export async function GetMangaByNameNiadd(paginations: number ,  idFont: number, query: string): Promise<MangaCoverModel[]> {
  const url = `${BASE_URL}/search/?name=${encodeURIComponent(query)}`;
  try {
    const response = await fetchWithNativeGet(url, HEADERS);
    if (response.status !== 200 || !response.body) return [];
    return parseMangaList(response.body, idFont);
  } catch (error) {
    console.error("Erro ao pesquisar mangá Niadd:", error);
    return [];
  }
}

/// 4. MANGA DETAILS
export async function GetMangaByIDNiadd(idManga: string): Promise<MangaDetailsModel | null> {
  const url = idManga.startsWith("http") ? idManga : `${BASE_URL}${idManga}`;
  
  try {
    const response = await fetchWithNativeGet(url, HEADERS);
    if (response.status !== 200 || !response.body) return null;

    const $ = cheerio.load(response.body);

    // Título direto e limpo
    const title = $(".book-headline-name").first().text().trim();
    
    // Captura o Status dinamicamente direto do HTML (ex: "Concluído" ou "Em andamento")
    const statusText = $(".book-status").text().toLowerCase();
    const status = statusText.includes("concluído") || statusText.includes("completed") 
      ? "COMPLETED" 
      : "ONGOING";

    // Seletores precisos usando os atributos itemprop que estão mapeados na tabela do Niadd
    const author = $("[itemprop=author]").first().find("[itemprop=name]").text().trim();
    const artist = $("[itemprop=author]").eq(1).find("[itemprop=name]").text().trim() || author;
    
    // Coleta dos gêneros mapeados corretamente por itemprop
    const genres: string[] = $("[itemprop=genre]").map((_, e) => $(e).text().replace(/[\s,]+/g, "").trim()).get();

    // Extração precisa do Ano de publicação
    const yearClean = $("[itemprop=datePublished]").first().text().trim();

    // Captura Inteligente da Sinopse: se falhar no DOM, puxa direto da Meta Tag da página
    let synopsisText = "";
    $(".detail-cate-title").each((_, titleEl) => {
      const titleText = $(titleEl).text().toLowerCase();
      if (["synopsis", "sinopsis", "sinopse", "resumo", "introdução"].some(k => titleText.includes(k))) {
        const nextSection = $(titleEl).next();
        if (nextSection.length > 0 && !nextSection.find("[itemprop=genre]").length) {
          synopsisText = nextSection.text().trim();
        }
      }
    });

    if (!synopsisText) {
      synopsisText = $('meta[name="description"]').attr('content')?.trim() || "";
    }

    // Capa extraída da tag meta OG ou da estrutura principal de imagem limpa
    const thumbnail = $('meta[property="og:image"]').attr('content') || $(".bookside-img img").first().attr("src") || null;

    return {
      id: idManga,
      title: title, // Adicionado se seu modelo aceitar, garante integridade
      description: synopsisText,
      status: status,
      year: yearClean || "Desconhecido",
      author: author || "Desconhecido",
      artist: artist || author || "Desconhecido",
      tags: genres,
      coverImage: thumbnail,
    };
  } catch (error) {
    console.error("Erro ao buscar detalhes Niadd:", error);
    return null;
  }
}

// 5. CHAPTER LIST
export async function GetMangaChapterListNiadd(idManga: string): Promise<MangaChapterModel[]> {
  const cleanId = idManga.endsWith(".html") ? idManga.substring(0, idManga.lastIndexOf(".")) : idManga;
  const url = cleanId.startsWith("http") ? `${cleanId}/chapters.html` : `${BASE_URL}${cleanId}/chapters.html`;

  try {
    const response = await fetchWithNativeGet(url, HEADERS);
    if (response.status !== 200 || !response.body) return [];

    const $ = cheerio.load(response.body);
    const newChapterList: MangaChapterModel[] = [];

    let titlePage = $('h1[itemprop="name"]').text().trim(); 
    titlePage = titlePage.replace(/Manga/i, "").trim();

    // 🎯 SELETOR CIRÚRGICO: Mira diretamente na classe correta extraída do seu HTML
    $(".chp-item").each((index, element) => {
      // Sobe para o link pai para pegar a URL e o Title estrutural
      const anchorParent = $(element).closest("a");
      let rawUrl = anchorParent.attr("href") || "";
      if (!rawUrl) return;

      if (!rawUrl.startsWith("http")) {
        rawUrl = `${BASE_URL}${rawUrl}`;
      }

      // Captura o texto das novas classes internas corretas do seu dump
      const rawName = $(element).find(".chp-title").text().trim();
      const dateText = $(element).find(".chp-time").text().trim();

      if (!rawName) return;

      // REGEX: Captura perfeitamente o número decimal ou inteiro isolado no final da string
      const chapterMatch = rawName.match(/(\d+(\.\d+)?)$/);
      const chapterNumber = chapterMatch ? parseFloat(chapterMatch[1]) : null;

      // Limpeza do título removendo o número final e o nome redundante do mangá
      let auxiName = rawName.replace(/\s\d+(\.\d+)?$/, "").trim();
      
      if (titlePage) {
        auxiName = auxiName.replace(new RegExp(titlePage, "gi"), "").trim();
      }

      auxiName = auxiName.replace(/^[\s\-\/\|]+|[\s\-\/\|]+$/g, "").trim();

      const chapterData = {
        id: rawUrl,
        volume: null,
        chapter: String(chapterNumber),
        title: auxiName || `Capítulo ${chapterNumber}`,
        date: dateText || null,
        scanName: null,
      };

      // // 🔍 SEU CONSOLE.LOG IDENTADO E LIMPO (Sem repetições)
      // console.log(`\n--- [Capítulo #${index + 1}] ---`);
      // console.log(`ID (URL):    ${chapterData.id}`);
      // console.log(`Volume:      ${chapterData.volume}`);
      // console.log(`Chapter:     ${chapterData.chapter} (Tipo: ${typeof chapterData.chapter})`);
      // console.log(`Title:       "${chapterData.title}"`);
      // console.log(`Date:        ${chapterData.date ? `"${chapterData.date}"` : 'null'}`);
      // console.log(`Scan Name:   ${chapterData.scanName}`);
      // console.log(`-------------------------\n`);

      newChapterList.push(chapterData);
    });

    // Remove duplicados por ID por garantia
    const uniqueChapters = newChapterList.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);

    // Ordena do maior capítulo para o menor
    return uniqueChapters.sort((a, b) => {
      const chapterA = parseFloat(String(a.chapter || ""));
      const chapterB = parseFloat(String(b.chapter || ""));

      if (isNaN(chapterA)) return 1;
      if (isNaN(chapterB)) return -1;

      return chapterB - chapterA;
    });
  } catch (error) {
    console.error("Erro ao buscar lista de capítulos Niadd:", error);
    return [];
  }
}

// 6. PAGE LIST (O Extrator Inteligente de Imagens)
export async function GetPagesListNiadd(idChap: string): Promise<MangaPage[]> {
  const url = idChap.startsWith("http") ? idChap : `${BASE_URL}${idChap}`;
  
  try {
    const response = await fetchWithNativeGet(url, HEADERS);
    if (response.status !== 200 || !response.body) return [];

    const html = response.body;
    const pages: MangaPage[] = [];

    // Estratégia 1: Tenta ler o Array Javascript 'all_imgs_url' injetado na página (MUITO mais rápido)
    if (html.includes("all_imgs_url")) {
      const match = ALL_IMGS_URL_REGEX.exec(html);
      if (match) {
        const content = match[1];
        const urls = content
          .split(",")
          .map(u => u.replace(CLEAN_IMG_URL_REGEX, ""))
          .filter(u => u.startsWith("http"));

        urls.forEach((imgUrl) => {
          // Forçamos o cast com 'as any' para bater com a interface esperada do MangaPage se necessário
          pages.push(imgUrl as any); 
        });

        if (pages.length > 0) return pages;
      }
    }

    // Estratégia 2: Se não houver o Array, varre o HTML normal
    const $ = cheerio.load(html);
    
    $("div.pic_box img, div.reading-content img").each((_, img) => {
      const imgUrl = $(img).attr("src");
      // CORREÇÃO: Alterado .contains() para .includes() que é o padrão do JavaScript
      if (imgUrl && !imgUrl.includes("cover") && !imgUrl.includes("logo")) {
        pages.push(imgUrl as any);
      }
    });

    // Estratégia 3: Varre sub-páginas via paginação sequencial (<select> do site)
    const otherSubPages: string[] = $("select.sl-page option")
      .map((_, el) => $(el).attr("value"))
      .get()
      .filter(path => path && !url.includes(path));

    if (otherSubPages.length > 0) {
      for (const subPath of otherSubPages) {
        const subUrl = subPath.startsWith("http") ? subPath : `${BASE_URL}${subPath}`;
        
        try {
          // RATE LIMIT IMPLÍCITO: Evita banimentos ao paginar sequencialmente
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const subRes = await fetchWithNativeGet(subUrl, HEADERS);
          if (subRes.status === 200 && subRes.body) {
            const subDoc = cheerio.load(subRes.body);
            subDoc("div.pic_box img, div.reading-content img").each((_, img) => {
              const imgUrl = subDoc(img).attr("src");
              // CORREÇÃO: Alterado .contains() para .includes() e consertado a validação no array pages
              if (imgUrl && !imgUrl.includes("cover") && !pages.includes(imgUrl as any)) {
                pages.push(imgUrl as any);
              }
            });
          }
        } catch (_) {}
      }
    }

    return pages;
  } catch (error) {
    console.error("Erro ao buscar páginas Niadd:", error);
    return [];
  }
}

// 7. GET PAGES LIST PREV CHAPTER NIADD
export const GetPagesListPrevChapterNiadd = async (
  idChap: string,
  idManga: string
): Promise<NextPrevMangaPage | null> => {
  try {
    const responseListChapters = await GetMangaChapterListNiadd(idManga);

    if (!responseListChapters || responseListChapters.length === 0) {
      return null;
    }

    const currentIndex = responseListChapters.findIndex(
      (item) => item.id === idChap
    );

    // Se não encontrou o capítulo atual na lista, aborta
    if (currentIndex === -1) return null;

    // Como a lista está ordenada de forma decrescente, o capítulo ANTERIOR está no index + 1
    const prevChapter = responseListChapters[currentIndex + 1];

    if (!prevChapter) {
      console.warn("Nenhum capítulo anterior encontrado.");
      return null;
    }
    
    const response = await GetPagesListNiadd(prevChapter.id);

    if (response && response.length > 0) {
      return {
        list: response,
        id: prevChapter.id,
        title: prevChapter.title,
        chapterNumber: prevChapter.chapter,
      };
    }

    return null;
  } catch (error) {
    console.error("Erro ao buscar páginas do capítulo anterior:", idChap, error);
    return null;
  }
};

// 8. GET PAGES LIST NEXT CHAPTER NIADD
export const GetPagesListNextChapterNiadd = async (
  idChap: string,
  idManga: string
): Promise<NextPrevMangaPage | null> => {
  try {
    const responseListChapters = await GetMangaChapterListNiadd(idManga);

    if (!responseListChapters || responseListChapters.length === 0) {
      return null;
    }

    const currentIndex = responseListChapters.findIndex(
      (item) => item.id === idChap
    );

    // Se não encontrou o capítulo atual na lista, aborta
    if (currentIndex === -1) return null;

    // Como a lista está ordenada de forma decrescente, o PRÓXIMO capítulo está no index - 1
    const nextChapter = responseListChapters[currentIndex - 1];

    if (!nextChapter) {
      console.warn("Nenhum próximo capítulo encontrado.");
      return null;
    }

    const response = await GetPagesListNiadd(nextChapter.id);

    if (response && response.length > 0) {
      return {
        list: response,
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