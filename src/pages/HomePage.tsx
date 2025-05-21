import { useState, useEffect } from "react";
import { getPosts } from "../api/posts";
import { Post } from "../types";
import PostCard from "../components/PostCard";
import Welcome from "../components/Welcome";
import Spinner from "../components/Spinner";

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); // To track if there are more posts to load
  const postsPerPage = 6; // Or any number you prefer

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const fetchedPosts = await getPosts(currentPage, postsPerPage);
        // Filter to only show published posts
        const publishedPosts =
          fetchedPosts?.filter((post) => post.published) || [];
        // Sort by date (newest first) - This sorting should ideally be done by the backend for pagination
        // However, if the API returns a limited set already sorted, this client-side sort is fine for that set.
        const sortedPosts = publishedPosts.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setPosts(sortedPosts);
        setHasMore(sortedPosts.length === postsPerPage); // Check if there might be more posts
      } catch (error) {
        console.error("Failed to fetch posts:", error);
        setHasMore(false); // Assume no more posts on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [currentPage]); // Re-fetch when currentPage changes

  const handleNextPage = () => {
    if (hasMore) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  return (
    <div className="w-full max-w-screen-xl mx-auto">
      <div className="my-3">
        <Welcome />
      </div>

      <div className="w-full max-w-screen-md mx-auto px-6 py-4 my-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner size="lg" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">No posts found.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
        {!isLoading && (
          <div className="flex justify-center items-center mt-8 space-x-4">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              Prev
            </button>
            <span className="text-sm text-gray-700 dark:text-gray-400">
              Page {currentPage}
            </span>
            <button
              onClick={handleNextPage}
              disabled={!hasMore}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
