export const USER_FIELDS = ["id", "created", "updated", "username", "email", "name", "avatar"]

type UserScope = "CAN_CREATE_ARTICLE"

export type User = {
  id: string
  created: string
  updated: string
  username: string
  email: string
  name: string
  avatar: string | null
  scopes: readonly UserScope[]
}
