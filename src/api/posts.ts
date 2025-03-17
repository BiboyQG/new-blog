import { Post, PostFormData } from "../types";
import { nanoid } from "nanoid";

// This is a mock implementation - replace with actual Neon database implementation
// We'll use localStorage for now as a placeholder

const POSTS_STORAGE_KEY = "blog_posts";

// Helper to initialize posts in localStorage if not present
const initializePostsStorage = () => {
  if (!localStorage.getItem(POSTS_STORAGE_KEY)) {
    localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify([]));
  }
};

// Get all posts
export const getPosts = async (): Promise<Post[]> => {
  initializePostsStorage();
  const posts = JSON.parse(localStorage.getItem(POSTS_STORAGE_KEY) || "[]");
  return posts;
};

// Get a single post by ID
export const getPostById = async (id: string): Promise<Post | null> => {
  const posts = await getPosts();
  return posts.find((post) => post.id === id) || null;
};

// Get a single post by slug
export const getPostBySlug = async (slug: string): Promise<Post | null> => {
  const posts = await getPosts();
  return posts.find((post) => post.slug === slug) || null;
};

// Create a new post
export const createPost = async (
  postData: PostFormData,
  author: any
): Promise<Post> => {
  const posts = await getPosts();

  const newPost: Post = {
    id: nanoid(),
    ...postData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author,
    comments: [],
    tags: postData.tags.map((tag) => ({ id: nanoid(), name: tag })),
  };

  localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify([...posts, newPost]));
  return newPost;
};

// Update an existing post
export const updatePost = async (
  id: string,
  postData: Partial<PostFormData>
): Promise<Post | null> => {
  const posts = await getPosts();
  const postIndex = posts.findIndex((post) => post.id === id);

  if (postIndex === -1) return null;

  const updatedPost = {
    ...posts[postIndex],
    ...postData,
    updatedAt: new Date().toISOString(),
    tags: postData.tags
      ? postData.tags.map((tag) => {
          const existingTag = posts[postIndex].tags.find((t) => t.name === tag);
          return existingTag || { id: nanoid(), name: tag };
        })
      : posts[postIndex].tags,
  };

  posts[postIndex] = updatedPost;
  localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));

  return updatedPost;
};

// Delete a post
export const deletePost = async (id: string): Promise<boolean> => {
  const posts = await getPosts();
  const filteredPosts = posts.filter((post) => post.id !== id);

  if (filteredPosts.length === posts.length) return false;

  localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(filteredPosts));
  return true;
};
