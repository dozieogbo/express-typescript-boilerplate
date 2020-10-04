import { Authorized, CurrentUser, Get, JsonController, Param, QueryParam } from 'routing-controllers';
import { Response } from '../models/dtos/Response';
import { UserService } from '../services/UserService';
import { BaseController } from './BaseController';
import { messages } from '../constants/responses';
import { User } from '../models/entities/User';
import { NotFoundError } from '../errors';
import { UserRole } from '../enums/UserRole';

@JsonController('/users')
export class UserController extends BaseController {
  constructor(private userService: UserService) {
    super();
  }

  @Get('')
  @Authorized(UserRole.ADMIN)
  public async getAllUsers(
    @QueryParam('page') page: number,
    @QueryParam('pageSize') pageSize: number,
  ): Promise<Response<User[]>> {
    const result = await this.userService.getPaginatedUsers(page, pageSize);

    return this.paginated(result.data, {
      page,
      pageSize,
      total: result.count,
    });
  }

  @Get('/:profile')
  @Authorized()
  public async getUserProfile(@CurrentUser({required: true}) user : User): Promise<Response<User>> {
    return this.ok(user);
  }

  @Get('/:id')
  @Authorized(UserRole.USER)
  public async getUser(@Param('id') id: string): Promise<Response<User>> {
    const user = await this.userService.getById(id);

    if(!user){
        throw new NotFoundError(messages.USER_NOT_FOUND)
    }

    return this.ok(user);
  }
}
