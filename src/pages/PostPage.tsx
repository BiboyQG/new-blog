import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { format } from "date-fns";
import { getPostBySlug, deletePost } from "../api/posts";
import { Post } from "../types";
import { useAuth } from "../context/AuthContext";
import { useCache } from "../utils/useCache";
import MarkdownDisplay from "../components/MarkdownDisplay";
import CommentList from "../components/CommentList";
import CommentForm from "../components/CommentForm";

export default function PostPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { clearPostCommentsCache } = useCache();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshComments, setRefreshComments] = useState(0);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;

      setIsLoading(true);
      try {
        const fetchedPost = await getPostBySlug(slug);
        setPost(fetchedPost);
      } catch (error) {
        console.error("Failed to fetch post:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  const handleDelete = async () => {
    if (!post) return;

    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePost(post.id);
        navigate("/");
      } catch (error) {
        console.error("Failed to delete post:", error);
      }
    }
  };

  const handleCommentAdded = () => {
    setRefreshComments((prev) => prev + 1);
    if (post) {
      clearPostCommentsCache(post.id);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-600 dark:text-gray-400">Loading post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Post Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The post you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/" className="btn-primary">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <article className="max-w-4xl mx-auto bg-white dark:bg-[rgb(46,46,51)] rounded-lg shadow-md overflow-hidden">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <img
                src={post.author.picture}
                alt={post.author.name}
                className="h-10 w-10 rounded-full"
              />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {post.author.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {format(new Date(post.createdAt), "MMMM d, yyyy")}
                </p>
              </div>
            </div>

            {user?.isAdmin && (
              <div className="flex space-x-2">
                <Link
                  to={`/admin/edit/${post.id}`}
                  className="btn-secondary text-sm"
                >
                  Edit
                </Link>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Delete
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags?.map((tag) => (
              <span
                key={tag.id}
                className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full px-3 py-1 text-sm"
              >
                {tag.name}
              </span>
            ))}
          </div>

          <div className="mb-8">
            <MarkdownDisplay content={post.content} />
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
            <CommentList postId={post.id} refreshTrigger={refreshComments} />
            <CommentForm postId={post.id} onCommentAdded={handleCommentAdded} />
          </div>
        </div>
      </article>
    </div>
  );
}
