interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
}

class Cache {
  private storage: Map<string, CacheItem<any>> = new Map();
  private defaultTTL: number = 5 * 60 * 1000; // 5 minutes by default

  // Set an item in the cache
  set<T>(key: string, data: T, options: CacheOptions = {}): void {
    const now = Date.now();
    const ttl = options.ttl || this.defaultTTL;

    this.storage.set(key, {
      data,
      timestamp: now,
      expiresAt: now + ttl,
    });
  }

  // Get an item from the cache
  get<T>(key: string): T | null {
    const item = this.storage.get(key);

    // Return null if item doesn't exist
    if (!item) return null;

    // Return null if item has expired
    if (Date.now() > item.expiresAt) {
      this.delete(key);
      return null;
    }

    return item.data;
  }

  // Delete an item from the cache
  delete(key: string): void {
    this.storage.delete(key);
  }

  // Clear items with a specific prefix
  clearWithPrefix(prefix: string): void {
    for (const key of this.storage.keys()) {
      if (key.startsWith(prefix)) {
        this.storage.delete(key);
      }
    }
  }

  // Clear all items from the cache
  clear(): void {
    this.storage.clear();
  }
}

// Create a singleton instance
export const cache = new Cache();
