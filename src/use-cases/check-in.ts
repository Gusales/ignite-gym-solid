import { CheckInRepository } from '@/repositories/check-ins-repository'
import { CheckIn } from '@/types/checkIn-type'

interface CheckInUseCaseRequest {
  userId: string
  gymId: string
}

interface CheckInUseCaseResponse {
  checkIn: CheckIn
}

export class CheckInUseCase {
  constructor(private checkInsRepository: CheckInRepository) {}

  async execute({
    gymId,
    userId,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
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
