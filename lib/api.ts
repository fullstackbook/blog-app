import fs from "fs";
import matter from "gray-matter";
import { DateTime } from "luxon";
import { join } from "path";
import { PostType } from "./types";
import { parseMarkdown } from "./markdown";

const postsDirectory = join(process.cwd(), "_posts");

function getPostFilenames() {
  return fs.readdirSync(postsDirectory);
}

export function getPostSlugs() {
  const filenames = getPostFilenames();
  return filenames.map((filename) => filename.replace(/\.md$/, ""));
}

export async function getAllPosts(): Promise<PostType[]> {
  const filenames = getPostFilenames();
  const posts = [];
  for (const filename of filenames) {
    const post = await getPostByFilename(filename);
    posts.push(post);
  }
  posts.sort((a, b) => (a.date < b.date ? -1 : 1));
  generateNextAndPrevSlugs(posts);
  return posts;
}

async function getPostByFilename(filename: string): Promise<PostType> {
  const slug = filename.replace(/\.md$/, "");
  const fullPath = join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  return {
    slug: slug,
    title: data.title,
    content: content,
    date: DateTime.fromISO(data.date),
  };
}

export async function getLatestPost(): Promise<PostType> {
  const posts = await getAllPosts();
  const firstPost = posts[posts.length - 1];
  firstPost.content = await parseMarkdown(firstPost.content);
  return firstPost;
}

export async function getPostBySlug(slug: string) {
  const posts = await getAllPosts();
  const post = posts.find((post) => post.slug === slug);
  if (!post) {
    throw Error("post not found");
  }
  post.content = await parseMarkdown(post.content);

  return post;
}

function generateNextAndPrevSlugs(posts: PostType[]) {
  for (let i = 0; i < posts.length; i++) {
    if (i < posts.length - 1) {
      posts[i].nextPost = {
        title: posts[i + 1].title,
        slug: posts[i + 1].slug,
      };
    }
    if (i > 0) {
      posts[i].prevPost = {
        title: posts[i - 1].title,
        slug: posts[i - 1].slug,
      };
    }
  }
}
