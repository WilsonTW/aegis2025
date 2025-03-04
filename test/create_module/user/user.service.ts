import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserUpdate } from './user.entity';
import { UserServiceBase } from './user.service.base';

@Injectable()
export class UserService extends UserServiceBase {
  constructor(
    @InjectRepository(User) public readonly userRepository: Repository<User>,
  ) {
    super(userRepository);
  }

  async findByUserAccount(user_account: string): Promise<User> {
    return await this.userRepository.findOne({
        where: {
          user_account: user_account,
        },
    });
  }

}