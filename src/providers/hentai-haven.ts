import { load } from "cheerio";
import { DateTime } from "luxon";
import CryptoHelper from "../helpers/crypto";

export function getNumberFromString(str: string): number | null {
  const numbers = str.match(/\d+/g);
  return numbers ? numbers.map((n) => Number(n))[0] : null;
}

export type EpisodesSort = "ASC" | "DESC";

export type Genre = {
  id: string;
  url: string;
  name: string;
};

export type HentaiEpisode = {
  id: string;
  title: string;
  thumbnail?: string;
  number: number;
  releasedUTC: DateTime;
  releasedRelative: string;
};

export type HentaiInfo = {
  id: string;
  title: string;
  cover: string;
  summary: string;
  views: number;
  ratingCount: number;
  released: number;
  genres: Genre[];
  totalEpisodes: number;
  episodes: HentaiEpisode[];
};

export type HentaiSource = {
  label: string;
  src: string;
  type: string;
};

export type HentaiSources = {
  sources: HentaiSource[];
  thumbnail?: string;
};

export type SearchResult = {
  id: string;
  title: string;
  cover: string;
  rating: number;
  released: number;
  genres: Genre[];
  totalEpisodes: number;
  date: {
    unparsed: string;
    parsed: DateTime;
  };
  alternative: string;
  author: string;
};

/**
 * Class representing the HentaiHaven provider.
 */
export class HentaiHaven {
  private baseUrl: string = "http://hentaihaven.xxx";

  /**
   * Create an instance of HentaiHaven.
   * @param {string} [baseURL] - Optional base URL for the HentaiHaven provider.
   */
  constructor(baseURL?: string, cors?: string) {
    if (baseURL) {
      if (baseURL.startsWith("http") || baseURL.startsWith("https")) {
        this.baseUrl = baseURL;
      } else {
        this.baseUrl = `http://${baseURL}`;
      }
    }

    if (cors) {
      if (cors.startsWith("http") || cors.startsWith("https")) {
        this.baseUrl = `${cors}/${this.baseUrl}`;
      } else {
        this.baseUrl = `http://${cors}/${this.baseUrl}`;
      }
    }
  }

  /**
   * Fetch search results based on a query string.
   * @param {string} query - The search query.
   * @returns {Promise<SearchResult[]>} The search results.
   */
  public async fetchSearchResult(query: string): Promise<SearchResult[]> {
    if (!query) query = "Hatsukoi Jikan";

    const url = `${this.baseUrl}/?s=${query}&post_type=wp-manga`;

    const response = await fetch(url);
    const data = await response.text();

    const $ = load(data);
    const results: SearchResult[] = [];

    $(".c-tabs-item__content").each((i, el) => {
      const cover = $(el).find(".c-image-hover img").attr("src")!;
      const id = $(el).find(".c-image-hover a").attr("href")?.split("/")[4]!;
      const title = $(el).find(".post-title h3").text().trim();
      const alternative = $(el)
        .find(".tab-summary .mg_alternative .summary-content")
        .text()
        .trim();
      const author = $(el)
        .find(".tab-summary .mg_author .summary-content")
        .text()
        .trim();
      const released = Number(
        $(el).find(".tab-summary .mg_release .summary-content").text().trim()
      );
      const totalEpisodes = getNumberFromString(
        $(el).find(".tab-meta .latest-chap .chapter").text().trim()
      )!;
      const dateString = $(el).find(".tab-meta .post-on").text().trim();
      const parsedDate = DateTime.fromFormat(dateString, "yyyy-MM-dd HH:mm:ss", {
        zone: 'utc'
      });

      const rating = Number(
        $(el).find(".tab-meta .rating .total_votes").text().trim()
      );

      const genres: Genre[] = [];

      $(".tab-summary .mg_genres .summary-content a").each((_, element) => {
        genres.push({
          id: $(element).attr("href")?.split("/")[4]!,
          url: $(element).attr("href")!,
          name: $(element).text().trim().replaceAll(",", ""),
        });
      });

      results.push({
        id,
        title,
        cover: cover.replaceAll(" ", "%20"),
        rating,
        released,
        genres,
        totalEpisodes,
        date: {
          unparsed: dateString,
          parsed: parsedDate,
        },
        alternative,
        author,
      });
    });

    return results;
  }

