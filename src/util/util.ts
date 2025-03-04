
import { HttpException, HttpStatus } from "@nestjs/common";
import { AppConfigService } from "../app_config.service";
import * as sharp from 'sharp';
import { InfluxdbClientService } from "src/modules/device_data/influxdb_client.service";
import { MailService } from "src/modules/mail/mail.service";
import { UserWithPermission } from "src/modules/user/user_with_permission.entity";

const {InfluxDB, Point} = require('@influxdata/influxdb-client')
const path = require('node:path');
const fs = require('fs');

var moment = require('moment-timezone');
require('moment/locale/zh-tw');

export class Util {

  static diffObject(src, dst) {
    var diff = {};
    var add = {};
    var remove = {};
    for (var key in src) {
      if (!(key in dst)) {
        remove[key] = src[key];
      } else if (src[key] != dst[key]) {
        diff[key] = {
          src: src[key],
          dst: dst[key]
        }
      }
    }
    for (var key in dst) {
      if (!(key in src)) {
        add[key] = dst[key];
      }
    }
    return {
      modified: Object.keys(diff).length>0 || Object.keys(add).length>0 || Object.keys(remove).length>0,
      remove: remove,
      add: add,
      diff: diff
    }
  }

  static sum(arr) {
    var count = 0
    var s = 0
    for (var v of arr) {
      if (v!=null) {
        count ++
        s += v
      }
    }
    return count==0 ? null : s
  }
  
  static avg(arr) {
    var count = 0
    var s = 0
    for (var v of arr) {
      if (v!=null) {
        count ++
        s += v
      }
    }
    return count==0 ? null : s / count
  }

  static min(arr) {
    var count = 0
    var m = Number.MAX_SAFE_INTEGER
    for (var v of arr) {
      if (v!=null) {
        count ++
        m = Math.min(m, v)
      }
    }
    return count==0 ? null : m
  }

  static max(arr) {
    var count = 0
    var m = Number.MIN_SAFE_INTEGER
    for (var v of arr) {
      if (v!=null) {
        count ++
        m = Math.max(m, v)
      }
    }
    return count==0 ? null : m
  }

  static secondsToHHMMSS(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return [
        String(hours).padStart(2, '0'),
        String(minutes).padStart(2, '0'),
        String(secs).padStart(2, '0')
    ].join(':');
  }

  static getRelativeTime(time, timezone) {
    let new_time = time
    if (time==null) {
      new_time = (new Date()).toISOString()
    } else if (time=='0') {
      new_time = time
    } else if (/^\-[0-9]+([smhdwy]|mo)$/.test(time)) {
      var v = parseInt(time)
      for (var n=1;n<time.length;n++) {
        if (time.charCodeAt(n)<48 || time.charCodeAt(n)>57) { // '0':48, '9':57
          break;
        }
      }
      let start_unit = time.substring(n,time.length)

      var start_msec = (new Date()).getTime()
      start_msec = Math.floor(start_msec / 1000) * 1000
      var m = moment.tz(start_msec, timezone);

      if (start_unit=='s')       m.add(v, 'seconds');
      else if (start_unit=='m')  m.add(v, 'minutes');
      else if (start_unit=='h')  m.add(v, 'hours');
      else if (start_unit=='d')  m.add(v, 'days');
      else if (start_unit=='w')  m.add(v, 'weeks');
      else if (start_unit=='mo') m.add(v, 'months');
      else if (start_unit=='y')  m.add(v, 'years');

      new_time = m.toISOString()
    } else {
      if (!Util.isDateValid(time)) {
        throw new HttpException('"time" is invalid', HttpStatus.BAD_REQUEST);
      }
      new_time = (new Date(time)).toISOString()
    }
    return new_time
  }

