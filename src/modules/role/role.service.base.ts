import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role, RoleUpdate } from './role.entity';
import { UserWithPermission } from '../user/user_with_permission.entity';

@Injectable()
export class RoleServiceBase {
  constructor(
    @InjectRepository(Role) public readonly roleRepository: Repository<Role>,
  ) {}

  async create(this_user:UserWithPermission, role: RoleUpdate): Promise<Role> {
    return await this.roleRepository.save(role);
    //return await this.roleRepository.insert(role);
  }

  async findAll(this_user:UserWithPermission, options=null): Promise<Role[]> {
    return await this.roleRepository.find(options);
  }

  async findOne(this_user:UserWithPermission, id: number): Promise<Role> {
    return await this.roleRepository.findOne({
        where: {
          role_id:id,
        },
    });
  }

  async update(this_user:UserWithPermission, id: number, updateRole: RoleUpdate): Promise<Role> {
    await this.roleRepository.update(id, updateRole);
    return await this.roleRepository.findOne({
        where: {
          role_id:id,
        },
    });
  }

  async remove(this_user:UserWithPermission, id: number): Promise<boolean> {
    const result = await this.roleRepository.delete(id);
    return result.affected > 0;
  }
}