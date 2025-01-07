export interface PaginatedResult<T> {
    results: T[];
    total: number;
    page: number;
    pages: number;
    next: number;
    previous: number;
    hasNextPage: boolean;
}

export interface SearchResult {
    id: string;
    image: string;
    tags: string[];
    type: 'preview'
}

export type R34SearchResult = PaginatedResult<SearchResult>;