  static alignTime(time, every, timezone) {
    for (var n=1;n<every.length;n++) {
      if (every.charCodeAt(n)<48 || every.charCodeAt(n)>57) { // '0':48, '9':57
        break;
      }
    }
    let every_value = parseInt(every)
    if (every_value==0) {
      throw new HttpException('"every" is 0', HttpStatus.BAD_REQUEST);
    }
    let every_unit = every.substring(n,every.length)


    var m1 = moment.tz(time, timezone)
    var m2 = moment.tz(time, timezone)
    var last
    if (every_unit=='s'){
      last = Math.floor(m1.second() / every_value) * every_value
      m2.startOf('second')
      m2.second(last); 
    } else if (every_unit=='m') {
      last = Math.floor(m1.minute() / every_value) * every_value
      m2.startOf('minute')
      m2.minute(last); 
    } else if (every_unit=='h') {
      last = Math.floor(m1.hour() / every_value) * every_value
      m2.startOf('hour')
      m2.hour(last); 
    } else if (every_unit=='d') {
      last = Math.floor((m1.date()-1) / every_value) * every_value + 1
      m2.startOf('date')
      m2.date(last); 
    } else if (every_unit=='mo') {
      last = Math.floor(m1.month() / every_value) * every_value
      m2.startOf('month')
      m2.month(last); 
    } else if (every_unit=='y') {
      last = Math.floor(m1.year() / every_value) * every_value
      m2.startOf('year')
      m2.year(last); 
    }

    return m2.toISOString()


    /*
    var diff_sec = stop_sec - start_sec
    var every_sec
    let last_sec = stop_sec
    if (every_unit=='s') {
      every_sec = every_value
      last_sec = start_sec + Math.floor(diff_sec / every_sec) * every_sec
    } else if (every_unit=='m') {
      every_sec = every_value * 60
      last_sec = start_sec + Math.floor(diff_sec / every_sec) * every_sec
    } else if (every_unit=='h') {
      every_sec = every_value * 3600
      last_sec = start_sec + Math.floor(diff_sec / every_sec) * every_sec
    } else if (every_unit=='d') {
      every_sec = every_value * 86400
      last_sec = start_sec + Math.floor(diff_sec / every_sec) * every_sec
    } else if (every_unit=='w') {
      every_sec = every_value * 604800
      last_sec = start_sec + Math.floor(diff_sec / every_sec) * every_sec
    } else if (every_unit=='mo') {
      if (every_value!=1) {
        throw new HttpException('Not supported for "every" is not 1 when "stop_align_every" is assigned', HttpStatus.METHOD_NOT_ALLOWED);
      }
      var m2 = moment.tz(stop_sec*1000, timezone2)
      m2.startOf('month')
      last_sec = m2.unix()
    } else if (every_unit=='y') {
      if (every_value!=1) {
        throw new HttpException('Not supported for "every" is not 1 when "stop_align_every" is assigned', HttpStatus.METHOD_NOT_ALLOWED);
      }
      var m2 = moment.tz(stop_sec*1000, timezone2)
      m2.startOf('year')
      last_sec = m2.unix()
    }

    params.stop = (new Date(last_sec*1000)).toISOString()
    */

  }

  static numberWithCommas(x) {
    if (x==null || isNaN(x) || (''+x)=='') return '';
    var v = Math.floor(parseFloat(x) * 100)/100;
    return v.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  }

  static isSuperset<T>(bigset:Set<T>|Array<T>, subset:Set<T>|Array<T>) {
    var bigset2:Set<T>
    if (Array.isArray(bigset)) {
      bigset2 = new Set(bigset)
    } else {
      bigset2 = bigset
    }
    for (var elem of subset) {
      if (!bigset2.has(elem)) {
        return false;
      }
    }
    return true;
  }

  static hasOneInSubset<T>(bigset:Set<T>|Array<T>, subset:Set<T>|Array<T>) {
    var bigset2:Set<T>
    if (Array.isArray(bigset)) {
      bigset2 = new Set(bigset)
    } else {
      bigset2 = bigset
    }
    for (var elem of subset) {
      if (bigset2.has(elem)) {
        return true;
      }
    }
    return false;
  }

