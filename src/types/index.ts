export interface User {
  id: string;
  email: string;
  name: string;
  picture: string;
  isAdmin: boolean;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  published: boolean;
  readTime?: number;
  createdAt: string;
  updatedAt: string;
  author: User;
  tags: Tag[];
  comments: Comment[];
}

export interface Tag {
  id: string;
  name: string;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: User;
  postId: string;
}

export interface PostFormData {
  id?: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  published: boolean;
  tags: string[];
}

export interface CommentFormData {
  content: string;
}
