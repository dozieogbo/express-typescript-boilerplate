import { Service } from 'typedi';
import { User } from '../models/entities/User';
import { Logger, LoggerInterface } from '../decorators/Logger';
import { messages as responseMessages } from '../constants/responses';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { BadRequestError } from '../errors/BadRequestError';
import { JwtService } from './JwtService';

@Service()
export class UserService {
  constructor(
    private jwtService: JwtService,
    @Logger(__filename) private log: LoggerInterface,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(user: Partial<User>): Promise<User> {
    const existingUser = await this.getByEmail(user.email);

    if (existingUser) {
      throw new BadRequestError({
        message: responseMessages.EMAIL_ALREADY_EXISTS,
        property: 'email',
      });
    }

    this.log.info(`Creating user with email ${user.email}`);

    return await this.userRepository.save(user);
  }

  async authenticate(email: string, password: string): Promise<User> {
    const user = await this.getByEmail(email);

    if (user == null) {
      return user;
    }

    return (await user.comparePassword(password)) ? user : null;
  }

  async getByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ email: email.toLowerCase() });
  }

  async getById(id: string): Promise<User> {
    return await this.userRepository.findOne(id);
  }

  async getByBearerToken(token: string): Promise<User> {
    if (!token) {
      return null;
    }

    const userId = this.jwtService.verify(token);

    if (!userId) {
      return null;
    }

    return await this.getById(userId);
  }

  async getUsers(query: Partial<User>) {
    return await this.userRepository.find({ where: query });
  }

  async getPaginatedUsers(page:number, pageSize: number, query: Partial<User> = {}) {
    const [users, count] = await this.userRepository.findAndCount({ 
      skip: (page - 1) * pageSize,
      take: pageSize,
      where: query 
    });

    return {
      count,
      data: users,
    };
  }
}
