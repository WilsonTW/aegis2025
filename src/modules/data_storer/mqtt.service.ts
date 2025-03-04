import { HttpException, HttpStatus, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Device } from '../device/device.entity';
import { Cron, Timeout } from '@nestjs/schedule';
import { DeviceConnection } from '../device_connection/device_connection.entity';
import { DeviceType } from '../device_type/device_type.entity';
import { Domain } from '../domain/domain.entity';
import { DomainService } from '../domain/domain.service';
import { DeviceService } from '../device/device.service';
import { DeviceOutput } from '../device_output/device_output.entity';
import { InfluxdbClientService } from '../device_data/influxdb_client.service';
import { AppConfigService } from 'src/app_config.service';
import { DarkBox } from '../../util/darkbox'
import { EventService } from '../event/event.service';
import { MailService } from '../mail/mail.service';
import { Util } from '../../util/util';
import { AppService } from '../../app.service';
import { DeviceTypeService } from '../device_type/device_type.service';
import { DeviceInput } from '../device_input/device_input.entity';
import { RecordConverter } from 'src/util/record_converter';

const {InfluxDB, Point} = require('@influxdata/influxdb-client')

const mqtt = require("mqtt");
//const DarkBox = require("../../util/d");


type DeviceOutputEx = DeviceOutput & { properties?: any, program_root?:any }

var dataStorerManager:DataStorerManager = null;
//var device_clients:Array<DeviceClient> = [];

class DeviceClient {

  public client:any;
//  public domain:Domain
  public device_connection:DeviceConnection
  public device_outputs:Array<DeviceOutput>

  public onDataListener: {
    onData:(device_client:DeviceClient, response_data:any)=>any
  };

  public onEventListener: {
    onConnect:(device_client:DeviceClient)=>any
    onDisconnect:(device_client:DeviceClient)=>any
    onError:(device_client:DeviceClient, error:any)=>any
  };

  constructor() {
    console.log('DeviceClient constructor');
  }
  public async connect() {}
  public async disconnect() {}
  public async write() {}
  public async read() {}
}

class MqttClient extends DeviceClient {

  client:any;

  public async connect() {

    var device_connection = this.device_connection;

    if (device_connection.host==null) return;

    const option = {
      host: device_connection.host,
      port: device_connection.port,
      // enable automatic reconnect
      clientId: 'aegis_' + Math.random().toString(16).substring(2, 10),
      username: device_connection.username,
      password: device_connection.password,
      keepalive: 60,  //6s
      reconnectPeriod: 2*60*1000, // 120s
    };

    const client = mqtt.connect(option);
    this.client = client;

    client.on("connect", async() => {
      console.log(`MQTT server is connected. connection_id:${device_connection.device_connection_id}, connection_name:${device_connection.device_connection_name}, host:${device_connection.host}`);
      if (typeof(this?.onEventListener?.onConnect)=='function') {
        await this.onEventListener.onConnect(this);
      }
    });
    
    client.on("message", async (topic, message) => {
      // message is Buffer
      if (typeof(this?.onDataListener?.onData)=='function') {
        await this.onDataListener.onData(this, {topic, message});
      }
    });
    
    client.on('reconnect', () => {
      console.log('MQTT server reconnecting...');
    });
      
    client.on('error', async (error) => {
      console.log('MQTT error:', error);
      if (typeof(this?.onEventListener?.onError)=='function') {
        await this.onEventListener.onError(this, error);
      }
    });

  }

  async disconnect(): Promise<void> {
    if (this.client!=null) {
      try {
        console.log('MQTT disconnect - ('+this?.device_connection?.device_connection_id+') ' + this?.device_connection?.device_connection_name + ' (' + this?.device_connection?.host + ')');
        await this.client.end();
      } catch (ex) {
        console.log(ex);
      }
    }
  }

}




@Injectable()
export class DataStorerManager implements OnModuleInit {

  influxdb_client: any;
  device_clients: Array<DeviceClient> = [];
  last_trigger_times:Array<{
    event_id:number,
    device_id:number,
    time:number
  }> = []

