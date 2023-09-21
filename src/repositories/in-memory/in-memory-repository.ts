import { Prisma, User } from '@prisma/client'
import { UsersRepository } from '../users-repository'

export class InMemoryUsersRepository implements UsersRepository {
  public Users: User[] = []

  async findByEmail(email: string) {
    const user = this.Users.find((item) => item.email === email)

    if (user) {
      return user
    }
    return null
  }

  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: 'user-1',
      name: data.name,
      created_at: new Date(),
      email: data.email,
      password_hash: data.password_hash,
    }

    this.Users.push(user)
    return user
  }
}