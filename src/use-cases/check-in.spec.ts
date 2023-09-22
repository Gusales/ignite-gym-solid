import { InMemoryCheckInRepository } from '@/repositories/in-memory/in-memory-checkIn-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { CheckInUseCase } from './check-in'
import { randomUUID } from 'node:crypto'

let inMemoryCheckInRepository: InMemoryCheckInRepository
let sut: CheckInUseCase

describe('CheckIn use case', () => {
  beforeEach(() => {
    inMemoryCheckInRepository = new InMemoryCheckInRepository()
    sut = new CheckInUseCase(inMemoryCheckInRepository)
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: randomUUID(),
      userId: randomUUID(),
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
})
