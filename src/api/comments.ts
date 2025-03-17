import { Comment, CommentFormData } from "../types";
import { nanoid } from "nanoid";
import { getPostById } from "./posts";

// This is a mock implementation - replace with actual Neon database implementation
// We'll use the posts localStorage from posts.ts since comments are stored within posts

const POSTS_STORAGE_KEY = "blog_posts";

// Helper to get posts from localStorage
const getPosts = () => {
  return JSON.parse(localStorage.getItem(POSTS_STORAGE_KEY) || "[]");
};

// Helper to save posts to localStorage
const savePosts = (posts: any[]) => {
  localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));
};

// Get comments for a post
export const getComments = async (postId: string): Promise<Comment[]> => {
  const post = await getPostById(postId);
  return post?.comments || [];
};

// Add a comment to a post
export const addComment = async (
  postId: string,
  commentData: CommentFormData,
  author: any
): Promise<Comment | null> => {
  const posts = getPosts();
  const postIndex = posts.findIndex((post: any) => post.id === postId);

  if (postIndex === -1) return null;

  const newComment: Comment = {
    id: nanoid(),
    content: commentData.content,
    createdAt: new Date().toISOString(),
    author,
    postId,
  };

  posts[postIndex].comments.push(newComment);
  savePosts(posts);

  return newComment;
};

// Delete a comment
export const deleteComment = async (
  postId: string,
  commentId: string
): Promise<boolean> => {
  const posts = getPosts();
  const postIndex = posts.findIndex((post: any) => post.id === postId);

  if (postIndex === -1) return false;

  const commentIndex = posts[postIndex].comments.findIndex(
    (comment: any) => comment.id === commentId
  );

  if (commentIndex === -1) return false;

  posts[postIndex].comments.splice(commentIndex, 1);
  savePosts(posts);

  return true;
};
