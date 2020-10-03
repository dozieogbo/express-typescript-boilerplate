import { Service } from 'typedi';
import { User } from '../../models/entities/User';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { messages as responseMessages } from '../../constants/responses';
import { Repository } from 'typeorm';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { BadRequestError } from 'src/errors/BadRequestError';

@Service()
export class UserService {
  constructor(
    @Logger(__filename) private log: LoggerInterface,
    @OrmRepository() private userRepository: Repository<User>,
  ) {}

  async create(user: User): Promise<User> {
    const existingUser = await this.getByEmail(user.email);

    if (existingUser) {
      throw new BadRequestError(responseMessages.emailAlreadExists, 'email');
    }

    this.log.info(`Creating user with email ${user.email}`);

    return await this.userRepository.save(user);
  }

  async getByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ email: email.toLowerCase() });
  }
}
