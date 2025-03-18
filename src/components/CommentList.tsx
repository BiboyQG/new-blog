import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Comment } from "../types";
import { useAuth } from "../context/AuthContext";
import { useCache } from "../utils/useCache";
import { getComments, deleteComment } from "../api/comments";

interface CommentListProps {
  postId: string;
  refreshTrigger: number;
}

export default function CommentList({
  postId,
  refreshTrigger,
}: CommentListProps) {
  const { user } = useAuth();
  const { clearPostCommentsCache } = useCache();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      setIsLoading(true);
      try {
        const fetchedComments = await getComments(postId);
        setComments(fetchedComments || []);
      } catch (error) {
        console.error("Failed to fetch comments:", error);
        setComments([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [postId, refreshTrigger]);

  const handleDeleteComment = async (commentId: string) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        const success = await deleteComment(commentId);
        if (success) {
          // Update the local state
          setComments(comments.filter((comment) => comment.id !== commentId));
          // Clear the cache for this post's comments
          clearPostCommentsCache(postId);
        }
      } catch (error) {
        console.error("Failed to delete comment:", error);
      }
    }
  };

  // Function to refresh comments (bypassing cache)
  const refreshComments = async () => {
    clearPostCommentsCache(postId);
    setIsLoading(true);
    try {
      const fetchedComments = await getComments(postId);
      setComments(fetchedComments || []);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
      setComments([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mt-8 text-center text-gray-600 dark:text-gray-400">
        Loading comments...
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Comments ({comments.length})
        </h3>

        <button
          onClick={refreshComments}
          className="text-sm text-blue-600 bg-gray-100 dark:bg-gray-900 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Refresh
        </button>
      </div>

      {comments.length === 0 ? (
        <div className="text-center text-gray-600 dark:text-gray-400">
          No comments yet. Be the first to comment!
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-gray-50 dark:bg-[rgb(26,28,28)] p-4 rounded-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <img
                    src={comment.author.picture}
                    alt={comment.author.name}
                    className="h-8 w-8 rounded-full"
                  />
                  <span className="font-medium text-gray-900 dark:text-white">
                    {comment.author.name}
                  </span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {format(
                    new Date(comment.createdAt),
                    "MMM d, yyyy 'at' h:mm a"
                  )}
                </span>
              </div>

              <p className="text-gray-700 dark:text-gray-300">
                {comment.content}
              </p>

              {user?.isAdmin && (
                <div className="mt-2 flex justify-end">
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:bg-[rgb(26,28,28)] dark:hover:text-red-300 dark:hover:bg-[rgb(55,24,24)]"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
