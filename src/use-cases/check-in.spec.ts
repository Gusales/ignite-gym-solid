import { InMemoryCheckInRepository } from '@/repositories/in-memory/in-memory-checkIn-repository'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CheckInUseCase } from './check-in'
import { randomUUID } from 'node:crypto'

let inMemoryCheckInRepository: InMemoryCheckInRepository
let sut: CheckInUseCase

describe('CheckIn use case', () => {
  beforeEach(() => {
    inMemoryCheckInRepository = new InMemoryCheckInRepository()
    sut = new CheckInUseCase(inMemoryCheckInRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: randomUUID(),
      userId: randomUUID(),
    })

    console.log(checkIn.created_at)

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should be not able to check in twice times in same day', async () => {
    vi.setSystemTime(new Date(2023, 0, 14, 8, 0, 0))
    const gymId = randomUUID()
    const userId = randomUUID()
    await sut.execute({
      gymId,
      userId,
    })

    await expect(() =>
      sut.execute({
        gymId,
        userId,
      }),
    ).rejects.toBeInstanceOf(/* Error */ Error)
  })

  it('should be able to check in twice times but in diferents days', async () => {
    vi.setSystemTime(new Date(2023, 0, 14, 8, 0, 0))
    const gymId = randomUUID()
    const userId = randomUUID()
    await sut.execute({
      gymId,
      userId,
    })

    vi.setSystemTime(new Date(2023, 0, 15, 8, 0, 0))
    const { checkIn } = await sut.execute({
      gymId,
      userId,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
})
