import { getLatestPost } from "@/lib/api";
import { PostType } from "@/lib/types";
import { DateTime } from "luxon";
import Link from "next/link";

export default async function Home() {
  const post: PostType = await getLatestPost();
  return (
    <div>
      <h2>
        <Link href={`/${post.slug}`}>{post.title}</Link>
      </h2>
      <div>{post.date.toLocaleString(DateTime.DATETIME_FULL)}</div>
      <div dangerouslySetInnerHTML={{ __html: post.content }}></div>
    </div>
  );
}
