export const ARTICLE_FIELDS: string[] = [
  "id",
  "created",
  "updated",
  "userId",
  "title",
  "slug",
  "content"
]

export type Article = {
  id: string
  created: string
  updated: string
  userId: string
  title: string
  slug: string
  content: string
}
