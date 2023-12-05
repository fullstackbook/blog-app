import { getLatestPost } from "@/lib/api";
import { PostType } from "@/lib/types";
import { DateTime } from "luxon";
import Link from "next/link";
import markdownStyles from "./markdown-styles.module.css";

export default async function Home() {
  const post: PostType = await getLatestPost();
  return (
    <div>
      <h2 className="text-6xl text-green-400">
        <Link href={`/${post.slug}`}>{post.title}</Link>
      </h2>
      <div className="my-5">{post.date.toLocaleString(DateTime.DATE_FULL)}</div>
      <div
        className={markdownStyles["markdown"]}
        dangerouslySetInnerHTML={{ __html: post.content }}
      ></div>
    </div>
  );
}