  /**
   * Fetch detailed information about a specific hentai by ID.
   * @param {string} id - The hentai ID.
   * @param {EpisodesSort} [episodesSort="ASC"] - Sorting order of episodes.
   * @returns {Promise<HentaiInfo>} The hentai information.
   * @throws Will throw an error if the ID is not provided or if data fetching fails.
   */
  public async fetchInfo(
    id: string,
    episodesSort: EpisodesSort = "ASC"
  ): Promise<HentaiInfo> {
    if (!id) throw new Error("Id is required");

    const url = `${this.baseUrl}/watch/${id}`;

    const response = await fetch(url);
    const data = await response.text();

    if (data === "" || !data) throw new Error("Error fetching data");

    const $ = load(data);

    if ($("body").text().includes("webpage has been blocked"))
      throw new Error(
        `The webpage is blocked. Consider using a CORS proxy. GET ${url}`
      );

    const title = $(".post-title h1").text().trim();
    const cover = $(".summary_image img").attr("src")!;
    const ratingCount = Number($('span[property="ratingCount"]').text().trim());
    const views = getNumberFromString(
      $(".post-content_item:nth-child(4) .summary-content").text()
    ) as number;
    const released = Number($(".post-status .summary-content a").text().trim());
    const summary = $(".description-summary p").text().trim();

    const genres: Genre[] = [];
    const episodes: HentaiEpisode[] = [];

    $(".genres-content a").each((i, el) => {
      genres.push({
        id: $(el).attr("href")?.split("/")[4]!,
        url: $(el).attr("href")!,
        name: $(el).text().trim(),
      });
    });

    const episodesLength = $("li.wp-manga-chapter").length;

    $("li.wp-manga-chapter").each((i, el) => {
      const thumbnail = $(el).find("img").attr("src");
      const id = `${$(el).find("a").attr("href")?.split("/")[4]}/${
        $(el).find("a").attr("href")?.split("/")[5]
      }`;
      const title = $(el).find("a").text().trim();
      const number = episodesLength - i;
      const released = $(el).find(".chapter-release-date").text().trim();
      const releasedUTC = DateTime.fromFormat(released, "MMMM dd, yyyy", {zone: 'utc'});

      episodes.push({
        // Episode id spoofing cause the API doesn't return the episode id, it returns a path.
        id: btoa(id),
        title,
        thumbnail,
        number,
        releasedUTC,
        releasedRelative: released,
      });
    });

    this.sortEpisodes(episodes, episodesSort);

    return {
      id,
      title,
      cover: cover ? cover.replaceAll(" ", "%20") : "",
      summary,
      views,
      ratingCount,
      released,
      genres,
      totalEpisodes: episodesLength,
      episodes,
    } as HentaiInfo;
  }

  /**
   * Fetch available video sources for a specific hentai by ID.
   * @param {string} [id] - The hentai ID, base64 encoded.
   * @returns {Promise<HentaiSources>} The available video sources and thumbnail.
   */
  public async fetchSources(id?: string): Promise<HentaiSources> {
    if (id?.includes("episode-"))
      throw new Error("The Episode ID must be encoded.");

    const pageUrl = `${this.baseUrl}/watch/${atob(id!)}`;

    const pageResponse = await fetch(pageUrl);
    const pageHtml = await pageResponse.text();

    const $page = load(pageHtml);
    const iframeSrc = $page(".player_logic_item > iframe").attr("src");

    const iframeResponse = await fetch(iframeSrc!);
    const iframeHtml = await iframeResponse.text();

    const $iframe = load(iframeHtml);
    const secureToken = $iframe('meta[name="x-secure-token"]')
      .attr("content")
      ?.replace("sha512-", "");


    const rotatedSha = CryptoHelper.rot13Cipher(secureToken!);

    const decryptedData = JSON.parse(
      atob(CryptoHelper.rot13Cipher(atob(CryptoHelper.rot13Cipher(atob(rotatedSha)))))
    ) as { en: string; iv: string; uri: string };

    const formData = new FormData();
    formData.append("action", "zarat_get_data_player_ajax");
    formData.append("a", decryptedData.en);
    formData.append("b", decryptedData.iv);

    const apiUrl = `${
      decryptedData.uri ||
      "https://hentaihaven.xxx/wp-content/plugins/player-logic/"
    }api.php`;
    const apiResponse = await (
      await fetch(apiUrl, {
        method: "POST",
        body: formData,
        mode: "cors",
        cache: "default",
      })
    ).json() as {
      status: boolean;
      data: {
        image: string | null;
        sources: HentaiSource[];
      };
      authorization: {
        token: string;
        expiration: number;
        ip: string;
      };
    };

    const sources = apiResponse.data.sources;
    const thumbnail = apiResponse.data.image;

    return {
      sources,
      thumbnail,
    } as HentaiSources;
  }

  /**
   * Sorts episodes based on the given sort order.
   * @param {HentaiEpisode[]} episodes - The list of episodes to sort.
   * @param {EpisodesSort} sortOrder - The sort order, either "ASC" or "DESC".
   * @private
   */
  private sortEpisodes(episodes: HentaiEpisode[], sortOrder: EpisodesSort) {
    episodes.sort((a, b) => {
      if (sortOrder === "ASC") {
        return a.number - b.number;
      } else {
        return b.number - a.number;
      }
    });
  }
}

