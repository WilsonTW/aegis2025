import { HttpException, HttpStatus, Injectable, OnModuleInit } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { InfluxdbClientService } from "./influxdb_client.service";
import { DomainService } from "../domain/domain.service";
import { DeviceService } from "../device/device.service";
import { Util } from "src/util/util";
import { AppConfigService } from "src/app_config.service";
import { DeviceDataService } from "./device_data.service";

var moment = require('moment-timezone');
require('moment/locale/zh-tw');

const {InfluxDB, Point} = require('@influxdata/influxdb-client')
const {DeleteAPI} = require('@influxdata/influxdb-client-apis')

@Injectable()
export class DeviceDataPredictionService implements OnModuleInit {

  static SOLAR_PREDICTION_MEASUREMENT_NAME = 'solar_prediction';

  constructor(
    public readonly influxdbClientService:InfluxdbClientService,
    //public readonly deviceDataService: DeviceDataService,
    public readonly domainService: DomainService,
    public readonly domainServiceEx: DomainService,
    public readonly deviceService: DeviceService
  ) {}

  onModuleInit() {
    // this.executeCronJob();
  }

  //@Cron('0 * * * * *')  // every minute, on the 0th second
  @Cron('0 0 */3 * * *')  // every 3 hours
  handleCron() {
    this.executeCronJob();
  }

  async executeCronJob() {

    var test_mode = AppConfigService.getSystemConfig().test_mode
    if (test_mode) return;

    console.log('>>> ' + (new Date()).toISOString()+' DeviceDataPredictionService - executeCronJob')

    var system_user = AppConfigService.getSystemUser()

    try {

      var org = AppConfigService.getInfluxdbConfig().org;
      //var influxdb_client = InfluxdbClientService.getClient();

      type Prediction = {
      //  domain_id: number,
      //  device_id: number,
        lat: string,
        lng: string,
        timezone: string,
        times?: string[]
        direct_radiations?: number[]
      }
      var predictions:Prediction[] = []
      var domains = await this.domainService.findAll(system_user, {where:{parent_domain_id:1}})
      for (var domain of domains) {
        var bucket = domain.domain_name
        var measurement = DeviceDataPredictionService.SOLAR_PREDICTION_MEASUREMENT_NAME
        var devices = await this.domainServiceEx.getAllDevices(system_user, this.deviceService, domain.domain_id, {}, 1000000)
        for (var device of devices) {
          if (device.lat!=null && device.lng!=null && device.solar_capacity!=0 && device.lat!='' && device.lng!='') {
            var new_prediction:Prediction = {
            //    domain_id: domain.domain_id,
            //    device_id: device.device_id,
                lat: device.lat,
                lng: device.lng,
                timezone: null,
                times: null,
                direct_radiations: null
            }
            var prediction = predictions.find(x=>x.lat==device.lat && x.lng==device.lng)
            if (prediction!=null) {
              new_prediction.timezone = prediction.timezone
              new_prediction.times = prediction.times
              new_prediction.direct_radiations = prediction.direct_radiations
            } else {
              try {
                await Util.sleep(1000)
                // https://api.open-meteo.com/v1/dwd-icon?latitude=22.921&longitude=120.29&minutely_15=direct_radiation&timezone=Asia%2FTaipei
                console.log(`    query direct_radiation. latitude=${device.lat}, longitude=${device.lng}`);
                var url = `https://api.open-meteo.com/v1/dwd-icon?latitude=${device.lat}&longitude=${device.lng}&minutely_15=direct_radiation&timezone=Asia%2FTaipei`
                var response = await fetch(url, {
                  method: "GET",
                  cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                  mode: 'cors', // no-cors, cors, *same-origin
                })
                var result = await response.json()
                if (result?.timezone!=null && result?.minutely_15!=null) {
                  var minutely_15 = result?.minutely_15;
                  if (Array.isArray(minutely_15.time) && Array.isArray(minutely_15.direct_radiation) && minutely_15.time.length==minutely_15.direct_radiation.length) {
                    new_prediction.timezone = result.timezone
                    new_prediction.times = minutely_15.time
                    new_prediction.direct_radiations = minutely_15.direct_radiation
                  }
                  //moment.tz("2024-06-24T13:00", result.timezone).toISOString();
                }
              } catch (ex) {
                console.log(ex)
              }
            }

            if (new_prediction.direct_radiations!=null) {
              try {
                var prediction = predictions.find(x=>x.lat==device.lat && x.lng==device.lng)
                if (prediction==null) predictions.push(new_prediction)

                const delete_old = false
                if (delete_old) {
                  var influxdb_client2 = InfluxdbClientService.getClient();
                  const deleteAPI = new DeleteAPI(influxdb_client2)
                  // define time interval for delete operation
                  const start = new Date()
                  const stop = new Date(start.getTime() + 5 * 24 * 60 * 60 * 1000)
                
                  await deleteAPI.postDelete({
                    org,
                    bucket,
                    // you can better specify orgID, bucketID in place or org, bucket if you already know them
                    body: {
                      start: (new Date("2000-01-01 00:00:00")).toISOString(), //start.toISOString(),
                      stop: stop.toISOString(),
                      // see https://docs.influxdata.com/influxdb/latest/reference/syntax/delete-predicate/
                      predicate: `_measurement="${measurement}" AND DeviceName="${device.device_name}"`,
                    },
                  })
                }

                var timezone = new_prediction.timezone
                var direct_radiations = new_prediction.direct_radiations;
                var times = new_prediction.times;

                var influxdb_client = InfluxdbClientService.getClient();
                let writeClient = influxdb_client.getWriteApi(org, bucket, 'ms')
                var size = times.length;
                for (var n=0; n<size; n++) {
                  var solar_power = null
                  if (device.solar_area != null && device.solar_eff!=null) {
                    solar_power = direct_radiations[n] * device.solar_area * device.solar_eff
                  }
                  //var time = moment.tz("2024-06-24T13:00", timezone).toISOString();
                  var time = moment.tz(times[n], timezone).toISOString();
                  let point = new Point(measurement)
                  point.tag('DeviceName', device.device_name)
                  if (device.solar_area!=null) point.floatField('SolarArea', device.solar_area)
                  if (device.solar_eff!=null) point.floatField('SolarEff', device.solar_eff)
                  if (direct_radiations[n]!=null) point.floatField('DirectRadiation', direct_radiations[n])
                  if (solar_power!=null) point.floatField('SolarPower', solar_power)
                  point.timestamp(new Date(time))
                  writeClient.writePoint(point)
                }
                await writeClient.flush();
              } catch (ex) {
                console.log(ex)
              }
            }
          }
        }
      }


    } catch (ex) {
      console.log(ex)
    }

  }

}