import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserUpdate } from './user.entity';

@Injectable()
export class UserServiceBase {
  constructor(
    @InjectRepository(User) public readonly userRepository: Repository<User>,
  ) {}

  async create(user: UserUpdate): Promise<User> {
    return await this.userRepository.save(user);
    //return await this.userRepository.insert(user);
  }

  async findAll(options=null): Promise<User[]> {
    return await this.userRepository.find(options);
  }

  async findOne(id: number): Promise<User> {
    return await this.userRepository.findOne({
        where: {
          user_id:id,
        },
    });
  }

  async update(id: number, updateUser: UserUpdate): Promise<User> {
    await this.userRepository.update(id, updateUser);
    return await this.userRepository.findOne({
        where: {
          user_id:id,
        },
    });
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.userRepository.delete(id);
    return result.affected > 0;
  }
}