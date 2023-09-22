import { GymsRepository } from '../gym-repository'
import { Gym } from '@prisma/client'

export class InMemoryGymRepository implements GymsRepository {
  public items: Gym[] = []

  async findById(gymId: string) {
    const gym = this.items.find((item) => item.id === gymId)
    if (!gym) {
      return null
    }
    return gym
  }
}
