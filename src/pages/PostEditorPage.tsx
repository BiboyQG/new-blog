import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { getPostById, createPost, updatePost } from "../api/posts";
import { PostFormData } from "../types";
import { useAuth } from "../context/AuthContext";
import MarkdownEditor from "../components/MarkdownEditor";

export default function PostEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [content, setContent] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<PostFormData>();

  const isEditMode = !!id;

  useEffect(() => {
    // Check if user is admin, if not redirect to home page
    if (!isAuthenticated) {
      navigate("/");
      return;
    }

    if (user && !user.isAdmin) {
      navigate("/");
      return;
    }

    const fetchPost = async () => {
      if (!isEditMode) return;

      setIsLoading(true);
      try {
        const post = await getPostById(id as string);
        if (post) {
          setValue("title", post.title);
          setValue("excerpt", post.excerpt);
          setValue("slug", post.slug);
          setValue("published", post.published);
          setContent(post.content);
          setTags(post.tags.map((tag) => tag.name));
        }
      } catch (error) {
        console.error("Failed to fetch post:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id, isEditMode, setValue, isAuthenticated, user, navigate]);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const onSubmit = async (data: PostFormData) => {
    if (!user) return;

    const postData = {
      ...data,
      content,
      tags,
    };

    setIsLoading(true);

    try {
      if (isEditMode) {
        await updatePost(id as string, postData);
        navigate(`/posts/${data.slug}`);
      } else {
        const newPost = await createPost(postData, user);
        if (newPost) {
          reset();
          setContent("");
          setTags([]);
          setTimeout(() => {
            navigate(`/posts/${data.slug}`);
          }, 500);
        }
      }
    } catch (error) {
      console.error("Failed to save post:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        {isEditMode ? "Edit Post" : "Create New Post"}
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
      >
        <div className="mb-6">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Title
          </label>
          <input
            id="title"
            type="text"
            {...register("title", { required: "Title is required" })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            placeholder="Post title"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.title.message}
            </p>
          )}
        </div>

        <div className="mb-6">
          <label
            htmlFor="slug"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Slug
          </label>
          <input
            id="slug"
            type="text"
            {...register("slug", {
              required: "Slug is required",
              pattern: {
                value: /^[a-z0-9-]+$/,
                message:
                  "Slug can only contain lowercase letters, numbers, and hyphens",
              },
            })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            placeholder="post-url-slug"
          />
          {errors.slug && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.slug.message}
            </p>
          )}
        </div>

        <div className="mb-6">
          <label
            htmlFor="excerpt"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Excerpt
          </label>
          <textarea
            id="excerpt"
            {...register("excerpt", { required: "Excerpt is required" })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            placeholder="Brief summary of the post"
          ></textarea>
          {errors.excerpt && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.excerpt.message}
            </p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Content
          </label>
          <MarkdownEditor
            value={content}
            onChange={setContent}
            height={400}
          />
          {content.trim() === "" && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              Content is required
            </p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tags
          </label>
          <div className="flex mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="flex-grow px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-l-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              placeholder="Add a tag"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <div
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1.5 text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-100 focus:outline-none"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center">
            <input
              id="published"
              type="checkbox"
              {...register("published")}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="published"
              className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
            >
              Publish post (uncheck to save as draft)
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(isEditMode ? `/posts/${id}` : "/admin")}
            className="btn-secondary"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading || content.trim() === ""}
          >
            {isLoading
              ? "Saving..."
              : isEditMode
              ? "Update Post"
              : "Create Post"}
          </button>
        </div>
      </form>
    </div>
  );
}
