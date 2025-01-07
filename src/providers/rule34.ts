import { load } from "cheerio";
import type { R34SearchResult, SearchResult } from "../types/r34";
import { Dimension } from "../helpers/dimension";

export class Rule34 {
    private baseUrl: string = "https://rule34.xxx";
    private apiUrl: string = 'https://ac.rule34.xxx';

    constructor(baseURL?: string) {
        if (baseURL) {
            if (baseURL.startsWith("http") || baseURL.startsWith("https")) {
                this.baseUrl = baseURL;
            } else {
                this.baseUrl = `http://${baseURL}`;
            }
        }
    }

    public async fetchSearchResult(query: string, page = 1, perPage = 42) {
        if (!query) query = "alisa_mikhailovna_kujou";

        const url = `${this.baseUrl}/index.php?page=post&s=list&tags=${query}&pid=${(page - 1) * perPage}`;

        const response = await fetch(url);
        const data = await response.text();

        const $ = load(data);

        const results: SearchResult[] = [];

        $('.image-list span').each((i, e) => {
            const $e = $(e);

            const id = $e.attr('id')?.replace('s', '');
            const image = $e.find('img').attr('src');
            const tags = $e.find('img').attr('alt')?.trim()?.split(' ').filter(tag => tag !== "");

            results.push({
                id: id!,
                image: image!,
                tags: tags!,
                type: 'preview' // Cause search are not upscaled
            });
        });

        const pagination = $('#paginator .pagination');
        const totalPages = parseInt(pagination.find('a:last').attr('href')?.split('pid=')[1] || "1", 10) / perPage + 1;
        const currentPage = page;
        const nextPage = currentPage < totalPages ? currentPage + 1 : null;
        const previousPage = currentPage > 1 ? currentPage - 1 : null;
        const hasNextPage = nextPage !== null;
        const next = nextPage !== null ? nextPage * perPage : 0;
        const previous = previousPage !== null ? previousPage * perPage : 0;

        return { total: totalPages * perPage, next: next, previous: previous, pages: totalPages, page: currentPage, hasNextPage, results } as R34SearchResult;
    }

    public async fetchSearchAutocomplete(query: string) {
        if (!query) query = "alisa";

        const url = `${this.apiUrl}/autocomplete.php?q=${query}`;

        const response = await fetch(url);
        const data = await response.json() as { label: string; value: string; type: string }[];

        return data.map((item) => ({
            completedQuery: item.value,
            label: item.label,
            type: item.type
        }));
    }

    public async fetchInfo(id: string) {
        const url = `${this.baseUrl}/index.php?page=post&s=view&id=${id}`;

        const resizeCookies = {
            'resize-notification': 1,
            'resize-original': 1
        };

        const [resizedResponse, nonResizedResponse] = await Promise.all([fetch(url), fetch(url, {
            headers: {
                cookie: Object.entries(resizeCookies).map(([key, value]) => `${key}=${value}`).join('; ')
            }
        })]);


        const [resized, original] = await Promise.all([resizedResponse.text(), nonResizedResponse.text()]);

        const $resized = load(resized);

        const resizedImageUrl = $resized('#image').attr('src');

        const $ = load(original);
        const fullImage = $('#image').attr('src');
        const tags = $('#image').attr('alt')?.trim()?.split(' ').filter(tag => tag !== "");

        const stats = $('#stats ul');

        const postedData = stats.find('li:nth-child(2)').text().trim();
        const createdAt = new Date(postedData.split("Posted: ")[1].split("by")[0]).getTime();
        const publishedBy = postedData.split("by")[1].trim();
        const size = stats.find("li:nth-child(3)").text().trim().split("Size: ")[1];
        const rating = stats.find("li:contains('Rating:')").text().trim().split("Rating: ")[1];
        const dimension = Dimension.fromString(size);
        const comments = $('#comment-list div').map((i, el) => {
            const $el = $(el);
            const id = $el.attr('id')?.replace('c', '');
            const user = $el.find('.col1').text().trim().split("\n")[0];
            const comment = $el.find('.col2').text().trim();
            return {
                id,
                user,
                comment,
            }
        }).get().filter(Boolean).filter((comment) => comment.comment !== '');

        return {
            id,
            fullImage,
            resizedImageUrl,
            tags,
            createdAt,
            publishedBy,
            rating,
            sizes: {
                aspect: dimension?.getAspectRatio(),
                width: dimension?.getWidthInPx(),
                height: dimension?.getHeightInPx(),
                widthRem: dimension?.getWidthInRem(),
                heightRem: dimension?.getHeightInRem(),
                fullSize: dimension?.getWidthInPx()! * dimension?.getHeightInPx()!,
                formatted: `${dimension?.getWidthInPx()}x${dimension?.getHeightInPx()}`
            },
            comments
        }
    }
}
