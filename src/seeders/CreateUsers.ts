import { UserRole } from '../enums/UserRole';
import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm/connection/Connection';

import { User } from '../models/entities/User';

export class CreateUsers implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await factory(User)({ role: UserRole.USER}).createMany(10);
  }
}
