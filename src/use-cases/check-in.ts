import { CheckInRepository } from '@/repositories/check-ins-repository'
import { GymsRepository } from '@/repositories/gym-repository'
import { CheckIn } from '@/types/checkIn-type'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface CheckInUseCaseRequest {
  userId: string
  gymId: string
  userLatitude: number
  userLongitude: number
}

interface CheckInUseCaseResponse {
  checkIn: CheckIn
}

export class CheckInUseCase {
  constructor(
    private checkInsRepository: CheckInRepository,
    private gymsRepository: GymsRepository,
  ) {}

  async execute({
    gymId,
    userId,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const gym = await this.gymsRepository.findById(gymId)
    console.log(gym)
    if (!gym) {
      throw new ResourceNotFoundError()
    }

    // Calcular a distancia entre o usuário e a academia

    const checkInSameDay = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date(),
    )
    if (checkInSameDay) {
      throw new Error("You don't make twice check-ins in same day.")
    }
    const checkIn = await this.checkInsRepository.create({
      gym_id: gymId,
      user_id: userId,
    })

    return { checkIn }
  }
}
