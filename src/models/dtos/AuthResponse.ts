import { User } from '../entities/User';

export interface AuthResponse {
    user: User;
    accessToken?: string;
    expiryDate?: Date;
}