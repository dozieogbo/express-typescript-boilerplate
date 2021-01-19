import { IsEmail, IsNotEmpty, IsPhoneNumber } from 'class-validator';
import { Body/*, Get*/, JsonController, Post } from 'routing-controllers';
import { ResponseSchema } from 'routing-controllers-openapi';
import { JwtService } from '../services/JwtService';
import { AuthResponse } from '../models/dtos/AuthResponse';
import { UserService } from '../services/UserService';
import { BaseController } from './BaseController';
import { messages } from '../constants/responses';
import { BadRequestError/*, NotFoundError*/ } from '../errors';
import { Response } from '../models/dtos/Response';

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

  @ResponseSchema(AuthResponse)
  @Post('/login')
  public async login(@Body() body: LoginDto): Promise<Response<AuthResponse>> {
    const user = await this.userService.authenticate(body.email, body.password);

    if (!user) {
      throw new BadRequestError({
        message: messages.INVALID_LOGIN_DETAILS
      });
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