  static unionSet<T>(setA: Set<T>|Array<T>, setB: Set<T>|Array<T>): Set<T> {
    return new Set([...setA, ...setB])
    /*
    const result = new Set<T>(setA);  // 創建一個新 Set，並把 setA 的元素加入
    setB.forEach(item => result.add(item));  // 將 setB 的元素添加到 result 中（不會重複）
    return result;
    */
  }

  static intersectionSet<T>(setA: Set<T>, setB: Set<T>|Array<T>): Set<T> {
    var intersection:Set<T> = new Set();
    for (var elem of setB) {
      if (setA.has(elem)) {
        intersection.add(elem);
      }
    }
    return intersection;
  };

  static differenceSet<T>(setA: Set<T>|Array<T>, setB: Set<T>|Array<T>): Set<T> {
    var difference = new Set(setA);
    for (var elem of setB) {
      difference.delete(elem);
    }
    return difference;
  }


  static hasPermission(this_user:UserWithPermission, perms:Array<String>|Set<String>) {
    var perms2 = ["all_perm", ...perms]
    return Util.hasOneInSubset(this_user.permissions, perms2)
  }

  static getViewPermissionByTable(table_name) {
    return [`view:${table_name}`, `edit:${table_name}`, `manage:${table_name}`]
  }


  // 檢查括號是否對稱
  static checkParenthesesBalance(s) {
    // 用來儲存左括號的堆疊
    const stack = [];
    
    // 配對的右括號對應的左括號
    const matchingPairs = {
        ')': '(',
        ']': '[',
        '}': '{'
    };

    // 遍歷字串中的每個字符
    for (let char of s) {
        // 如果是左括號，將其推入堆疊
        if (char === '(' || char === '[' || char === '{') {
            stack.push(char);
        }
        // 如果是右括號，檢查堆疊中的左括號是否匹配
        else if (char === ')' || char === ']' || char === '}') {
            // 如果堆疊是空的或頂部元素不匹配，則返回 false
            if (stack.length === 0 || stack[stack.length - 1] !== matchingPairs[char]) {
                return false;
            }
            // 弹出堆疊頂部的元素
            stack.pop();
        }
    }

    // 如果堆疊中還有剩餘的左括號，說明不匹配
    return stack.length === 0;
  }

  static isDateValid(dateStr) {
    var v:any = new Date(dateStr)
    return !isNaN(v);
  }

