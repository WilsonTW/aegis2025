import { Delete, HttpException, HttpStatus, Injectable, NotFoundException, Param, Post, Put, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RepairRecord, RepairRecordUpdate } from './repair_record.entity';
import { RepairRecordServiceBase } from './repair_record.service.base';
import { AppConfigService } from 'src/app_config.service';
import { Util } from 'src/util/util';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiParam } from '@nestjs/swagger';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { UploadPipe } from 'src/upload_pipe.pipe';
import { UserWithPermission } from '../user/user_with_permission.entity';
import { RepairOrderHistoryService } from '../repair_order_history/repair_order_history.service';

@Injectable()
export class RepairRecordService extends RepairRecordServiceBase {
  constructor(
    @InjectRepository(RepairRecord) public readonly repairRecordRepository: Repository<RepairRecord>,
    private readonly repairOrderHistoryService: RepairOrderHistoryService,
  ) {
    super(repairRecordRepository);
  }

  async getPhotos(repair_record_id) {
    var config = AppConfigService.getSystemConfig();
    return await Util.getPhotos(config.repair_record_dirname, repair_record_id);
  }

  async findAll(this_user:UserWithPermission, options=null): Promise<RepairRecord[]> {
    var repair_records =  await this.repairRecordRepository.find(options);
    for (var repair_record of repair_records) {
      repair_record.photos = (await this.getPhotos(repair_record.repair_record_id)).join('|');
    }
    return repair_records;
  }

  async findOne(this_user:UserWithPermission, id: number): Promise<RepairRecord> {
    var repair_record = await this.repairRecordRepository.findOne({
        where: {
          repair_record_id:id,
        },
    });
    repair_record.photos = (await this.getPhotos(repair_record.repair_record_id)).join('|');
    return repair_record;
  }

  async create(this_user:UserWithPermission, repairRecord: RepairRecordUpdate): Promise<RepairRecord> {
    var ret = await this.repairRecordRepository.save(repairRecord);

    await this.repairOrderHistoryService.create(this_user, {
      repair_order_id: ret.repair_order_id,
      repair_item_id: ret.repair_item_id,
      repair_record_id: ret.repair_record_id,
      user_id: this_user.user_id,
      user_name: this_user.user_name,
      table_name: 'repair_record',
      difference: JSON.stringify({
        add: ret
      }),
      snapshot: JSON.stringify(ret),
      create_time: (new Date()).toISOString()
    });
    return ret
  }

  async update(this_user:UserWithPermission, id: number, updateRepairRecord: RepairRecordUpdate): Promise<RepairRecord> {
    var from_repair_record = await this.repairRecordRepository.findOne({
        where: {
          repair_record_id:id,
        },
    });
    await this.repairRecordRepository.update(id, updateRepairRecord);
    var to_repair_record = await this.repairRecordRepository.findOne({
        where: {
          repair_record_id:id,
        },
    });

    var difference = Util.diffObject(from_repair_record, to_repair_record)

    if (difference.modified) {
      await this.repairOrderHistoryService.create(this_user, {
        repair_order_id: to_repair_record.repair_order_id,
        repair_item_id: to_repair_record.repair_item_id,
        repair_record_id: to_repair_record.repair_record_id,
        user_id: this_user.user_id,
        user_name: this_user.user_name,
        table_name: 'repair_record',
        difference: JSON.stringify(difference),
        snapshot: JSON.stringify(to_repair_record),
        create_time: (new Date()).toISOString()
      });
    }

    return to_repair_record
  }

  async remove(this_user:UserWithPermission, id: number): Promise<boolean> {
    var from_repair_record = await this.repairRecordRepository.findOne({
      where: {
        repair_record_id:id,
      },
    });

    await this.repairOrderHistoryService.create(this_user, {
      repair_order_id: from_repair_record.repair_order_id,
      repair_item_id: from_repair_record.repair_item_id,
      user_id: this_user.user_id,
      user_name: this_user.user_name,
      table_name: 'repair_record',
      difference: JSON.stringify({
        remove: from_repair_record
      }),
      snapshot: JSON.stringify(null),
      create_time: (new Date()).toISOString()
    });

    const result = await this.repairRecordRepository.delete(id);
    return result.affected > 0;
  }

}