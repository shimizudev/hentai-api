import { z } from "zod";

const BrandSchema = z.object({
  name: z.string(),
  id: z.union([z.number(), z.string()]),
});

const EpisodeSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  views: z.number(),
  interests: z.number(),
  thumbnailUrl: z.string(),
  coverUrl: z.string(),
  isHardSubtitled: z.boolean(),
  brand: BrandSchema,
  durationMs: z.number(),
  isCensored: z.boolean(),
  likes: z.number(),
  rating: z.number(),
  dislikes: z.number(),
  downloads: z.number(),
  rankMonthly: z.number(),
  brandId: z.string(),
  isBannedIn: z.string(),
  previewUrl: z.string().nullable(),
  color: z.string().nullable(),
  createdAt: z.number(),
  releasedAt: z.number(),
});

const VideoSchema = z.object({
  title: z.string(),
  slug: z.string(),
  id: z.number(),
  description: z.string().optional(),
  views: z.number(),
  interests: z.number(),
  posterUrl: z.string(),
  coverUrl: z.string(),
  brand: BrandSchema,
  durationMs: z.number(),
  isCensored: z.boolean(),
  likes: z.number(),
  rating: z.number(),
  dislikes: z.number(),
  downloads: z.number(),
  rankMonthly: z.number(),
  tags: z.array(z.object({ id: z.number(), text: z.string() })), // Adjust based on tag details.
  createdAt: z.string(),
  releasedAt: z.string(),
  episodes: z.object({
    next: EpisodeSchema.nullable(),
    all: z.array(EpisodeSchema),
    random: EpisodeSchema.nullable(),
  }),
});

const SearchResultSchema = z.object({
  id: z.number(),
  name: z.string(),
  titles: z.array(z.string()),
  slug: z.string(),
  description: z.string(),
  views: z.number(),
  interests: z.number(),
  bannerImage: z.string(),
  coverImage: z.string(),
  brand: BrandSchema,
  durationMs: z.number(),
  isCensored: z.boolean(),
  likes: z.number(),
  rating: z.number(),
  dislikes: z.number(),
  downloads: z.number(),
  rankMonthly: z.number(),
  tags: z.array(z.string()),
  createdAt: z.number(),
  releasedAt: z.number(),
});

export { BrandSchema, EpisodeSchema, VideoSchema, SearchResultSchema };
