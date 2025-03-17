import { Post, PostFormData } from "../types";
import { nanoid } from "nanoid";
import { API_CONFIG } from "./config";

// Get all posts
export const getPosts = async (): Promise<Post[]> => {
  try {
    const response = await fetch(`${API_CONFIG.baseUrl}/posts`);
    if (!response.ok) {
      throw new Error(`Error fetching posts: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error getting posts:", error);
    return [];
  }
};

// Get a single post by ID
export const getPostById = async (id: string): Promise<Post | null> => {
  try {
    const response = await fetch(`${API_CONFIG.baseUrl}/posts/${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Error fetching post: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error getting post by ID:", error);
    return null;
  }
};

// Get a single post by slug
export const getPostBySlug = async (slug: string): Promise<Post | null> => {
  try {
    const response = await fetch(`${API_CONFIG.baseUrl}/posts/slug/${slug}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Error fetching post: ${response.statusText}`);
    }
    return await response.json();
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

    return await response.json();
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

    return await response.json();
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

    return true;
  } catch (error) {
    console.error("Error deleting post:", error);
    return false;
  }
};
