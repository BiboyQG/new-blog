import { nanoid } from "nanoid";
import { createPost } from "../api/posts";
import { API_CONFIG } from "../api/config";

// Function to migrate data from localStorage to the database via API
export const migrateLocalDataToDb = async () => {
  try {
    console.log("Starting data migration from localStorage to the API...");

    // Get posts from localStorage
    const POSTS_STORAGE_KEY = "blog_posts";
    const localPosts = JSON.parse(
      localStorage.getItem(POSTS_STORAGE_KEY) || "[]"
    );

    if (localPosts.length === 0) {
      console.log("No data found in localStorage to migrate.");
      return;
    }

    let migratedPosts = 0;

    // Migrate each post using the API
    for (const post of localPosts) {
      try {
        // Check if post already exists by ID or slug
        const checkResponse = await fetch(
          `${API_CONFIG.baseUrl}/posts/${post.id}`
        );
        const exists = checkResponse.ok;

        if (!exists) {
          // Format the post data for the API
          const postData = {
            id: post.id,
            title: post.title,
            content: post.content,
            excerpt: post.excerpt,
            slug: post.slug,
            published: post.published,
            tags: post.tags.map((tag: any) => tag.name),
          };

          // Create the post via API
          await createPost(postData, post.author);

          // For each comment, add it to the post
          for (const comment of post.comments) {
            await fetch(`${API_CONFIG.baseUrl}/comments`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                postId: post.id,
                comment: {
                  content: comment.content,
                },
                author: comment.author,
              }),
            });
          }

          migratedPosts++;
        }
      } catch (error) {
        console.error(`Error migrating post ${post.id}:`, error);
      }
    }

    console.log(
      `Migration completed: ${migratedPosts} posts migrated to the API.`
    );

    // Optionally, remove data from localStorage after successful migration
    if (migratedPosts > 0) {
      localStorage.removeItem(POSTS_STORAGE_KEY);
      console.log("Removed migrated data from localStorage.");
    }
  } catch (error) {
    console.error("Error during data migration:", error);
  }
};

export default migrateLocalDataToDb;
