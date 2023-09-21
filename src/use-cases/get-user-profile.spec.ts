import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { GetUserProfileUseCase } from './get-user-profile'
import { hash } from 'bcryptjs'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let usersRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase

describe('Get user profile', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileUseCase(usersRepository)
  })

  it('should be able to get user profile', async () => {
    const createdUser = await usersRepository.create({
      email: 'johndoe@email.com',
      name: 'John Doe',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({ userId: createdUser.id })

    expect(user.id).toEqual(expect.any(String))
    expect(user.name).toEqual(createdUser.name)
  })

  it('should not be able to get user profile with wrong id', async () => {
    expect(() =>
      sut.execute({ userId: 'non-exiting-id' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
