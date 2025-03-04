import { HttpException, HttpStatus, Inject, Injectable, OnModuleInit, Post, UseGuards, Request, Body } from '@nestjs/common';
import { MailService } from './modules/mail/mail.service';
import { Event } from './modules/event/event.entity';
import { EventService } from './modules/event/event.service';
import { RepairOrder, RepairOrderUpdate } from './modules/repair_order/repair_order.entity';
import { DomainService } from './modules/domain/domain.service';
import { UserService } from './modules/user/user.service';
import { Domain } from './modules/domain/domain.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AppConfigService } from './app_config.service';
import { InfluxdbClientService } from './modules/device_data/influxdb_client.service';
import { DeviceService } from './modules/device/device.service';
import { Util } from './util/util';
import { DataStorerManager } from './modules/data_storer/mqtt.service';
import { Cron } from '@nestjs/schedule';
import { DeviceSpecStorer } from './modules/device_data/device_spec_storer.service';
import { UserWithPermission } from './modules/user/user_with_permission.entity';
import { LocalAuthGuard } from './modules/auth/local-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { PhoneNotifyDto } from './app.entity';

// const admin = require('firebase-admin');
// //const serviceAccount = require('../key/notify-test-61814-firebase-adminsdk-6lfws-14c8a5fb82.json'); // 替换为你的服务账户文件路径
// const serviceAccount = require('../key/aegis-test-map-firebase-adminsdk-fwnn2-6daff4c1f4.json'); // 替换为你的服务账户文件路径

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

@Injectable()
export class AppService {

  constructor(
    @InjectRepository(Domain) public readonly domainRepository: Repository<Domain>,
    @Inject(DomainService) public readonly domainService: DomainService,
    @Inject(UserService) public readonly userService: UserService,
    @Inject(MailService) public readonly mailService: MailService,
    @Inject(DeviceService) public readonly deviceService: DeviceService,
  //  @Inject(EventService) public readonly eventService: EventService,
  ) {
    //console.log("AppService - constructor");
  }

  getHello(): string {
    return 'Hello World!';
  }

  async notifyPhone(this_user:UserWithPermission, token, title, body): Promise<boolean> {
    console.log('推播通知已被跳過');
    return true; // 不執行 Firebase 發送
  };

  // async notifyPhone (this_user:UserWithPermission, token, title, body): Promise<boolean> {
  //   try {
  //     const response = await admin.messaging().send({
  //       token: token, // 設備的 FCM token
  //       notification: {
  //         title: title,
  //         body: body,
  //       },
  //       data: {
  //         // 可選的額外數據
  //         key1: 'value1',
  //         key2: 'value2',
  //       },
  //     });
  //     console.log('發送成功:', response);
  //     return true
  //   } catch (error) {
  //     console.error('發送失敗:', error);
  //     return false
  //   }
  // };
  
