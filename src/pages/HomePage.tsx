import { useState, useEffect } from "react";
import { getPosts } from "../api/posts";
import { Post } from "../types";
import PostCard from "../components/PostCard";
import Welcome from "../components/Welcome";

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
      {/* Welcome Section */}
      <Welcome />

      <div className="w-full max-w-screen-lg mx-auto px-6 py-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-600 dark:text-gray-400">Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">No posts found.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post.id} className="blog-post">
                <h2 className="blog-post-title">
                  <a href={`/posts/${post.slug}`}>{post.title}</a>
                </h2>
                <div className="blog-post-meta">
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  · 4 min · {post.author?.name || "Banghao Chi"}
                </div>
                <p className="blog-post-excerpt">{post.excerpt}</p>
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span key={tag.id} className="blog-tag">
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
