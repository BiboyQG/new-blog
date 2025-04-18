import { useState, useEffect } from "react";
import { getPosts } from "../api/posts";
import { Post } from "../types";
import PostCard from "../components/PostCard";
import Welcome from "../components/Welcome";
import Spinner from "../components/Spinner";

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const fetchedPosts = await getPosts();
        // Filter to only show published posts
        const publishedPosts =
          fetchedPosts?.filter((post) => post.published) || [];
        // Sort by date (newest first)
        const sortedPosts = publishedPosts.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setPosts(sortedPosts);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

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
      </div>
    </div>
  );
}
