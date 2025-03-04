import { Controller, Get, Post, Put, Delete, Param, Body, ValidationPipe, UsePipes, Patch, Query, HttpCode, UseGuards, Request, HttpException, HttpStatus } from '@nestjs/common';
import { PowerSchedulerService } from './power_scheduler.service';
import { PowerScheduler, PowerSchedulerUpdate } from './power_scheduler.entity';
import { PowerSchedulerControllerBase } from './power_scheduler.controller.base';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { Util } from 'src/util/util';
import { PowerSchedulerExService } from './power_schedulerex.service';

@Controller('api/power_schedulers')
export class PowerSchedulerController extends PowerSchedulerControllerBase {
  constructor(
    public readonly powerSchedulerService: PowerSchedulerService,
    public readonly powerSchedulerExService: PowerSchedulerExService,
  ) {
    super(powerSchedulerService)
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Post()
  async create(@Request() req, @Body() powerScheduler: PowerSchedulerUpdate): Promise<PowerScheduler> {
    var crons = JSON.parse(powerScheduler.crons)
    if (!Array.isArray(crons) || crons.length<1) {
      throw new HttpException('Crons must be set', HttpStatus.BAD_REQUEST);
    }
    var ret = await this.powerSchedulerService.create(req.user, powerScheduler);
    await this.powerSchedulerExService.updateCronTasks(req.user);
    var cron = crons[0]

    /*
    var cron = [
      {
        "start_time": 0,
        "stop_time": 86400,
        "weeks": "0,1,2,3,4,5,6",
        "power": -1000
      }
    ]
    */

    var text = `電池排程已新建, 即將在 ${Util.secondsToHHMMSS(cron.start_time)} 啟動, 在 ${Util.secondsToHHMMSS(cron.stop_time)} 結束, 預定放電功率 ${-cron.power} w`
    try {
      let data = {
        "start_time": Util.secondsToHHMMSS(cron.start_time),
        "stop_time": Util.secondsToHHMMSS(cron.stop_time),
        "charge_power": cron.power
      }
      await this.powerSchedulerExService.writeInfluxdb(req.user, ret.power_scheduler_id, ret.domain_id, 'create', JSON.stringify(data), text)
    } catch (ex) {
      console.log(ex)
    }
    try {
      await this.powerSchedulerExService.notify(req.user, ret.notify_user_id, text)
    } catch (ex) {
      console.log(ex)
    }

    return ret
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @HttpCode(204)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async update(@Request() req, @Param('id') id: number, @Body() updatePowerScheduler: PowerSchedulerUpdate): Promise<PowerScheduler> {
    var crons = null
    if ("crons" in updatePowerScheduler) {
      crons = JSON.parse(updatePowerScheduler.crons)
      if (!Array.isArray(crons) || crons.length<1) {
        throw new HttpException('Crons must be set', HttpStatus.BAD_REQUEST);
      }
    }
    updatePowerScheduler.update_time = (new Date()).toISOString()
    var ret = await this.powerSchedulerService.update(req.user, id, updatePowerScheduler);
    this.powerSchedulerExService.updateCronTasks(req.user);
    await Util.sleep(3000)

    if (Array.isArray(crons) && crons.length>0) {
      var cron = crons[0]

      var text = `電池排程已更新, 即將在 ${Util.secondsToHHMMSS(cron.start_time)} 啟動, 在 ${Util.secondsToHHMMSS(cron.stop_time)} 結束, 預定放電功率 ${-cron.power} w`
      try {
        let data = {
          "start_time": Util.secondsToHHMMSS(cron.start_time),
          "stop_time": Util.secondsToHHMMSS(cron.stop_time),
          "charge_power": cron.power
        }
        await this.powerSchedulerExService.writeInfluxdb(req.user, ret.power_scheduler_id, ret.domain_id, 'update', JSON.stringify(data), text)
      } catch (ex) {
        console.log(ex)
      }

      try {
        await this.powerSchedulerExService.notify(req.user, ret.notify_user_id, text)
      } catch (ex) {
        console.log(ex)
      }
    }

    return ret
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  async remove(@Request() req, @Param('id') id: number): Promise<boolean> {
    var ret = this.powerSchedulerService.remove(req.user, id);
    await this.powerSchedulerExService.updateCronTasks(req.user);
    return ret
  }

  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @Post('/update_cron_tasks')
  updateCronTasks(@Request() req): Promise<any> {
    return this.powerSchedulerExService.updateCronTasks(req.user);
  }

  /*
  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The PowerScheduler record'
  })
  @Get('/domain/:domain_id')
  findOne(@Param('domain_id') domain_id: number): Promise<any> {
    return this.powerSchedulerExService.queryDomain(domain_id);
  }
  */


  @UseGuards(LocalAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The PowerScheduler record'
  })
  @Get(':power_scheduler_id/history')
  async queryDomain(@Request() req, @Param('power_scheduler_id') power_scheduler_id: number): Promise<any> {
    var power_scheduler = await this.powerSchedulerService.findOne(req.user, power_scheduler_id)
    if (power_scheduler==null) {
      throw new HttpException('PowerScheduler is not found', HttpStatus.NOT_FOUND);
    }
    var records = await this.powerSchedulerExService.queryHistory(power_scheduler);
    var stop_stable_records = records.filter(x=>x.type=='stop_stable')

    var stop_records = []
    for (var rec of records) {
      if (rec.type=='stop' && rec.data!=null && rec.data!='') {
        try {
          var d = JSON.parse(rec.data)
          if (d.charge_power!=null && parseFloat(d.charge_power)<0) {
            stop_records.push(rec)
          }
        } catch (ex) {
          console.log(ex)
        }
      }
    }

    var purchase_energy = 0
    var sell_energy = 0
    for (var record of records) {
      if (record.type=='start' || record.type=='stop') {
        if (record.purchase_energy!=null) purchase_energy += record.purchase_energy;
        if (record.sell_energy!=null) sell_energy += record.sell_energy;
      }
    }
    /*
    for (var rec of stop_stable_records) {
      if (rec.purchase_energy!=null) purchase_energy += rec.purchase_energy;
      if (rec.sell_energy!=null) sell_energy += rec.sell_energy;
    }
    */

    var start_time = (power_scheduler.start_time!=null)?(new Date(power_scheduler.start_time)).getTime():null;
    var stop_time = (power_scheduler.stop_time!=null)?(new Date(power_scheduler.stop_time)).getTime():null;

    var records2 = []
    var n = 0
    for (var record of records) {
      if (n==10) break;
      records2.push(record)
      n++
    }

    return {
      "running": this.powerSchedulerExService.isCronTaskRunning(),
      "complete_count": stop_records.length,
      "purchase_energy": purchase_energy,
      "sell_energy": sell_energy,
      "records": records2
    }
  }

}