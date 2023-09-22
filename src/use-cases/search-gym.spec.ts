import { beforeEach, describe, expect, it } from 'vitest'
import { SearchGymsUseCase } from './search-gym'
import { InMemoryGymRepository } from '@/repositories/in-memory/in-memory-gym-repository'

let gymRepository: InMemoryGymRepository
let sut: SearchGymsUseCase

describe('Search Gym use case', () => {
  beforeEach(() => {
    gymRepository = new InMemoryGymRepository()
    sut = new SearchGymsUseCase(gymRepository)
  })

  it('should be able to search gyms using name', async () => {
    for (let i = 0; i < 5; i++) {
      await gymRepository.create({
        id: `gym-${i}`,
        title: `gym-${i}`,
        description: null,
        phone: null,
        latitude: 0,
        longitude: 0,
      })
    }

    const { gyms } = await sut.execute({ query: 'gym-2', page: 1 })

    expect(gyms).toHaveLength(1)
  })

  it('should be able to search gyms paginated', async () => {
    for (let i = 1; i <= 25; i++) {
      await gymRepository.create({
        id: `gym-${i}`,
        title: `Javascript Gym ${i}`,
        description: null,
        phone: null,
        latitude: 0,
        longitude: 0,
      })
    }

    const { gyms } = await sut.execute({
      query: 'Javascript',
      page: 2,
    })

    expect(gyms).toHaveLength(5)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Javascript Gym 21' }),
      expect.objectContaining({ title: 'Javascript Gym 22' }),
      expect.objectContaining({ title: 'Javascript Gym 23' }),
      expect.objectContaining({ title: 'Javascript Gym 24' }),
      expect.objectContaining({ title: 'Javascript Gym 25' }),
    ])
  })
})