  constructor(
    public readonly appService: AppService,
    public readonly domainService: DomainService,
    public readonly deviceTypeService: DeviceTypeService,
    public readonly deviceService: DeviceService,
    public readonly mailService: MailService,
    public readonly eventService: EventService,


    //  @InjectRepository(Domain) public readonly domainRepository: Repository<Domain>,
  //  @InjectRepository(DeviceType) public readonly deviceTypeRepository: Repository<DeviceType>,
  //  @InjectRepository(DataStorer) public readonly dataStorerRepository: Repository<DataStorer>,
  //  @InjectRepository(Device) public readonly deviceRepository: Repository<Device>,
    @InjectRepository(DeviceOutput) public readonly deviceOutputRepository: Repository<DeviceOutput>,
    @InjectRepository(DeviceInput) public readonly deviceInputRepository: Repository<DeviceInput>,
    @InjectRepository(DeviceConnection) public readonly deviceConnectionRepository: Repository<DeviceConnection>,
  //  @InjectRepository(SensorSchema) public readonly sensorSchemaRepository: Repository<SensorSchema>,
  //  public readonly influxdbClientService: InfluxdbClientService,
  ) {
    console.log('DataStorerManager constructor');

    /*
    var influxdb_config = AppConfigService.getInfluxdbConfig();
    this.influxdb_client = new InfluxDB({
        url: influxdb_config.url,
        token: influxdb_config.token
    });
    */
    dataStorerManager = this;
  }

  onModuleInit() {
    console.log('DataStorerManager - onModuleInit')
  }

  static publicData(device_connection_id, topic:string, data:string) {
    try {
      var device_client = dataStorerManager.device_clients.find(x=>x.device_connection.device_connection_id==device_connection_id);
      if (device_client!=null) {
        device_client.client.publish(topic, data, {qos:0, retain:true}, (error) => {
          if (error) {
            console.error(error)
          }
        });
      }
    } catch (ex) {
      console.log(ex);
    }
  }

  /*
  static async notifyDevice(deviceIoService: DeviceIoService) {
    for (var device_client of device_clients) {
      var new_device_ios:Array<DeviceIo> = [];
      var device_ios = await deviceIoService.findAll();
      for (var device_io of device_ios) {
        if (device_io.device_connection_id==device_client.device_connection.device_connection_id && device_io.io_direction=='output') {
          if (device_client.device_connection.device_connection_type=='mqtt') {
            new_device_ios.push(device_io);
          }
        }
      }

      for (var device_io of new_device_ios) {
        console.log('public data to "'+device_io.mqtt_topic+'"\n' + device_io.template);
        device_client.client.publish(device_io.mqtt_topic, device_io.template);
        
        // try {
        //   var data = {
        //     "command": "SwitchMode",
        //     "parameters": {
        //       "mode": "Protection"
        //     }
        //   };
        //   console.log('public data to "/HERMES/EMS000001/control"');
        //   device_client.client.publish("/HERMES/EMS000001/control", JSON.stringify(data));
        // } catch (ex) {
        //   console.log(ex)
        // }
        
      }
    }
  }
  */

  async sleep(msec) {
      return new Promise((resolve, reject) => {
          setTimeout(() => {
              resolve(null);
          }, msec);
      });
  }

  async onConnect(device_client:DeviceClient) {
    var device_outputs = await this.deviceOutputRepository.find({
      where: {
        output_type: "mqtt",
        device_type_id: device_client.device_connection.device_type_id
      }
    })
    device_client.device_outputs = device_outputs;

    var topics = [];
    for (var device_output of device_outputs) {
      try {
        if (device_output.properties!=null && (''+device_output.properties).trim()!='') {
          var device_output2:DeviceOutputEx = device_output
          device_output2.properties = JSON.parse(device_output.properties)
          var program_root = RecordConverter.build(device_output2.properties)
          device_output2.program_root = program_root
        }
      } catch (ex) {
        console.log(ex)
      }
      var mqtt_topic:string|null = device_output.path?.trim();
      if (mqtt_topic!=null && mqtt_topic!='' && topics.indexOf(mqtt_topic)==-1) {
        topics.push(mqtt_topic)
      }
    }

    device_client.client.subscribe(topics, (err, granted) => {
      for (var g of granted) {
        console.log('MQTT topic "'+g.topic+'" is subscribed, err=', err);
      }
    });

  }
  
