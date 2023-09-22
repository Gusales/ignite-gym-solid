import { randomUUID } from 'node:crypto'
import { InMemoryCheckInRepository } from '@/repositories/in-memory/in-memory-checkIn-repository'
import { beforeEach, describe, it, expect } from 'vitest'
import { FetchUserCheckInsHistoryUseCase } from './fetch-user-check-ins-history'

let checkInRepository: InMemoryCheckInRepository
let sut: FetchUserCheckInsHistoryUseCase

describe('Fetch member checkins history use case', () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInRepository()
    sut = new FetchUserCheckInsHistoryUseCase(checkInRepository)
  })

  it('should be able to fetch check-in history', async () => {
    const userId = randomUUID()
    await checkInRepository.create({
      gym_id: 'gym-01',
      user_id: userId,
    })
    await checkInRepository.create({
      gym_id: 'gym-02',
      user_id: userId,
    })

    const { checkIns } = await sut.execute({
      userId,
      page: 1,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-01' }),
      expect.objectContaining({ gym_id: 'gym-02' }),
    ])
  })

  it('should be able to fetch paginated check-in history', async () => {
    const userId = randomUUID()
    for (let i = 1; i <= 25; i++) {
      await checkInRepository.create({
        gym_id: `gym-${i}`,
        user_id: userId,
      })
    }

    const { checkIns } = await sut.execute({
      userId,
      page: 2,
    })

    expect(checkIns).toHaveLength(5)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-21' }),
      expect.objectContaining({ gym_id: 'gym-22' }),
      expect.objectContaining({ gym_id: 'gym-23' }),
      expect.objectContaining({ gym_id: 'gym-24' }),
      expect.objectContaining({ gym_id: 'gym-25' }),
    ])
  })
})
