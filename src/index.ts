import { Hono } from "hono";
import { HentaiHaven } from "./providers/hentai-haven";
import { Rule34 } from "./providers/rule34";
import { prettyJSON } from "hono/pretty-json";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import Redis from "ioredis";
import { MongoClient, Db, Collection } from "mongodb";
import type { Context } from "hono";
import { getConnInfo } from "hono/bun";
import { z } from 'zod';
import Hanime from "./providers/hanime";
import { SearchResultSchema, VideoSchema } from "./schema/hanime";
import { InfoSchema, SearchAutocompleteSchema } from "./schema/r34";
import { HentaiInfoSchema, HentaiSearchResultSchema, HentaiSourceSchema } from "./schema/hentai-haven";

const missingEnvVars = [];
if(!process.env.MONGODB_URL) missingEnvVars.push("MONGODB_URL");
if(!process.env.REDIS_HOST) missingEnvVars.push("REDIS_HOST");
if(!process.env.REDIS_PASSWORD) missingEnvVars.push("REDIS_PASSWORD");

if(missingEnvVars.length > 0) {
  console.error(`Missing environment variables: ${missingEnvVars.join(', ')}`);
  process.exit(1);
}

const redis = new Redis({
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD
});
const mongoClient = new MongoClient(process.env.MONGODB_URL!);
let db: Db;
let apiKeyCollection: Collection;

const connectToDb = async () => {
  await mongoClient.connect();
  db = mongoClient.db();
  apiKeyCollection = db.collection("apiKeys");
};

const app = new Hono();

app.use(cors());
app.use(prettyJSON());
app.use(logger());

app.get("/", (c) => {
  return c.text("Welcome to Hentai API!");
});

const rateLimit = async (c: Context, key: string, limit: number, ttl: number): Promise<Response | void> => {
  const count = await redis.incr(key);
  if (count > limit) {
    return c.json({ error: "Rate limit exceeded" }, 429);
  }
  await redis.expire(key, ttl);
};

const cache = async <T extends object>(c: Context, key: string, fetcher: () => Promise<T>): Promise<Response> => {
  const cached = await redis.get(key);
  if (cached) {
    try {
      const data = JSON.parse(cached) as T;
      if (data === null || data === undefined || Object.keys(data).length === 0 || (Array.isArray(data) && data.length === 0) || (typeof data === 'string' && (data as string).trim() === '')) {
        await redis.del(key);
        const freshData = await fetcher();
        await redis.set(key, JSON.stringify(freshData), 'EX', 3600);
        return c.json(freshData);
      }
      return c.json(data);
    } catch (error) {
      await redis.del(key);
      const freshData = await fetcher();
      await redis.set(key, JSON.stringify(freshData), 'EX', 3600);
      return c.json(freshData);
    }
  }
  const data = await fetcher();
  if (data === null || data === undefined || Object.keys(data).length === 0 || (Array.isArray(data) && data.length === 0) || (typeof data === 'string' && (data as string).trim() === '')) {
    return c.json(data);
  }
  await redis.set(key, JSON.stringify(data), 'EX', 3600);
  return c.json(data);
};

const apiKeyAuth = async (c: Context): Promise<Response | void> => {
  const apiKey = c.req.header("x-api-key")||c.req.query("apiKey");
  if (!apiKey) {
    return undefined;
  }
  const key = await apiKeyCollection.findOne({ key: apiKey });
  if (!key) {
    return c.json({ error: "Invalid API key" }, 401);
  }
  return undefined;
};

const handleRequest = async <T>(c: Context, provider: any, method: string, schema: z.ZodSchema<any>, ...args: any[]): Promise<Response> => {
  try {
    const apiKeyResult = await apiKeyAuth(c);
    const conninfo = await getConnInfo(c);
    const limit = apiKeyResult ? 1500 : 15;
    const ttl = 60;
    const rateLimitKey = `${provider.name}-${method}-${conninfo.remote.address}-${conninfo.remote.port}`;
    const rateLimited = await rateLimit(c, rateLimitKey, limit, ttl);
    if (rateLimited) return rateLimited;

    const key = `${provider.name}-${method}-${JSON.stringify(args)}`;
    return await cache(c, key, async () => {
      const instance = new provider();
      const result = await instance[method](...args);
      return schema.parse(result);
    });
  } catch (error) {
    console.error("Error handling request:", error);
    if (error instanceof z.ZodError) {
      return c.json({ error: error.issues }, 422);
    }
    return c.json({ error: "Internal server error" }, 500);
  }
};

const querySchema = z.string().min(1);
const idSchema = z.string().min(1);

app.get("/api/hh/search/:query", async (c) => {
  const query = querySchema.parse(c.req.param("query"));
  return await handleRequest(c, HentaiHaven, "fetchSearchResult", HentaiSearchResultSchema, query);
});

app.get("/api/hh/:id", async (c) => {
  const id = idSchema.parse(c.req.param("id"));
  return await handleRequest(c, HentaiHaven, "fetchInfo", HentaiInfoSchema, id);
});

app.get("/api/hh/sources/:id", async (c) => {
  const id = idSchema.parse(c.req.param("id"));
  return await handleRequest(c, HentaiHaven, "fetchSources", HentaiSourceSchema, id);
});

app.get("/api/r34/autocomplete/:query", async (c) => {
  const query = querySchema.parse(c.req.param("query"));
  console.log(query)
  return await handleRequest(c, Rule34, "fetchSearchAutocomplete", SearchAutocompleteSchema, query);
});

app.get("/api/r34/search/:query", async (c) => {
  const query = querySchema.parse(c.req.param("query"));
  return await handleRequest(c, Rule34, "fetchSearchResult", SearchResultSchema, query);
});

app.get("/api/r34/:id", async (c) => {
  const id = idSchema.parse(c.req.param("id"));
  return await handleRequest(c, Rule34, "fetchInfo", InfoSchema, id);
});

app.get("/api/hanime/search/:query", async (c) => {
    const query = querySchema.parse(c.req.param("query"));

    return await handleRequest(c, Hanime, "search", SearchResultSchema, query);
});

app.get("/api/hanime/:id", async (c) => {
    const id = idSchema.parse(c.req.param("id"));
    return await handleRequest(c, Hanime, "getInfo", VideoSchema, id);
});

app.get("/api/hanime/streams/:id", async (c) => {
    const id = idSchema.parse(c.req.param("id"));
    return await handleRequest(c, Hanime, "getEpisode", z.any(), id);
});

const port = process.env.PORT || 3000;

export default {
  fetch: app.fetch,
  port: port,
};

connectToDb();