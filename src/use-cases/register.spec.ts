import { expect, describe, it } from 'vitest'
import { RegisterUseCase } from './register'
// import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

describe('Register Use Case', () => {
  it('should be able to register', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const sut = new RegisterUseCase(usersRepository)

    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@dev.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it(`The user's password must be hashed before being registered`, async () => {
    const usersRepository = new InMemoryUsersRepository()
    const sut = new RegisterUseCase(usersRepository)

    const {
      user: { password_hash },
    } = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@dev.com',
      password: '123456',
    })

    const isPasswordCorrectlyHashed = await compare('123456', password_hash)

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const sut = new RegisterUseCase(usersRepository)

    const email = 'node@dev.com'

    await sut.execute({
      name: 'John Doe',
      email,
      password: '123456',
    })

    await expect(() =>
      sut.execute({
        name: 'Joseph Joestar',
        email,
        password: '1234567',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
