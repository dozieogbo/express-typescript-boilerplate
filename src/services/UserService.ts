import { Service } from 'typedi';
import { User } from '../models/entities/User';
import { Logger, LoggerInterface } from '../decorators/Logger';
import { messages as responseMessages } from '../constants/responses';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { BadRequestError } from '../errors/BadRequestError';

@Service()
export class UserService {
  constructor(
    @Logger(__filename) private log: LoggerInterface,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(user: Partial<User>): Promise<User> {
    const existingUser = await this.getByEmail(user.email);

    if (existingUser) {
      throw new BadRequestError(responseMessages.emailAlreadyExists, 'email');
    }

    this.log.info(`Creating user with email ${user.email}`);

    return await this.userRepository.save(user);
  }

  async authenticate(email: string, password: string): Promise<User>{
    const user = await this.getByEmail(email);

    if(user == null){
      return user;
    }

    return await user.comparePassword(password) ? user : null;
  }

  async getByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ email: email.toLowerCase() });
  }

  async getById(id: string): Promise<User> {
    return await this.userRepository.findOne(id);
  }
}
