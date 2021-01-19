import { User } from '../entities/User';

export class AuthResponse {
    user: User;

    accessToken?: string;
    
    expiryDate?: Date;
}