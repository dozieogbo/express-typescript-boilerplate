import { IsEmail, IsNotEmpty, IsPhoneNumber } from 'class-validator';
import { Body, JsonController, Post } from 'routing-controllers';
import { BadRequestError } from '../errors/BadRequestError';
import { JwtService } from '../services/JwtService';
import { AuthResponse } from '../models/dtos/AuthResponse';
import { Response } from '../models/dtos/Response';
import { UserService } from '../services/UserService';
import { BaseController } from './BaseController';
import { messages } from 'src/constants/responses';

class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  password: string;
}

class SignupDto extends LoginDto {
  @IsNotEmpty()
  firstName: string;
  @IsNotEmpty()
  lastName: string;
  @IsPhoneNumber(null)
  phone: string;
}

@JsonController('/auth')
export class AuthController extends BaseController {
  constructor(private userService: UserService, private jwtService: JwtService) {
    super();
  }

  @Post('/login')
  public async login(@Body() body: LoginDto): Promise<Response<AuthResponse>> {
    const user = await this.userService.authenticate(body.email, body.password);

    if (!user) {
      throw new BadRequestError(messages.invalidLoginDetails);
    }

    const tokenResult = this.jwtService.sign(user.id);

    return this.ok({
      user,
      accessToken: tokenResult.token,
      expiryDate: tokenResult.expiresIn,
    });
  }

  @Post('/signup')
  public async signup(@Body() body: SignupDto): Promise<Response<AuthResponse>> {
    const user = await this.userService.create({
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName,
      password: body.password,
      phoneNumber: body.phone,
    });

    const tokenResult = this.jwtService.sign(user.id);

    return this.ok({
      user,
      accessToken: tokenResult.token,
      expiryDate: tokenResult.expiresIn,
    });
  }
}
