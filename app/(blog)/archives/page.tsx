import { getAllPosts } from "@/lib/api";
import { DateTime } from "luxon";
import Link from "next/link";

export default async function Page() {
  const posts = await getAllPosts();

  return (
    <div>
      <h2 className="text-2xl mb-5">Archives</h2>
      {posts.map((post) => (
        <div key={post.slug}>
          {post.date.toLocaleString(DateTime.DATE_SHORT)} -
          <Link className="text-green-400" href={`/${post.slug}`}>
            {post.title}
          </Link>
        </div>
      ))}
    </div>
  );
}
