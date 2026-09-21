interface MemoryEntry {
  value: string;
  expiresAt: number;
}

const memoryStore = new Map<string, MemoryEntry>();

export interface RedisClient {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, mode?: string, duration?: number): Promise<string>;
  del(key: string): Promise<number>;
}

class SafeMemoryRedis implements RedisClient {
  async get(key: string): Promise<string | null> {
    const entry = memoryStore.get(key);
    if (!entry) return null;
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      memoryStore.delete(key);
      return null;
    }
    return entry.value;
  }

  async set(key: string, value: string, mode?: string, duration?: number): Promise<string> {
    const expiresAt = mode === "EX" && duration ? Date.now() + duration * 1000 : Infinity;
    memoryStore.set(key, { value, expiresAt });
    return "OK";
  }

  async del(key: string): Promise<number> {
    return memoryStore.delete(key) ? 1 : 0;
  }
}

declare global {
  var _customRedis: any;
}

let redisInstance: RedisClient;

try {
  if (process.env.REDIS_URL) {
    const RedisConstructor = require("ioredis");
    if (!globalThis._customRedis) {
      globalThis._customRedis = new RedisConstructor(process.env.REDIS_URL);
    }
    redisInstance = globalThis._customRedis;
  } else {
    redisInstance = new SafeMemoryRedis();
  }
} catch {
  redisInstance = new SafeMemoryRedis();
}

export default redisInstance;
