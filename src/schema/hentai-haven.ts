import { z } from "zod";

const GenreSchema = z.object({
  id: z.string(),
  url: z.string(),
  name: z.string(),
});

const HentaiEpisodeSchema = z.object({
  id: z.string(),
  title: z.string(),
  thumbnail: z.string().nullable(),
  number: z.number(),
  releasedUTC: z.string(),
  releasedRelative: z.string(),
});

const HentaiInfoSchema = z.object({
  id: z.string(),
  title: z.string(),
  cover: z.string(),
  summary: z.string(),
  views: z.number(),
  ratingCount: z.number(),
  released: z.number(),
  genres: z.array(GenreSchema),
  totalEpisodes: z.number(),
  episodes: z.array(HentaiEpisodeSchema),
});

const HentaiSourceSchema = z.object({
  label: z.string(),
  src: z.string(),
  type: z.string(),
});

const HentaiSearchResultSchema = z.array(z.object({
    id: z.string(),
    title: z.string(),
    cover: z.string(),
    rating: z.number(),
    released: z.number(),
    genres: z.array(GenreSchema),
    totalEpisodes: z.number(),
    date: z.object({
      unparsed: z.string(),
      parsed: z.string(),
    }),
    alternative: z.string(),
    author: z.string(),
  }));

export { GenreSchema, HentaiEpisodeSchema, HentaiInfoSchema, HentaiSourceSchema, HentaiSearchResultSchema };