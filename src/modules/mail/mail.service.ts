import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mail, MailUpdate } from './mail.entity';
import { MailServiceBase } from './mail.service.base';
import { OmitType } from '@nestjs/swagger';

@Injectable()
export class MailService extends MailServiceBase {
  constructor(
    @InjectRepository(Mail) public readonly mailRepository: Repository<Mail>,
  ) {
    super(mailRepository);
  }

  async removeMulti(ids: string): Promise<boolean> {

    var ids_arr = ids.split(',');
    var new_ids = [];
    for (var id of ids_arr) {
      var int_id = parseInt(id)
      if (!isNaN(int_id)) {
        new_ids.push(int_id)
      }
    }
    if (new_ids.length==0) return false;

    const result = await this.mailRepository.createQueryBuilder()
      .delete()
      .from(Mail)
      .where('mail_id IN (:...id)', { id: new_ids })
      .execute();

    return result.affected > 0;
  }

}