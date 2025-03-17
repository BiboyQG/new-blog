import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { addComment } from "../api/comments";

interface CommentFormProps {
  postId: string;
  onCommentAdded: () => void;
}

export default function CommentForm({
  postId,
  onCommentAdded,
}: CommentFormProps) {
  const { user, isAuthenticated, login } = useAuth();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated || !user) {
      login();
      return;
    }

    if (!content.trim()) return;

    setIsSubmitting(true);

    try {
      await addComment(postId, { content }, user);
      setContent("");
      onCommentAdded();
    } catch (error) {
      console.error("Failed to add comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <div className="mb-4">
        <label
          htmlFor="comment"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Leave a comment
        </label>
        <textarea
          id="comment"
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          placeholder={
            isAuthenticated ? "Write your comment here..." : "Login to comment"
          }
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={!isAuthenticated || isSubmitting}
        ></textarea>
      </div>

      {isAuthenticated ? (
        <button
          type="submit"
          disabled={isSubmitting || !content.trim()}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Submitting..." : "Post Comment"}
        </button>
      ) : (
        <button type="button" onClick={login} className="btn-primary">
          Login to Comment
        </button>
      )}
    </form>
  );
}
