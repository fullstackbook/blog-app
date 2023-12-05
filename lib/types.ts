import { DateTime } from "luxon";

export interface PostType {
  slug: string;
  title: string;
  content: string;
  date: DateTime;
  nextPost?: {
    title: string;
    slug: string;
  };
  prevPost?: {
    title: string;
    slug: string;
  };
}
