import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserUpdate } from './user.entity';
import { UserWithPermission } from '../user/user_with_permission.entity';

@Injectable()
export class UserServiceBase {
  constructor(
    @InjectRepository(User) public readonly userRepository: Repository<User>,
  ) {}

  async create(this_user:UserWithPermission, user: UserUpdate): Promise<User> {
    return await this.userRepository.save(user);
    //return await this.userRepository.insert(user);
  }

  async findAll(this_user:UserWithPermission, options=null): Promise<User[]> {
    return await this.userRepository.find(options);
  }

  async findOne(this_user:UserWithPermission, id: number): Promise<User> {
    return await this.userRepository.findOne({
        where: {
          user_id:id,
        },
    });
  }

  async update(this_user:UserWithPermission, id: number, updateUser: UserUpdate): Promise<User> {
    await this.userRepository.update(id, updateUser);
    return await this.userRepository.findOne({
        where: {
          user_id:id,
        },
    });
  }

  async remove(this_user:UserWithPermission, id: number): Promise<boolean> {
    const result = await this.userRepository.delete(id);
    return result.affected > 0;
  }
}