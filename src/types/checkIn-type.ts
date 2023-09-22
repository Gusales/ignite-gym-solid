export type CheckIn = {
  id: string
  created_at: Date
  validated_at: Date | null
  user_id: string
  gym_id: string
}
