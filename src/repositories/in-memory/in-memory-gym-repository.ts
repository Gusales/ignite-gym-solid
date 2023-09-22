import { randomUUID } from 'node:crypto'
import { GymsRepository } from '../gym-repository'
import { Gym, Prisma } from '@prisma/client'

export class InMemoryGymRepository implements GymsRepository {
  public items: Gym[] = []

  async findById(gymId: string) {
    const gym = this.items.find((item) => item.id === gymId)
    if (!gym) {
      return null
    }
    return gym
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = {
      id: data.id ?? randomUUID(),
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
    }

    this.items.push(gym)
    return gym
  }
}
