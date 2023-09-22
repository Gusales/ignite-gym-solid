import { randomUUID } from 'node:crypto'
import { Prisma } from '@prisma/client'
import { CheckInRepository } from '../check-ins-repository'
import { CheckIn } from '@/types/checkIn-type'

export class InMemoryCheckInRepository implements CheckInRepository {
  public items: CheckIn[] = []

  async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    const checkIn = {
      id: randomUUID(),
      gym_id: data.gym_id,
      user_id: data.user_id,
      created_at: new Date(),
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
    }

    this.items.push(checkIn)
    return checkIn
  }
}
