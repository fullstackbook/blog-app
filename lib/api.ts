import fs from "fs";
import matter from "gray-matter";
import { DateTime } from "luxon";
import { join } from "path";
import { remark } from "remark";
import html from "remark-html";
import { PostType } from "./types";

const postsDirectory = join(process.cwd(), "_posts");

function getPostFilenames() {
  return fs.readdirSync(postsDirectory);
}

async function getAllPosts(): Promise<PostType[]> {
  const filenames = getPostFilenames();
  const posts = [];
  for (const filename of filenames) {
    const post = await getPostByFilename(filename);
    posts.push(post);
  }
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
  posts.sort((a, b) => (a.date > b.date ? -1 : 1));
  const firstPost = posts[0];
  firstPost.content = await markdownToHtml(firstPost.content);
  return firstPost;
}

async function markdownToHtml(markdown: string) {
  const result = await remark().use(html).process(markdown);
  return result.toString();
}
