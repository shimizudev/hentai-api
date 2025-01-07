import { z } from "zod";

const SearchSchema = z.object({
    id: z.string(),
    image: z.string(),
    tags: z.array(z.string()),
    type: z.literal('preview')
});

const SearchResultSchema = z.object({
    results: z.array(SearchSchema),
    total: z.number(),
    page: z.number(),
    pages: z.number(),
    next: z.number(),
    previous: z.number(),
    hasNextPage: z.boolean(),
});

const CommentSchema = z.object({
    id: z.string(),
    user: z.string(),
    comment: z.string(),
});

const DimensionSchema = z.object({
    aspect: z.string(),
    width: z.number(),
    height: z.number(),
    widthRem: z.number(),
    heightRem: z.number(),
    fullSize: z.number(),
    formatted: z.string(),
});

const InfoSchema = z.object({
    id: z.string(),
    fullImage: z.string(),
    resizedImageUrl: z.string(),
    tags: z.array(z.string()),
    createdAt: z.number(),
    publishedBy: z.string(),
    rating: z.string(),
    sizes: DimensionSchema,
    comments: z.array(CommentSchema),
});

const SearchAutocompleteSchema = z.array(z.object({
    completedQuery: z.string(),
    label: z.string(),
    type: z.string(),
}));

export { SearchResultSchema, SearchSchema, CommentSchema, DimensionSchema, InfoSchema, SearchAutocompleteSchema };