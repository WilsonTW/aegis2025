import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Domain, DomainUpdate } from './domain.entity';
import { UserWithPermission } from '../user/user_with_permission.entity';

@Injectable()
export class DomainServiceBase {
  constructor(
    @InjectRepository(Domain) public readonly domainRepository: Repository<Domain>,
  ) {}

  async create(this_user:UserWithPermission, domain: DomainUpdate): Promise<Domain> {
    return await this.domainRepository.save(domain);
    //return await this.domainRepository.insert(domain);
  }

  async findAll(this_user:UserWithPermission, options=null): Promise<Domain[]> {
    return await this.domainRepository.find(options);
  }

  async findOne(this_user:UserWithPermission, id: number): Promise<Domain> {
    return await this.domainRepository.findOne({
        where: {
          domain_id:id,
        },
    });
  }

  async update(this_user:UserWithPermission, id: number, updateDomain: DomainUpdate): Promise<Domain> {
    await this.domainRepository.update(id, updateDomain);
    return await this.domainRepository.findOne({
        where: {
          domain_id:id,
        },
    });
  }

  async remove(this_user:UserWithPermission, id: number): Promise<boolean> {
    const result = await this.domainRepository.delete(id);
    return result.affected > 0;
  }
}