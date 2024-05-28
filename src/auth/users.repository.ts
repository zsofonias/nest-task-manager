import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

import * as bcrypt from 'bcrypt';

const extractValuesBetweenParentheses = (input: string): string[] => {
  const regex = /\(([^)]+)\)/g;
  const matches = [];
  let match;
  while ((match = regex.exec(input)) !== null) {
    matches.push(match[1]);
  }
  return matches;
};

@Injectable()
export class UsersRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    // const salt = await bcrypt.genSalt();
    // const hashedPassword = await bcrypt.hash(password, salt)
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = this.create({
      username,
      password: hashedPassword,
    });

    try {
      await this.save(user);
    } catch (err) {
      if (err.code === '23505') {
        const [dupField, dupVal] = extractValuesBetweenParentheses(err.detail);
        throw new ConflictException(
          `${dupVal} already exists as a ${dupField}`,
        );
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
