import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-repository'
import { AuthenticateUseCase } from './authenticate'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUseCase(usersRepository)
  })

  it('should be able to authenticate', async () => {
    const userToAuthenticate = {
      name: 'John Doe',
      email: 'johndoe@dev.com',
      password: '123456',
    }
    const password_hash = await hash(userToAuthenticate.password, 6)

    await usersRepository.create({
      password_hash,
      ...userToAuthenticate,
    })

    const { user } = await sut.execute(userToAuthenticate)

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to register with wrong email', async () => {
    const userToAuthenticate = {
      email: 'johndoe@devv.com',
      password: '123456',
    }

    await expect(() => sut.execute(userToAuthenticate)).rejects.toBeInstanceOf(
      InvalidCredentialsError,
    )
  })

  it('should not be able to register with wrong password', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@dev.com',
      password_hash: await hash('123456', 6),
    })

    await expect(() =>
      sut.execute({
        email: 'johndoe@dev.com',
        password: '1234567',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
