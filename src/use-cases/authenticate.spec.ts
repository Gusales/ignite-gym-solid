import { expect, describe, it } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-repository'
import { AuthenticateUseCase } from './authenticate'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

describe('Authenticate Use Case', () => {
  it('should be able to authenticate', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateUseCase(usersRepository)
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
    const usersRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateUseCase(usersRepository)
    const userToAuthenticate = {
      email: 'johndoe@devv.com',
      password: '123456',
    }

    await expect(() => sut.execute(userToAuthenticate)).rejects.toBeInstanceOf(
      InvalidCredentialsError,
    )
  })

  it('should not be able to register with wrong password', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateUseCase(usersRepository)

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
