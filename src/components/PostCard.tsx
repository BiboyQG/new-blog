import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Post } from "../types";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <Link to={`/posts/${post.slug}`} className="block">
      <div className="bg-white dark:bg-[rgb(46,46,51)] rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02]">
        <div className="p-6">
          <div className="flex items-center mb-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {format(new Date(post.createdAt), "MMMM d, yyyy")}
            </span>
          </div>

          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">
            {post.title}
          </h2>

          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <span className="text-sm text-gray-600 dark:text-gray-400 pl-1">
                {post.author.name} | {post.readTime} min
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {post.tags &&
                post.tags.length > 0 &&
                post.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full px-2 py-1 text-xs"
                  >
                    {tag.name}
                  </span>
                ))}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