  static createUUID() {
    var d = Date.now();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
      d += performance.now(); //use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

  static createRandomID() {
    return Util.createUUID().replace(/\-/g, '')
  }


  // const inputString = "/ab/${cde}fgh/${ij}klm";
  // const outputArray = extractVariables(inputString);
  // console.log(outputArray); // 輸出: ["cde", "ij"]
  static extractVariables(inputString:string):Array<string> {
    const pattern = /\${(.*?)}/g; // 匹配"${}"中的任何字串，並捕獲其中的內容
    const matches = [];
    let match;
    while ((match = pattern.exec(inputString)) !== null) {
        matches.push(match[1].trim()); // 將匹配的字串加入到結果陣列中
    }
    return matches;
  }

  // const template = "/ab/${cde.xx}fgh/${ij}klm";
  // const args = [{name: "cde.xx", value: "12"}, {name: "ij", value: "345"}];
  // const outputString = fillTemplate(template, args);
  // console.log(outputString); // 輸出: "/ab/12fgh/345klm"
  static fillTemplate(template:string, args:Array<{name:string,value:string}>):string {
    // 將輸入模板中的"${}"替換為對應的值
    for (let arg of args) {
        const regex = new RegExp(`\\$\\{${arg.name}\\}`, 'g');
        template = template.replace(regex, arg.value);
    }
    return template;
  }


  static mergeDatasByTime(data1s:Array<any>, data2s:Array<any>) {
    var n1 = 0
    var n2 = 0
    var data0s = []
    var field = {}
    while(true) {
      if (n1>=data1s.length && n2>=data2s.length) break;
      if (n1<data1s.length && n2>=data2s.length) {
        for (var d in data1) {
          if (d!='_time') {
            if (data1[d]!=null) field[d] = data1[d]
          }
        }
        data0s.push({_time:data1.time, ...field})
        n1 ++
        continue;
      }
      if (n1>=data1s.length && n2<data2s.length) {
        for (var d in data2) {
          if (d!='_time') {
            if (data2[d]!=null) field[d] = data2[d]
          }
        }
        data0s.push({_time:data2.time, ...field})
        n2 ++
        continue;
      }

      var data1 = data1s[n1]
      var data2 = data2s[n2]
      var time1 = (new Date(data1._time)).getTime()
      var time2 = (new Date(data2._time)).getTime()
      if (time1==time2) {
        for (var d in data1) {
          if (d!='_time') {
            if (data1[d]!=null) field[d] = data1[d]
          }
        }
        for (var d in data2) {
          if (d!='_time') {
            if (data2[d]!=null) field[d] = data2[d]
          }
        }
        data0s.push({_time:data1.time, ...field})
        n1 ++
        n2 ++
      } else if (time1<time2) {
        for (var d in data1) {
          if (d!='_time') {
            if (data1[d]!=null) field[d] = data1[d]
          }
        }
        data0s.push({_time:data1.time, ...field})
        n1 ++
      } else if (time1>time2) {
        for (var d in data2) {
          if (d!='_time') {
            if (data2[d]!=null) field[d] = data2[d]
          }
        }
        data0s.push({_time:data2.time, ...field})
        n2 ++
      }
    }
    return data0s
  }

  static async sleep(msec) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(null);
        }, msec);
    });
  }

  static async ajax(url, options, is_return_response=false, time = 15000) {
    const controller = new AbortController();
    setTimeout(() => {
        controller.abort();
    }, time);
    const config = { ...options, signal: controller.signal };
    try {
        const response = await fetch(url, config);
        if (is_return_response) return response;

        var text = await response.text();
        if (response.status>=400) {
            console.log('Cannot load page "'+url+'". response('+response.status+')="'+text+'"');
            return null;
        } else {
            return text;
        }
        //const responseJson = await response.json();
        //return responseJson;
    } catch (error) {
        console.log('Cannot load page "'+url+'"');
        console.error(error);
        return null;
    }
  }

  static async getPhotos(dirname, id) {
    var config = AppConfigService.getSystemConfig();
    var phoths = [];
    var root_path = path.join(config.upload_path, dirname);
    if (!fs.existsSync(root_path)) {
      return phoths;
    }
    var dir_path = path.join(root_path, String(id));
    if (!fs.existsSync(dir_path)) {
      return phoths;
    }
    var files = fs.readdirSync(dir_path);
    for (var file of files) {
      phoths.push(config.download_path + '/' + dirname + '/' + id + '/' + file);
    }
    return phoths;
  }


  static async saveFile(repair_order_upload_path, repair_order_download_path, files: Express.Multer.File): Promise<Array<{
    originalname?:string,
    success:boolean,
    error:string
  }>> {

    var config = AppConfigService.getSystemConfig();

    var images: Array<Express.Multer.File> = [];
    if (Array.isArray(files)) {
      images = files;
    } else {
      images = [files];
    }

    var results = [];
    if (files==null) return results;

    for (var image of images) {
      var res = {
        originalname: image?.originalname,
        download: '',
        success: false,
        error: ''
      };
      results.push(res);
      try {
        /*
        var originalname = image.originalname;
        if (!/[^\u0000-\u00ff]/.test(originalname)) {
          originalname = Buffer.from(originalname, 'latin1').toString('utf8',);
        }
        res.originalname = originalname;
        var originalNameNoExt = path.parse(originalname).name;
        //const filename = Date.now() + '-' + originalNameNoExt + '.webp';
        */

        if (image.size>parseInt(config.max_upload_file_size)) {
          res.error = 'File size too large. filesize:('+image.size+' > '+config.max_upload_file_size+')';
          continue;
        }

        if (image.mimetype=='application/pdf') {
          //const filename = originalNameNoExt + '.pdf';
          const filename = Util.createUUID() + '.pdf';
          res.download = repair_order_download_path + '/' + filename;
          
          //const multerText = Buffer.from(file.buffer).toString("utf-8"); // this reads and converts the contents of the text file into string
          await fs.promises.writeFile(path.join(repair_order_upload_path, filename), image.buffer);
        } else {
          //const filename = originalNameNoExt + '.webp';
          const filename = Util.createUUID() + '.webp';
          res.download = repair_order_download_path + '/' + filename;

          var max_photo_wh = parseInt(config.max_photo_wh);
          var shp = await sharp(image.buffer);
          var metadata = await shp.metadata();
          console.log(metadata.width, metadata.height)
          if (metadata.width >= metadata.height && metadata.width>max_photo_wh) {
            shp.resize(null, null, {
              width: max_photo_wh,
              height: null,
              fit: 'contain'
            })
          } else if (metadata.width < metadata.height && metadata.height>max_photo_wh) {
            shp.resize(null, null, {
              width: null,
              height: max_photo_wh,
              fit: 'contain'
            })
          }

          shp.webp({ effort: 3 })
          shp.toFile(path.join(repair_order_upload_path, filename));

          /*
          await sharp(image.buffer)
            .resize(800)
            .webp({ effort: 3 })
            .toFile(path.join(UPLOAD_DIR, filename));
          */
        }
        res.success = true;
      } catch(ex) {
        console.log(ex);
        res.error = ex.toString();
      }
    }
    return results;
  }

  static async notifyDeviceChanged() {
      Util.ajax("http://127.0.0.1:1880/notify_device_changed", {
          method: "POST",
          body: "",
          cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
          mode: 'cors', // no-cors, cors, *same-origin
      }, false, 10000).catch(ex=>{
        console.log(ex)
      })
  }

  // 將動態資料展平並寫入 InfluxDB
  static writeDynamicData(data, writeClient, measurement) {
    // 創建一個新的 Point
    const point = new Point(measurement);
    
    // 展平並處理 data
    function flattenAndAddFields(prefix, obj) {
      for (const [key, value] of Object.entries(obj)) {
        const fieldKey = prefix ? `${prefix}_${key}` : key;
        if (typeof value === 'object' && !Array.isArray(value)) {
          // 對象，遞歸處理
          flattenAndAddFields(fieldKey, value);
        } else if (Array.isArray(value)) {
          // 陣列，處理每個元素
          value.forEach((item, index) => {
            if (typeof item === 'number') {
              point.floatField(`${fieldKey}_${index}`, item);
            } else if (typeof item === 'string') {
              point.stringField(`${fieldKey}_${index}`, item);
            }
          });
        } else if (typeof value === 'number') {
          // 數字欄位
          point.floatField(fieldKey, value);
        } else if (typeof value === 'string') {
          // 字符串欄位
          point.stringField(fieldKey, value);
        }
      }
    }
    
    flattenAndAddFields('', data);
    
    // 設定時間戳（如果需要，這裡使用當前時間）
    point.timestamp(new Date());

    /*
    var influxdb_client = InfluxdbClientService.getClient();
    var org = AppConfigService.getInfluxdbConfig().org;
    let writeClient = influxdb_client.getWriteApi(org, bucket, 'ms')
    */

    // 寫入點到 InfluxDB
    writeClient.writePoint(point);
  }

}