  async onDisconnect(device_client:DeviceClient) {}

  async onError(device_client:DeviceClient, error:any) {}
  
  async onData(device_client:DeviceClient, response_data: any) {
    var self = this;

    var {topic, message} = response_data;

    var system_user = AppConfigService.getSystemUser()

    var string_data = message.toString();
    console.log((new Date()).toISOString() + '[' + topic + '] ' + string_data);
    
    var data_org:any;
    try {
      data_org = JSON.parse(string_data);
    } catch (ex) {
      console.log(ex)
      return;
    }
    if (data_org==null) return;

    var events = await this.eventService.findAll(system_user);

    var device_connection = device_client.device_connection;
    var device_connection_id = device_connection.device_connection_id
    var domain_name = await this.domainService.getDomainName(device_connection.organization_id);
    if (domain_name==null) return;

    var connection_devices = await this.deviceService.findAll(system_user, {
      where:{
        device_connection_id: device_connection_id
      }
    })
    if (connection_devices.length==0) return;

    var influxdb_config = AppConfigService.getInfluxdbConfig();
    var influxdb_client = new InfluxDB({
        url: influxdb_config.url,
        token: influxdb_config.token
    });

    var org = AppConfigService.getInfluxdbConfig().org;
    let writeClient = influxdb_client.getWriteApi(org, domain_name, 'ms')

    var device_outputs:DeviceOutputEx[] = device_client.device_outputs;
    for (var device_output of device_outputs) {
      try {
        /*
        var vars = Util.extractVariables(data_storer.src_topic);
        var args = [];
        for (var v of vars) {
          args.push({name:v, value:'+'});
        }
        var src_topic = Util.fillTemplate(data_storer.src_topic, args);
        */

        var topic_device_name = null;
        var listen_topic = device_output.path;

        var regex_listen_topic = listen_topic.replaceAll('+', '(.*)')
        regex_listen_topic = regex_listen_topic.replaceAll('#', '(.*)')
        var matchs = [...topic.matchAll(new RegExp('^'+regex_listen_topic+'$','g'))]
        if (matchs.length>0) {
          if (matchs[0].length>1) {
            topic_device_name = matchs[0][matchs[0].length-1]
            if (topic_device_name=='') topic_device_name = null;
          }
        } else {
          continue;
        }

        /*
        var n = listen_topic.lastIndexOf('+')
        if (n!=-1) {
          var remain_length = listen_topic.length-(n+1);
          if (topic.substring(0,n)!=listen_topic.substring(0,n) || topic.substring(topic.length-remain_length,topic.length)!=listen_topic.substring(n+1,listen_topic.length)) continue;
          topic_device_name = topic.substring(n, topic.length - remain_length);
        } else {
          if (device_output.path!=topic) continue;
        }
        */

        var output_devices = connection_devices.filter(x=>x.device_type_id == device_output.device_type_id)

        var datas:any = Array.isArray(data_org)?data_org:[data_org];
        /*
        var devices = null;
        var device_names:Array<String> = [];
        for (var data of datas) {
          var device_name = getDeviceName(device_output, data, topic_device_name);
          if (!(device_name==null || (""+device_name).trim()=='')) {
            device_names.push(device_name)
          }
        }
        devices = await this.getAllDeviceByDomain(device_output.organization_id, device_output.device_type_id, device_names);
        */
 
        try {
          var need_store = (device_output.is_store && device_output.device_output_name!=null && device_output.device_output_name.trim()!='');
          var need_update_state = (device_output.device_state_field!=null);
          //var data_schema = JSON.parse(device_output?.data_schema);
          // data_schema = {
          //   "type": "array",
          //   "items": {
          //     "type": "object",
          //     "properties": {
          //       "device_name": {"type": "string"},
          //       "value1": {"type": "integer"}
          //       "value2": {"type": "number"}
          //     },
          //     "required": [
          //       "device_name"
          //     ]
          //   }
          // }
          if (domain_name!=null) {

            /*
            var props;
            if (data_schema.type=='object') {
              props = data_schema.properties;
            } else if (data_schema.type=='array') {
              props = data_schema.items.properties;
            }
            */

            //var store_tags = [];
            //var store_tags = [{tag:"device_order",source:"device_order"}]
            //if (device_output.store_tags!=null && device_output.store_tags.trim()!='') {
            //  store_tags = JSON.parse(device_output.store_tags)
            //}
            
            //var store_fields = null;
            //var store_fields = [{field:"SOC",source:"SOC"},]
            //if (device_output.store_fields!=null && device_output.store_fields.trim()!='') {
            //  store_fields = JSON.parse(device_output.store_fields)
            //}

            const DEVICE_NAME_MQTT_TOPIC = AppConfigService.DEVICE_NAME_MQTT_TOPIC
            const DEVICE_NAME_FIELD = AppConfigService.DEVICE_NAME_FIELD

            var properties = device_output.properties
            var program_root = device_output.program_root
            var all_has_data = false;
            
            for (var data of datas) {
              var device = null
              if (device_output.properties!=null) {
                if (topic_device_name!=null) {
                  data[DEVICE_NAME_MQTT_TOPIC] = topic_device_name
                }
                var records = await RecordConverter.toInfluxRecords(data, program_root)
                console.log(topic, ' : ', records)

                var device_name = null;
                for (var record of records) {
                  let found = false
                  for (var tag of record.tags) {
                    if (tag.name==DEVICE_NAME_FIELD) {
                      device_name = tag.value
                      found = true
                      break
                    }
                  }
                  if (found) break;
                }
                if (device_name==null) continue;
                device = output_devices.find(x=>x.device_name == device_name);
                if (device==null) continue;

                var field_to_update = {};
                if (need_update_state) {
                  var r = await DarkBox.evalScript(device_output.device_state_field, data, false)
                  if (r!=null && r!=device.device_state) field_to_update['device_state'] = r;
                  var r = await DarkBox.evalScript(device_output.device_error_code_field, data, false)
                  if (r!=null && r!=device.error_code) field_to_update['error_code'] = r;
                  var r = await DarkBox.evalScript(device_output.device_error_description_field, data, false)
                  if (r!=null && r!=device.error_description) field_to_update['error_description'] = r;
                }
                field_to_update['is_online'] = true;
                field_to_update['last_connect_time'] = (new Date()).toISOString();
                if (Object.keys(field_to_update).length>0) {
                  await this.deviceService.update(system_user, device.device_id, field_to_update);
                }
                if (need_store) {
                  for (var record of records) {
                    let point = new Point(device_output.device_output_name) //measurement_name
                    var has_data = false;
                    var tags = record.tags
                    for (var tag of tags) {
                      if (tag.value==null) continue;
                      if (tag.name=='time') {
                        point.timestamp(new Date(tag.value))
                      } else {
                        point.tag(tag.name, tag.value)
                      }
                    }
                    var fields = record.fields
                    for (var field of fields) {
                      var data_name = field.name
                      var data_value = field.value
                      var type = field.type;
                      if (type=='number' || type==null) {
                        var v = parseFloat(data_value);
                        if (!isNaN(v)) {
                          point.floatField(data_name, v)
                          has_data = true;
                        }
                      } else if (type=='integer') {
                        var v = parseInt(data_value);
                        if (!isNaN(v)) {
                          point.intField(data_name, v)
                          has_data = true;
                        }
                      } else if (type=='boolean') {
                        point.booleanField(data_name, (data_value=='1' || (''+data_value).toLowerCase()=='true'))
                        has_data = true;
                      } else if (type=='string') {
                        point.stringField(data_name, ''+data_value)
                        has_data = true;
                      }
                    }
                    if (has_data) {
                      writeClient.writePoint(point)
                      all_has_data = true
                    }
                  }
                }
              }

              if (device!=null) {
                for (var event of events) {
                  if (!event.enabled || event.event_type!='device') continue;
                  var is_trigger = true;
                  if (event.domain_id==null || event.device_type_id==null || event.device_output_id==null) is_trigger=false;
                  if (device.device_type_id!=event.device_type_id) is_trigger = false;
                  if (device_output.device_output_id!=event.device_output_id) is_trigger = false;
                  if (event.device_name!=null && event.device_name!='' && device.device_name!=event.device_name) is_trigger = false;
                  if (is_trigger) {
                    is_trigger = await this.domainService.includeDomain(event.domain_id, device.domain_id)
                  }

                  if (!is_trigger) continue;
                  try {
                    //var data_new = Object.assign({}, data_tag);
                    //Object.assign(data_new, data_field);
                    var data_new = Object.assign({}, data);
                    var context = {
                      device: device,
                      data: data_new
                    }
                    var ret = await DarkBox.evalScript(event.compare_function, context);
      
                    if (ret==true) {
                      var last_trigger_time = this.last_trigger_times.find(x=>x.event_id==event.event_id && x.device_id==device.device_id)
                      var prev_time = 0;
                      if (last_trigger_time==null) {
                        last_trigger_time = {
                          event_id: event.event_id,
                          device_id: device.device_id,
                          time: 0
                        }
                        this.last_trigger_times.push(last_trigger_time)
                      } else {
                        prev_time = last_trigger_time.time;
                      }
                      if (event.not_trigger_second==0 || Date.now()-prev_time>event.not_trigger_second*1000) {
                        last_trigger_time.time = Date.now();
                        //var re = new RegExp("`", "g");
                        var m = event.message.replace(/\`/g, '\'');
                        var new_message = await DarkBox.evalScript('`' + m + '`', context);
                        if (new_message!=null && (''+new_message).trim()!='') {
                          await this.appService.notifyUserByEvent(system_user, event, 'device', ''+new_message, device.device_id, null)
                        }
                      }
                    }
                  } catch (ex) {
                    console.log(ex);
                    continue;
                  }

                }

              }

            }
            try {
              if (need_store && all_has_data) await writeClient.flush();
            } catch(ex2) {
              console.log(ex2.message);
              /*
              if (ex2.statusCode==404 && (/bucket [\s\S]+ not found/.test(''+ex2.message))) {
                try {
                  //await influxDB.createDatabase(domain_name);
                  await this.influxdb_client.createDatabase(domain_name)
                  if (need_store) await writeClient.flush();
                } catch (ex3) {
                  console.log(ex3);
                }
              }
              */
            }
          }
        } catch (ex) {
          console.log(ex);
        }

      } catch (ex) {
        console.log(ex);
      }
    }

    //client.end();
  }

  public static async updateAllConnection() {
    if (dataStorerManager!=null) await dataStorerManager.updateAllConnection2();
  }

  public async updateAllConnection2() {

    var test_mode = AppConfigService.getSystemConfig().test_mode
    if (test_mode) return;

    console.log('updateAllConnection ...');

    for (var device_client of this.device_clients) {
      try {
        await device_client.disconnect();
      } catch (ex) {
        console.log(ex);
      }
    }
    dataStorerManager.device_clients = [];

    var system_user = AppConfigService.getSystemUser()
    
    try {
      //await this.domainServiceEx.getAllDevices(this.deviceService, domain.domain_id, {}, 1000000)
      var device_connections = await this.deviceConnectionRepository.find();
      var device_types = await this.deviceTypeService.findAll(system_user)
      var device_inputs = await this.deviceInputRepository.find()
      var device_outputs = await this.deviceOutputRepository.find()
      device_inputs.sort((a,b)=>{return a.run_order-b.run_order})
      for (var device_connection of device_connections) {
        try {
          if (!device_connection.enabled) continue;
          var device_type = device_types.find(x=>x.device_type_id==device_connection.device_type_id)
          if (device_type==null) continue;
          if (device_outputs.filter(x => x.device_type_id==device_connection.device_type_id && x.output_type=='mqtt').length>0) {
            var device_client = new MqttClient()
            device_client.device_connection = device_connection;
            device_client.onDataListener = this;
            device_client.onEventListener = this;
            this.device_clients.push(device_client);
            await device_client.connect()
          }
          if (device_inputs.filter(x => x.device_type_id==device_connection.device_type_id && x.input_type=='http' && x.autorun).length>0) {

          }
        } catch (ex) {
          console.log(ex);
        }
      }
    } catch (ex) {
      console.log(ex);
    }
  }

}