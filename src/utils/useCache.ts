import { useCallback } from "react";
import { cache } from "./cache";

export function useCache() {
  // Clear the entire cache
  const clearCache = useCallback(() => {
    cache.clear();
  }, []);

  // Clear cache entries with a specific prefix
  const clearCacheWithPrefix = useCallback((prefix: string) => {
    cache.clearWithPrefix(prefix);
  }, []);

  // Clear all post-related caches
  const clearPostsCache = useCallback(() => {
    cache.clearWithPrefix("posts:");
  }, []);

  // Clear all comment-related caches
  const clearCommentsCache = useCallback(() => {
    cache.clearWithPrefix("comments:");
  }, []);

  // Clear comments for a specific post
  const clearPostCommentsCache = useCallback((postId: string) => {
    cache.delete(`comments:post:${postId}`);
  }, []);

  return {
    clearCache,
    clearCacheWithPrefix,
    clearPostsCache,
    clearCommentsCache,
    clearPostCommentsCache,
  };
}
