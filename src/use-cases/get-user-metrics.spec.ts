import { randomUUID } from 'node:crypto'
import { InMemoryCheckInRepository } from '@/repositories/in-memory/in-memory-checkIn-repository'
import { beforeEach, describe, it, expect } from 'vitest'
import { GetUserMetricsUseCase } from './get-user-metrics'

let checkInRepository: InMemoryCheckInRepository
let sut: GetUserMetricsUseCase

describe('Get user metrics use case', () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInRepository()
    sut = new GetUserMetricsUseCase(checkInRepository)
  })

  it('should be able to get metrics', async () => {
    const userId = randomUUID()
    await checkInRepository.create({
      gym_id: 'gym-01',
      user_id: userId,
    })
    await checkInRepository.create({
      gym_id: 'gym-02',
      user_id: userId,
    })

    const { checkInsCount } = await sut.execute({
      userId,
    })

    expect(checkInsCount).toEqual(2)
  })
})
