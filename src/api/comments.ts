import { Comment, CommentFormData } from "../types";
import { API_CONFIG } from "./config";

// Get comments for a post
export const getComments = async (postId: string): Promise<Comment[]> => {
  try {
    const response = await fetch(
      `${API_CONFIG.baseUrl}/comments/post/${postId}`
    );
    if (!response.ok) {
      throw new Error(`Error fetching comments: ${response.statusText}`);
    }
    return await response.json();
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

    return await response.json();
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

    return true;
  } catch (error) {
    console.error("Error deleting comment:", error);
    return false;
  }
};
