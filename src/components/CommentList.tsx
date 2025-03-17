import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Comment } from "../types";
import { useAuth } from "../context/AuthContext";
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
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      setIsLoading(true);
      try {
        const fetchedComments = await getComments(postId);
        setComments(fetchedComments);
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [postId, refreshTrigger]);

  const handleDeleteComment = async (commentId: string) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await deleteComment(postId, commentId);
        setComments(comments.filter((comment) => comment.id !== commentId));
      } catch (error) {
        console.error("Failed to delete comment:", error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="mt-8 text-center text-gray-600 dark:text-gray-400">
        Loading comments...
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="mt-8 text-center text-gray-600 dark:text-gray-400">
        No comments yet. Be the first to comment!
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
        Comments ({comments.length})
      </h3>

      <div className="space-y-6">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg"
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
                {format(new Date(comment.createdAt), "MMM d, yyyy 'at' h:mm a")}
              </span>
            </div>

            <p className="text-gray-700 dark:text-gray-300">
              {comment.content}
            </p>

            {(user?.isAdmin || user?.id === comment.author.id) && (
              <div className="mt-2 flex justify-end">
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
