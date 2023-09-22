import { CheckInRepository } from '@/repositories/check-ins-repository'
import { CheckIn } from '@/types/checkIn-type'

interface fetchUserCheckInsHistoryUseCaseRequest {
  userId: string
  page: number
}

interface fetchUserCheckInsHistoryUseCaseResponse {
  checkIns: CheckIn[]
}

export class FetchUserCheckInsHistoryUseCase {
  constructor(private checkInsRepository: CheckInRepository) {}

  async execute({
    userId,
    page,
  }: fetchUserCheckInsHistoryUseCaseRequest): Promise<fetchUserCheckInsHistoryUseCaseResponse> {
    const checkIns = await this.checkInsRepository.findManyBuyUserId(
      userId,
      page,
    )

    return { checkIns }
  }
}
