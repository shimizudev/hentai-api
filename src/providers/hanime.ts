import { load } from "cheerio";
import type { SearchResult, VideosManifest } from "../types/hanime";
import type { HanimeResponse, RawSearchResult } from "../types/hanime";
import type { PaginatedResult } from "../types/r34";

export default class Hanime {
  private readonly BASE_URL = "https://hanime.tv";
  private readonly SEARCH_URL = "https://search.htv-services.com";

  public async getRecent(page = 1, perPage = 10): Promise<PaginatedResult<SearchResult>> {
    const response = await fetch(this.SEARCH_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        blacklist: [],
        brands: [],
        order_by: "created_at_unix",
        page: page - 1,
        tags: [],
        search_text: "",
        tags_mode: "AND",
      }),
    });

    const data = (await response.json()) as {
      page: number;
      nbPages: number;
      nbHits: number;
      hitsPerPage: number;
      hits: string;
    };

    const allResults = (JSON.parse(data.hits) as RawSearchResult[]).map(mapToSearchResult);
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const results = allResults.slice(startIndex, endIndex);


    return {
      pages: Math.ceil(data.nbHits / perPage),
      total: data.nbHits,
      previous: page - 1,
      next: page + 1,
      hasNextPage: page < Math.ceil(data.nbHits / perPage),
     page,
      results: results,
    };
  }

  public async search(query: string, page = 1, perPage = 10): Promise<PaginatedResult<SearchResult>> {
    const response = await fetch(this.SEARCH_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        blacklist: [],
        brands: [],
        order_by: "created_at_unix",
        page: page - 1,
        tags: [],
        search_text: query,
        tags_mode: "AND",
      }),
    });
    const data = (await response.json()) as {
      page: number;
      nbPages: number;
      nbHits: number;
      hitsPerPage: number;
      hits: string;
    };

    const allResults = (JSON.parse(data.hits) as RawSearchResult[]).map(mapToSearchResult);
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const results = allResults.slice(startIndex, endIndex);

    return {
      pages: Math.ceil(data.nbHits / perPage),
      total: data.nbHits,
      previous: page - 1,
      next: page + 1,
      hasNextPage: page < Math.ceil(data.nbHits / perPage),
      page,
      results: results,
    };
  }

  public async getInfo(slug: string) {
    const path = `/videos/hentai/${slug}`;
    const url = `${this.BASE_URL}${path}`;

    const response = await fetch(url);
    const html = await response.text();

    const $ = load(html);

    const script = $('script:contains("window.__NUXT__")');
    console.log(script.html());
    const json = JSON.parse((script.html()?.replace("window.__NUXT__=", "").replaceAll(";", '')!)) as HanimeResponse;

    const videoData = json.state.data.video;
    
    return {
       title: json.state.data.video.hentai_franchise.name,
       slug: json.state.data.video.hentai_franchise.slug,
       id: videoData.hentai_video.id,
       description: videoData.hentai_video.description,
       views: videoData.hentai_video.views,
       interests: videoData.hentai_video.interests,
       posterUrl: videoData.hentai_video.poster_url,
       coverUrl: videoData.hentai_video.cover_url,
       brand: {
         name: videoData.hentai_video.brand,
         id: videoData.hentai_video.brand_id,
       },
       durationMs: videoData.hentai_video.duration_in_ms,
       isCensored: videoData.hentai_video.is_censored,
       likes: videoData.hentai_video.likes,
       rating: videoData.hentai_video.rating,
       dislikes: videoData.hentai_video.dislikes,
       downloads: videoData.hentai_video.downloads,
       rankMonthly: videoData.hentai_video.monthly_rank,
       tags: videoData.hentai_tags,
       createdAt: videoData.hentai_video.created_at,
       releasedAt: videoData.hentai_video.released_at,
       episodes: {
         next: mapToEpisode(videoData.next_hentai_video),
         all: json.state.data.video.hentai_franchise_hentai_videos.map(mapToEpisode),
         random: mapToEpisode(videoData.next_random_hentai_video),
       }
    }
  }

  public async getEpisode(slug: string) {
    const apiUrl = `https://hanime.tv/rapi/v7/videos_manifests/${slug}`;
    const signature = Array.from({ length: 32 }, () => 
        Math.floor(Math.random() * 16).toString(16)).join('');

    const response = await fetch(apiUrl, {
        headers: {
            'x-signature': signature,
            'x-time': Math.floor(Date.now() / 1000).toString(),
            'x-signature-version': 'web2',
        }
    });

    const json = (await response.json() as { videos_manifest: VideosManifest });

    const data = json.videos_manifest;
    const videos = data.servers.map(server => server.streams).flat();

    const streams = videos.map((video) => ({
        id: video.id,
        serverId: video.server_id,
        kind: video.kind,
        extension: video.extension,
        mimeType: video.mime_type,
        width: video.width,
        height: video.height,
        durationInMs: video.duration_in_ms,
        filesizeMbs: video.filesize_mbs,
        filename: video.filename,
        url: video.url,
    })).filter(video => video.url && video.url !== '' && video.kind !== 'premium_alert');

    return streams;
}

  private todo(method: string) {
    class TodoError extends Error {
      constructor(message: string) {
        super(message);
        this.name = "TodoError";
      }
    }

    throw new TodoError(`TODO: Implement ${method} in ${this.constructor.name}. The method ${method} is not implemented yet.`);
  }
}

function mapToSearchResult(raw: RawSearchResult): SearchResult {
  return {
    id: raw.id,
    name: raw.name,
    titles: raw.titles,
    slug: raw.slug,
    description: raw.description,
    views: raw.views,
    interests: raw.interests,
    bannerImage: raw.poster_url,
    coverImage: raw.cover_url,
    brand: {
      name: raw.brand,
      id: raw.brand_id,
    },
    durationMs: raw.duration_in_ms,
    isCensored: raw.is_censored,
    likes: raw.likes,
    rating: raw.rating,
    dislikes: raw.dislikes,
    downloads: raw.downloads,
    rankMonthly: raw.monthly_rank,
    tags: raw.tags,
    createdAt: raw.created_at,
    releasedAt: raw.released_at,
  };
}

function mapToEpisode(raw: { id: number; name: string; slug: string; created_at: string; released_at: string; views: number; interests: number; poster_url: string; cover_url: string; is_hard_subtitled: boolean; brand: string; duration_in_ms: number; is_censored: boolean; rating: number; likes: number; dislikes: number; downloads: number; monthly_rank: number; brand_id: string; is_banned_in: string; preview_url: null; primary_color: null; created_at_unix: number; released_at_unix: number;}) {
  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    views: raw.views,
    interests: raw.interests,
    thumbnailUrl: raw.poster_url,
    coverUrl: raw.cover_url,
    isHardSubtitled: raw.is_hard_subtitled,
    brand: {
      name: raw.brand,
      id: raw.brand_id,
    },
    durationMs: raw.duration_in_ms,
    isCensored: raw.is_censored,
    likes: raw.likes,
    rating: raw.rating,
    dislikes: raw.dislikes,
    downloads: raw.downloads,
    rankMonthly: raw.monthly_rank,
    brandId: raw.brand_id,
    isBannedIn: raw.is_banned_in,
    previewUrl: raw.preview_url,
    color: raw.primary_color,
    createdAt: raw.created_at_unix,
    releasedAt: raw.released_at_unix,
  };
}
