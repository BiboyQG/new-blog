import { Comment, CommentFormData } from "../types";
import { API_CONFIG } from "./config";
import { cache } from "../utils/cache";

// Cache keys
const CACHE_KEYS = {
  POST_COMMENTS: (postId: string) => `comments:post:${postId}`,
};

// Get comments for a post
export const getComments = async (postId: string): Promise<Comment[]> => {
  // Check cache first
  const cacheKey = CACHE_KEYS.POST_COMMENTS(postId);
  const cachedComments = cache.get<Comment[]>(cacheKey);
  if (cachedComments) {
    return cachedComments;
  }

  try {
    const response = await fetch(
      `${API_CONFIG.baseUrl}/comments/post/${postId}`
    );
    if (!response.ok) {
      throw new Error(`Error fetching comments: ${response.statusText}`);
    }
    const comments = await response.json();

    // Store in cache with a shorter TTL (2 minutes)
    cache.set(cacheKey, comments, { ttl: 2 * 60 * 1000 });

    return comments;
  } catch (error) {
    console.error("Error getting comments:", error);
    return [];
  }
};

// Add a comment to a post
export const addComment = async (
  postId: string,
  commentData: CommentFormData,
  author: any
): Promise<Comment | null> => {
  try {
    const response = await fetch(`${API_CONFIG.baseUrl}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postId,
        comment: commentData,
        author,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error adding comment: ${response.statusText}`);
    }

    const newComment = await response.json();

    // Invalidate the cache for this post's comments
    cache.delete(CACHE_KEYS.POST_COMMENTS(postId));

    return newComment;
  } catch (error) {
    console.error("Error adding comment:", error);
    return null;
  }
};

// Delete a comment
export const deleteComment = async (commentId: string): Promise<boolean> => {
  try {
    const response = await fetch(
      `${API_CONFIG.baseUrl}/comments/${commentId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error(`Error deleting comment: ${response.statusText}`);
    }

    // Since we don't know which post this comment belongs to,
    // we can't invalidate specific cache entries.
    // For a more sophisticated approach, we could either:
    // 1. Pass the postId as a parameter to this function
    // 2. Fetch the comment to get its postId before deleting
    // For now, we'll leave cache invalidation to happen on the next refresh

    return true;
  } catch (error) {
    console.error("Error deleting comment:", error);
    return false;
  }
};
