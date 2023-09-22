import { InMemoryCheckInRepository } from '@/repositories/in-memory/in-memory-checkIn-repository'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CheckInUseCase } from './check-in'
import { randomUUID } from 'node:crypto'
import { InMemoryGymRepository } from '@/repositories/in-memory/in-memory-gym-repository'
import { Decimal } from '@prisma/client/runtime/library'

let inMemoryCheckInRepository: InMemoryCheckInRepository
let gymsRepository: InMemoryGymRepository
let sut: CheckInUseCase

describe('CheckIn use case', () => {
  beforeEach(() => {
    inMemoryCheckInRepository = new InMemoryCheckInRepository()
    gymsRepository = new InMemoryGymRepository()
    sut = new CheckInUseCase(inMemoryCheckInRepository, gymsRepository)
    gymsRepository.items.push({
      id: '4c59fd2b-aca4-4e0e-826f-d2ddd31a2e9f',
      title: 'Javascript Gym',
      description: '',
      phone: '',
      latitude: new Decimal(-14.864311),
      longitude: new Decimal(-40.8429771),
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: '4c59fd2b-aca4-4e0e-826f-d2ddd31a2e9f',
      userId: randomUUID(),
      userLatitude: -14.864311,
      userLongitude: -40.8429771,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should be not able to check in twice times in same day', async () => {
    vi.setSystemTime(new Date(2023, 0, 14, 8, 0, 0))
    const gymId = '4c59fd2b-aca4-4e0e-826f-d2ddd31a2e9f'
    const userId = randomUUID()
    await sut.execute({
      gymId,
      userId,
      userLatitude: -14.864311,
      userLongitude: -40.8429771,
    })

    await expect(() =>
      sut.execute({
        gymId,
        userId,
        userLatitude: -14.864311,
        userLongitude: -40.8429771,
      }),
    ).rejects.toBeInstanceOf(/* Error */ Error)
  })

  it('should be able to check in twice times but in diferents days', async () => {
    vi.setSystemTime(new Date(2023, 0, 14, 8, 0, 0))
    const gymId = '4c59fd2b-aca4-4e0e-826f-d2ddd31a2e9f'
    const userId = randomUUID()
    await sut.execute({
      gymId,
      userId,
      userLatitude: -14.864311,
      userLongitude: -40.8429771,
    })

    vi.setSystemTime(new Date(2023, 0, 15, 8, 0, 0))
    const { checkIn } = await sut.execute({
      gymId,
      userId,
      userLatitude: -14.864311,
      userLongitude: -40.8429771,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    gymsRepository.items.push({
      id: 'e6ada4e3-db7b-45ca-8074-418841a5b1b8',
      title: 'Typescript Gym',
      description: '',
      phone: '',
      latitude: new Decimal(-14.848442),
      longitude: new Decimal(-40.8362935),
    })

    await expect(() =>
      sut.execute({
        gymId: 'e6ada4e3-db7b-45ca-8074-418841a5b1b8',
        userId: randomUUID(),
        userLatitude: -14.864311,
        userLongitude: -40.8429771,
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
