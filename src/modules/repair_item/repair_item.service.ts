import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { RepairItem, RepairItemUpdate } from './repair_item.entity';
import { RepairItemServiceBase } from './repair_item.service.base';
import { UserWithPermission } from '../user/user_with_permission.entity';
import { RepairOrderHistoryService } from '../repair_order_history/repair_order_history.service';
import { Util } from 'src/util/util';
import { DeviceService } from '../device/device.service';

@Injectable()
export class RepairItemService extends RepairItemServiceBase {
  constructor(
    @InjectRepository(RepairItem) public readonly repairItemRepository: Repository<RepairItem>,
    private readonly repairOrderHistoryService: RepairOrderHistoryService,
    private readonly deviceService: DeviceService,

  ) {
    super(repairItemRepository);
  }


  async create(this_user:UserWithPermission, repairItem: RepairItemUpdate): Promise<RepairItem> {
    var ret = await this.repairItemRepository.save(repairItem);

    var device_name = null
    if ("device_id" in repairItem && repairItem.device_id!=null) {
      var device = await this.deviceService.findOne(this_user, repairItem.device_id);
      if (device) {
        device_name = device.device_name
      }
    }

    ret["device_name"] = device_name

    await this.repairOrderHistoryService.create(this_user, {
      repair_order_id: ret.repair_order_id,
      repair_item_id: ret.repair_item_id,
      user_id: this_user.user_id,
      user_name: this_user.user_name,
      table_name: 'repair_item',
      difference: JSON.stringify({
        add: ret
      }),
      snapshot: JSON.stringify(ret),
      create_time: (new Date()).toISOString()
    });

    delete ret["device_name"]

    return ret
  }

  async update(this_user:UserWithPermission, id: number, updateRepairItem: RepairItemUpdate): Promise<RepairItem> {
    var from_repair_item = await this.repairItemRepository.findOne({
      where: {
        repair_item_id:id,
      },
    });
    await this.repairItemRepository.update(id, updateRepairItem);

    var from_device_name = ''
    if (from_repair_item.device_id!=null) {
      let from_device = await this.deviceService.findOne(this_user, from_repair_item.device_id);
      if (from_device) {
        from_device_name = from_device.device_name
      }
    }
    from_repair_item["device_name"] = from_device_name

    var to_repair_item = await this.repairItemRepository.findOne({
        where: {
          repair_item_id:id,
        },
    });

    var to_device_name = ''
    if (to_repair_item.device_id!=null) {
      let to_device = await this.deviceService.findOne(this_user, to_repair_item.device_id);
      if (to_device) {
        to_device_name = to_device.device_name
      }
    }
    to_repair_item["device_name"] = to_device_name
   
    var difference = Util.diffObject(from_repair_item, to_repair_item)

    if (difference.modified) {
      await this.repairOrderHistoryService.create(this_user, {
        repair_order_id: to_repair_item.repair_order_id,
        repair_item_id: to_repair_item.repair_item_id,
        user_id: this_user.user_id,
        user_name: this_user.user_name,
        table_name: 'repair_item',
        difference: JSON.stringify(difference),
        snapshot: JSON.stringify(to_repair_item),
        create_time: (new Date()).toISOString()
      });
    }
    
    delete to_repair_item["device_name"]
    
    return to_repair_item
  }

  async remove(this_user:UserWithPermission, id: number): Promise<boolean> {

    var from_repair_item = await this.repairItemRepository.findOne({
      where: {
        repair_item_id:id,
      },
    });

    const result = await this.repairItemRepository.delete(id);

    await this.repairOrderHistoryService.create(this_user, {
      repair_order_id: from_repair_item.repair_order_id,
      repair_item_id: from_repair_item.repair_item_id,
      user_id: this_user.user_id,
      user_name: this_user.user_name,
      table_name: 'repair_item',
      difference: JSON.stringify({
        remove: from_repair_item
      }),
      snapshot: JSON.stringify(null),
      create_time: (new Date()).toISOString()
    });

    return result.affected > 0;
  }

  async removeAll(this_user:UserWithPermission, where?: FindOptionsWhere<RepairItem>): Promise<boolean> {
    var repair_items = await this.findAll(this_user, {
      where: where
    })
    const result = await this.repairItemRepository.remove(repair_items)
    return result.length > 0;
  }

}