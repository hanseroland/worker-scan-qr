import { User } from '@domain/entities/User';
import { IUserRepository } from '@domain/repositories/IUserRepository';

export class GetAllUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(): Promise<User[]> {
    const users = await this.userRepository.findAll();

    return users;
  }
}
