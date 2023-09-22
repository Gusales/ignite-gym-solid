import { InMemoryGymRepository } from '@/repositories/in-memory/in-memory-gym-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { CreateGymUseCase } from './create-gym'

let gymRepository: InMemoryGymRepository
let sut: CreateGymUseCase

describe('Create gym use case', () => {
  beforeEach(() => {
    gymRepository = new InMemoryGymRepository()
    sut = new CreateGymUseCase(gymRepository)
  })

  it('should be able to create a new gym', async () => {
    const { gym } = await sut.execute({
      title: 'Academia do Gustavo',
      latitude: -14.8931774,
      longitude: -40.844707,
      description: null,
      phone: null,
    })
    expect(gym.id).toEqual(expect.any(String))
  })
})
