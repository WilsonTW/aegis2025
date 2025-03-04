import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mail, MailUpdate } from './mail.entity';
import { UserWithPermission } from '../user/user_with_permission.entity';

@Injectable()
export class MailServiceBase {
  constructor(
    @InjectRepository(Mail) public readonly mailRepository: Repository<Mail>,
  ) {}

  async create(this_user:UserWithPermission, mail: MailUpdate): Promise<Mail> {
    return await this.mailRepository.save(mail);
    //return await this.mailRepository.insert(mail);
  }

  async findAll(this_user:UserWithPermission, options=null): Promise<Mail[]> {
    return await this.mailRepository.find(options);
  }

  async findOne(this_user:UserWithPermission, id: number): Promise<Mail> {
    return await this.mailRepository.findOne({
        where: {
          mail_id:id,
        },
    });
  }

  async update(this_user:UserWithPermission, id: number, updateMail: MailUpdate): Promise<Mail> {
    await this.mailRepository.update(id, updateMail);
    return await this.mailRepository.findOne({
        where: {
          mail_id:id,
        },
    });
  }

  async remove(this_user:UserWithPermission, id: number): Promise<boolean> {
    const result = await this.mailRepository.delete(id);
    return result.affected > 0;
  }
}