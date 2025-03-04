import { HttpException, HttpStatus, Inject, Injectable, NotFoundException, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RepairOrder, RepairOrderUpdate } from './repair_order.entity';
import { RepairOrderServiceBase } from './repair_order.service.base';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { AppConfigService } from '../../app_config.service';
import { Util } from 'src/util/util';
import { Mail } from '../mail/mail.entity';
import { MailService } from '../mail/mail.service';
import { AppService } from '../../app.service';
import { EventService } from '../event/event.service';
import { UserWithPermission } from '../user/user_with_permission.entity';
import { DomainService } from '../domain/domain.service';
import { GetRepairOrderArgs } from './repair_order.args';
import { RepairOrderHistoryService } from '../repair_order_history/repair_order_history.service';
import { RepairItemService } from '../repair_item/repair_item.service';
import { RepairRecordService } from '../repair_record/repair_record.service';

const path = require('node:path');
const fs = require('fs');

@Injectable()
export class RepairOrderService extends RepairOrderServiceBase {
  constructor(
    @InjectRepository(RepairOrder) public readonly repairOrderRepository: Repository<RepairOrder>,
    private readonly appService: AppService,
    private readonly domainService: DomainService,
    private readonly repairOrderHistoryService: RepairOrderHistoryService,
    private readonly repairItemService: RepairItemService,
    private readonly repairRecordService: RepairRecordService
  //  public readonly mailService: MailService,
  //  public readonly notifyService: NotifyService,
  //  @Inject(MailService) public readonly mailService: MailService,
  //  @InjectRepository(Mail) public readonly mailRepository: Repository<Mail>,
  ) {
    super(repairOrderRepository);
  }

  async getPhotos(repair_order_id) {
    var config = AppConfigService.getSystemConfig();
    return await Util.getPhotos(config.repair_order_dirname, repair_order_id);
  }


  async checkData(this_user:UserWithPermission, repairOrder: RepairOrderUpdate) {
    if (repairOrder.domain_id!=null) {
      var in_domain = await this.domainService.includeDomain(this_user.domain_id, repairOrder.domain_id)
      if (!in_domain) {
        throw new HttpException('domain_id is out of domain', HttpStatus.FORBIDDEN);
      }
    }
  }

  async create(this_user:UserWithPermission, repairOrder: RepairOrderUpdate): Promise<RepairOrder> {
    if (repairOrder.domain_id==null) {
      throw new HttpException('domain_id is null', HttpStatus.BAD_REQUEST);
    }
    await this.checkData(this_user, repairOrder)
    repairOrder.creator_id = this_user.user_id;
    var ret = await this.repairOrderRepository.save(repairOrder);

    await this.repairOrderHistoryService.create(this_user, {
      repair_order_id: ret.repair_order_id,
      user_id: this_user.user_id,
      user_name: this_user.user_name,
      table_name: 'repair_order',
      difference: JSON.stringify({
        add: ret
      }),
      snapshot: JSON.stringify(ret),
      create_time: (new Date()).toISOString()
    });

    if (repairOrder.assign_user_id!=null) {
      try {
        await this.appService.notifyUser(
          this_user,
          {
            user_id:repairOrder.assign_user_id,
            mail: true,
            email: true,
            line_notify: true
          },
          'repair_order', 'Repair order('+ret.repair_order_id+') is created', null, ret.repair_order_id)
      } catch (ex) {
        console.log(ex);
      }
    }
    return ret;
    //return await this.repairOrderRepository.insert(repairOrder);
  }

  async update(this_user:UserWithPermission, id: number, updateRepairOrder: RepairOrderUpdate): Promise<RepairOrder> {
    var from_repair_order:RepairOrder = await this.findOneInDomain(this_user, id)
    if (from_repair_order==null) {
      throw new HttpException('The repair_order is not in this domain', HttpStatus.FORBIDDEN);
    }

    await this.checkData(this_user, updateRepairOrder)
    delete updateRepairOrder.creator_id
    await this.repairOrderRepository.update(id, updateRepairOrder);
    
    var to_repair_order = await this.repairOrderRepository.findOne({
      where: {
        repair_order_id:id,
      },
    });

    var difference = Util.diffObject(from_repair_order, to_repair_order)

    if (difference.modified) {
      await this.repairOrderHistoryService.create(this_user, {
        repair_order_id: id,
        user_id: this_user.user_id,
        user_name: this_user.user_name,
        table_name: 'repair_order',
        difference: JSON.stringify(difference),
        snapshot: JSON.stringify(to_repair_order),
        create_time: (new Date()).toISOString()
      });
    }

    try {
      if (to_repair_order.assign_user_id!=null && from_repair_order.assign_user_id!=to_repair_order.assign_user_id) {
        await this.appService.notifyUser(
          this_user,
          {
            user_id:to_repair_order.assign_user_id,
            mail: true,
            email: true,
            line_notify: true
          }, 'repair_order', 'Repair order('+to_repair_order.repair_order_id+') is assigned', null, to_repair_order.repair_order_id)
      }
    } catch (ex) {
      console.log(ex);
    }
    return to_repair_order;
  }

  async remove(this_user:UserWithPermission, id: number): Promise<boolean> {
    var repairOrder: RepairOrder = await this.findOneInDomain(this_user, id)
    if (repairOrder==null) {
      throw new HttpException('The repair_order is not in this domain', HttpStatus.NOT_FOUND);
    }
    var repair_records = await this.repairRecordService.findAll(this_user, {where:{repair_order_id: id}})
    for (var repair_record of repair_records) {
      await this.repairRecordService.remove(this_user, repair_record.repair_record_id)
    }
    await this.repairItemService.removeAll(this_user, {repair_order_id: id})
    await this.repairOrderHistoryService.removeAll(this_user, {repair_order_id: id})
    const result = await this.repairOrderRepository.delete(id);
    return result.affected > 0;
  }

  async findAll(this_user:UserWithPermission, options=null): Promise<RepairOrder[]> {
    var repair_orders =  await this.repairOrderRepository.find(options);
    for (var repair_order of repair_orders) {
      repair_order.photos = (await this.getPhotos(repair_order.repair_order_id)).join('|');
    }
    return repair_orders;
  }


  async findAllInDomain(this_user:UserWithPermission, options=null): Promise<RepairOrder[]> {
    var repair_orders = await this.domainService.getAllRepairOrders(this_user, this, this_user.domain_id, options?.where)
    return repair_orders
  }

  async findOne(this_user:UserWithPermission, id: number): Promise<RepairOrder> {
    var repair_order = await this.repairOrderRepository.findOne({
        where: {
          repair_order_id:id,
        },
    });
    repair_order.photos = (await this.getPhotos(repair_order.repair_order_id)).join('|');
    return repair_order;
  }

  async findOneInDomain(this_user:UserWithPermission, id: number): Promise<RepairOrder> {
    var where:GetRepairOrderArgs = {repair_order_id: id}
    var repair_orders = await this.domainService.getAllRepairOrders(this_user, this, this_user.domain_id, where)
    return repair_orders.length>0 ? repair_orders[0] : null;
  }


}