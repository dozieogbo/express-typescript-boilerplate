import { Service } from 'typedi';
import jwt from 'jsonwebtoken';
import config from '../config';
import moment from 'moment';

@Service()
export class JwtService {
  public sign(userId: string) {
    const expiryDate = moment().add(config.jwt.daysValid, 'days').toDate();

    const epochExpiryDate = Math.round(expiryDate.getTime() / 1000);

    const token = jwt.sign(
      {
        sub: userId,
        exp: epochExpiryDate,
      },
      config.jwt.secretKey,
    );

    return {
      token,
      expiresIn: expiryDate,
    };
  }
  public verify(token: string): string {
    try {
      const payload: any = jwt.verify(token, config.jwt.secretKey, {
        ignoreExpiration: false,
      });

      return payload.sub;
    } catch {
      return null;
    }
  }
}
