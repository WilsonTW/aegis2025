import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';
import { RepairOrderHistory, RepairOrderHistoryUpdate } from './repair_order_history.entity';
import { RepairOrderHistoryServiceBase } from './repair_order_history.service.base';
import { UserWithPermission } from '../user/user_with_permission.entity';

@Injectable()
export class RepairOrderHistoryService extends RepairOrderHistoryServiceBase {
  constructor(
    @InjectRepository(RepairOrderHistory) public readonly repairOrderHistoryRepository: Repository<RepairOrderHistory>,
  ) {
    super(repairOrderHistoryRepository);
  }

  async removeAll(this_user:UserWithPermission, where?: FindOptionsWhere<RepairOrderHistory>): Promise<boolean> {
    var repair_order_historys = await this.findAll(this_user, {
      where: where
    })
    const result = await this.repairOrderHistoryRepository.remove(repair_order_historys)
    return result.length > 0;
  }

}