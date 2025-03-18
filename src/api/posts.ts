import { Post, PostFormData } from "../types";
import { nanoid } from "nanoid";
import { API_CONFIG } from "./config";
import { cache } from "../utils/cache";

// Cache keys
const CACHE_KEYS = {
  ALL_POSTS: "posts:all",
  POST_BY_ID: (id: string) => `posts:id:${id}`,
  POST_BY_SLUG: (slug: string) => `posts:slug:${slug}`,
};

// Get all posts
export const getPosts = async (): Promise<Post[]> => {
  // Check cache first
  const cachedPosts = cache.get<Post[]>(CACHE_KEYS.ALL_POSTS);
  if (cachedPosts) {
    return cachedPosts;
  }

  try {
    const response = await fetch(`${API_CONFIG.baseUrl}/posts`);
    if (!response.ok) {
      throw new Error(`Error fetching posts: ${response.statusText}`);
    }
    const posts = await response.json();

    // Store in cache
    cache.set(CACHE_KEYS.ALL_POSTS, posts);

    return posts;
  } catch (error) {
    console.error("Error getting posts:", error);
    return [];
  }
};

// Get a single post by ID
export const getPostById = async (id: string): Promise<Post | null> => {
  // Check cache first
  const cacheKey = CACHE_KEYS.POST_BY_ID(id);
  const cachedPost = cache.get<Post>(cacheKey);
  if (cachedPost) {
    return cachedPost;
  }

  try {
    const response = await fetch(`${API_CONFIG.baseUrl}/posts/${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Error fetching post: ${response.statusText}`);
    }
    const post = await response.json();

    // Store in cache
    cache.set(cacheKey, post);

    return post;
  } catch (error) {
    console.error("Error getting post by ID:", error);
    return null;
  }
};

// Get a single post by slug
export const getPostBySlug = async (slug: string): Promise<Post | null> => {
  // Check cache first
  const cacheKey = CACHE_KEYS.POST_BY_SLUG(slug);
  const cachedPost = cache.get<Post>(cacheKey);
  if (cachedPost) {
    return cachedPost;
  }

  try {
    const response = await fetch(`${API_CONFIG.baseUrl}/posts/slug/${slug}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Error fetching post: ${response.statusText}`);
    }
    const post = await response.json();

    // Store in cache
    cache.set(cacheKey, post);

    return post;
  } catch (error) {
    console.error("Error getting post by slug:", error);
    return null;
  }
};

// Create a new post
export const createPost = async (
  postData: PostFormData,
  author: any
): Promise<Post> => {
  try {
    // Generate ID if not provided
    const postWithId = {
      ...postData,
      id: postData.id || nanoid(),
    };

    const response = await fetch(`${API_CONFIG.baseUrl}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        post: postWithId,
        author: author,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error creating post: ${response.statusText}`);
    }

    const newPost = await response.json();

    // Invalidate cache for all posts
    cache.delete(CACHE_KEYS.ALL_POSTS);

    return newPost;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

// Update an existing post
export const updatePost = async (
  id: string,
  postData: Partial<PostFormData>
): Promise<Post | null> => {
  try {
    const response = await fetch(`${API_CONFIG.baseUrl}/posts/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Error updating post: ${response.statusText}`);
    }

    const updatedPost = await response.json();

    // Invalidate related caches
    cache.delete(CACHE_KEYS.ALL_POSTS);
    cache.delete(CACHE_KEYS.POST_BY_ID(id));
    if (updatedPost.slug) {
      cache.delete(CACHE_KEYS.POST_BY_SLUG(updatedPost.slug));
    }

    return updatedPost;
  } catch (error) {
    console.error("Error updating post:", error);
    return null;
  }
};

// Delete a post
export const deletePost = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_CONFIG.baseUrl}/posts/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Error deleting post: ${response.statusText}`);
    }

    // Invalidate caches
    cache.delete(CACHE_KEYS.ALL_POSTS);
    cache.delete(CACHE_KEYS.POST_BY_ID(id));
    // We don't know the slug here, so we can't invalidate by slug
    // A better approach would be to fetch the post first to get the slug

    return true;
  } catch (error) {
    console.error("Error deleting post:", error);
    return false;
  }
};
