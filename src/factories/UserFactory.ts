import * as Faker from 'faker';
import { UserRole } from 'src/enums/UserRole';
import { define } from 'typeorm-seeding';
import * as uuid from 'uuid';

import { User } from '../models/entities/User';

define(User, (faker: typeof Faker, settings: { role: UserRole }) => {
    const gender = faker.random.number(1);
    const firstName = faker.name.firstName(gender);
    const lastName = faker.name.lastName(gender);
    const email = faker.internet.email(firstName, lastName);
    const phone = faker.phone.phoneNumber();

    const user = new User();
    user.id = uuid.v1();
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.phoneNumber = phone;
    user.password = 'password';
    user.role = settings.role;
    return user;
});