  async notifyUser(this_user:UserWithPermission, notify:{user_id,mail?:boolean,email?:boolean,line_notify?:boolean}, mail_type:string, message:string, device_id=undefined, repair_order_id=undefined) {

    if (notify.user_id==null) return;

    var user = await this.userService.findOne(this_user, notify.user_id);
    if (user==null) {
      console.log('notifyUser - user_id ('+notify.user_id+') is not found');
      return;
    }

    if (notify.mail) {
      await this.mailService.create(this_user, {
        mail_type: mail_type,
        user_id: notify.user_id,
        content: message,
        device_id: device_id,
        repair_order_id: repair_order_id,
        create_time: (new Date()).toISOString()
      })
    }

    if (notify.line_notify && user.line_notify_token!=null && user.line_notify_token.trim()!='') {
      await fetch('https://notify-api.line.me/api/notify', {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${user.line_notify_token}`
        },
        body: `message=${encodeURIComponent(message)}`,
        method: 'POST'
      })
    }
  }

  async notifyUserByEvent(this_user:UserWithPermission, event:Event, mail_type:string, message:string, device_id=undefined, repair_order_id=undefined) {

    var notifys = null;
    if (event.notifys!='') {
      try {
        notifys = JSON.parse(event.notifys);
      } catch (ex) {
        console.log(ex);
      }
    }
    if (!Array.isArray(notifys)) return;

    for (var notify of notifys) {
      await this.notifyUser(this_user, notify, mail_type, message, device_id, repair_order_id);
    }
  }


  /*
  async queryByFlux(fluxQuery, params={}) {
    return new Promise((resolve, reject) => {
      var config = AppConfigService.getInfluxdbConfig();
      var influxdb_client = InfluxdbClientService.getClient();

      let queryClient = influxdb_client.getQueryApi(config.org)

      var datas = [];
      queryClient.queryRows(fluxQuery, {
        next: (row, tableMeta) => {
          const tableObject = tableMeta.toObject(row)
          //console.log(tableObject)
          delete tableObject.result;
          delete tableObject._start;
          delete tableObject._stop;
          delete tableObject._measurement;
          datas.push(tableObject)
        },
        error: (error) => {
          console.error('\nError', error)
          reject(error)
        },
        complete: () => {
          console.log('\nSuccess')
          resolve(datas)
        },
      })
    });
  }
  */


  
}



/*
var time_tariffs:Array<{time:number, tariff:number}> = [
  {
      time: 5,
      tariff: 20
  }, {
      time: 10,
      tariff: 30
  }, {
      time: 15,
      tariff: 40
  }
];

var domainService = new DomainService(null);

var time_tariffs2 = JSON.parse(JSON.stringify(time_tariffs))
domainService.mergeTariff(time_tariffs2, 0, 3, 10);
console.log(time_tariffs2)

var time_tariffs2 = JSON.parse(JSON.stringify(time_tariffs))
domainService.mergeTariff(time_tariffs2, 0, 5, 10);
console.log(time_tariffs2)


var time_tariffs2 = JSON.parse(JSON.stringify(time_tariffs))
domainService.mergeTariff(time_tariffs2, 0, 7, 10);
console.log(time_tariffs2)


var time_tariffs2 = JSON.parse(JSON.stringify(time_tariffs))
domainService.mergeTariff(time_tariffs2, 5, 7, 10);
console.log(time_tariffs2)

var time_tariffs2 = JSON.parse(JSON.stringify(time_tariffs))
domainService.mergeTariff(time_tariffs2, 5, 10, 10);
console.log(time_tariffs2)

var time_tariffs2 = JSON.parse(JSON.stringify(time_tariffs))
domainService.mergeTariff(time_tariffs2, 5, 12, 10);
console.log(time_tariffs2)

var time_tariffs2 = JSON.parse(JSON.stringify(time_tariffs))
domainService.mergeTariff(time_tariffs2, 5, 15, 10);
console.log(time_tariffs2)

var time_tariffs2 = JSON.parse(JSON.stringify(time_tariffs))
domainService.mergeTariff(time_tariffs2, 7, 17, 10);
console.log(time_tariffs2)

var time_tariffs2 = JSON.parse(JSON.stringify(time_tariffs))
domainService.mergeTariff(time_tariffs2, 15, 17, 10);
console.log(time_tariffs2)

var time_tariffs2 = JSON.parse(JSON.stringify(time_tariffs))
domainService.mergeTariff(time_tariffs2, 7, 17, 10);
console.log(time_tariffs2)

var time_tariffs2 = JSON.parse(JSON.stringify(time_tariffs))
domainService.mergeTariff(time_tariffs2, 6, 12, 10);
console.log(time_tariffs2)

time_tariffs2 = [
  {
      time: 1716781019000,
      tariff: 20
  }, {
      time: 1716781119000,
      tariff: 30
  }, {
      time: 1716781219000,
      tariff: 40
  }
]
domainService.mergeTariff(time_tariffs2, 1716781009000, 1716781018000, 10);
console.log(time_tariffs2)

time_tariffs2 = [
  {
      time: 1716781019000,
      tariff: 20
  }, {
      time: 1716781119000,
      tariff: 30
  }, {
      time: 1716781219000,
      tariff: 40
  }
]
domainService.mergeTariff(time_tariffs2, 1716781019000, 1716781215000, 50);
console.log(time_tariffs2)

var xxx = 123;
*/